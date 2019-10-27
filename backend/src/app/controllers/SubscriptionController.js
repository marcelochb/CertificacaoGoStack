import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Meetup.findAll({
      where: {
        date: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: Subscription,
          where: {
            user_id: req.userId,
          },
          required: true,
        },
        File,
        { model: User, attributes: ['name', 'id'] },
      ],
      order: ['date'],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const { meetupId: meetup_id } = req.params;
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [User],
    });

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to you own meetups" });
    }

    if (meetup.past) {
      return res.status(400).json({ error: "Can't subscribe to past meetups" });
    }

    const userSubscription = await Subscription.findOne({
      where: {
        user_id: user.id,
        meetup_id,
      },
    });

    if (userSubscription) {
      return res
        .status(400)
        .json({ error: 'You already subscribe on this meetups.' });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const user_id = req.userId;
    const subscription = await Subscription.findByPk(req.params.subscriptionId);
    if (!subscription) {
      return res.status(400).json({ error: 'Subscription not found' });
    }
    if (subscription.UserId !== user_id) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await subscription.destroy();

    return res.send();
  }
}

export default new SubscriptionController();
