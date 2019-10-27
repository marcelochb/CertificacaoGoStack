import { parseISO, startOfDay, endOfDay, format } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

import Cache from '../../lib/Cache';

import UpdateMeetupService from '../services/UpdateMeetupService';
import CreateMeetupService from '../services/CreateMeetupService';

class MeetupController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;
    let keyDay = '0';

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);
      keyDay = format(searchDate, 'ddMMyyyy');

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }
    const cacheKey = `meetups:${keyDay}:${page}`;

    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const meetups = await Meetup.findAll({
      where,
      include: [User, File],
      order: ['date'],
      limit: 10,
      offset: 10 * page - 10,
    });

    await Cache.set(cacheKey, meetups);

    return res.json(meetups);
  }

  async store(req, res) {
    const { title } = req.body;
    const user_id = req.userId;
    const meetup = await CreateMeetupService.run({
      title,
      body: req.body,
      user_id,
      data: req.body.date,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await UpdateMeetupService.run({
      user_id: req.userId,
      data: req.body.date,
      meetupId: req.params.id,
      body: req.body,
    });

    return res.json(meetup);
  }

  async delete(req, res) {
    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't delete past meetups." });
    }

    await meetup.destroy();

    await Cache.invalidadePrefix(`meetups`);

    return res.send();
  }
}

export default new MeetupController();
