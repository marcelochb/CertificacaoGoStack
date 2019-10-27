import { parseISO, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Cache from '../../lib/Cache';

class CreateMeetupService {
  async run({ user_id, body, data, title }) {
    if (isBefore(parseISO(data), new Date())) {
      throw new Error('Meetup date invalid');
    }
    const titleExists = await Meetup.findOne({ where: { title } });

    if (titleExists) {
      throw new Error('Meetup title already exists');
    }

    const dateExists = await Meetup.findOne({
      where: { date: { [Op.eq]: parseISO(data) } },
    });
    if (dateExists) {
      throw new Error('Meetup date already exists');
    }

    const meetup = await Meetup.create({
      ...body,
      user_id,
    });
    await Cache.invalidadePrefix(`meetups`);

    return meetup;
  }
}

export default new CreateMeetupService();
