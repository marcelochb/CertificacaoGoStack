import { isBefore, parseISO } from 'date-fns';
import File from '../models/File';
import Meetup from '../models/Meetup';
import Cache from '../../lib/Cache';

class UpdateMeetupService {
  async run({ user_id, meetupId, data, body }) {
    const meetup = await Meetup.findByPk(meetupId, {
      include: [File],
    });
    if (meetup.user_id !== user_id) {
      throw new Error('Not authorized');
    }

    if (isBefore(parseISO(data), new Date())) {
      throw new Error('Meetup date invalid');
    }

    if (meetup.past) {
      throw new Error("Can't update past meetups.");
    }
    await meetup.update({ ...body, user_id });

    await Cache.invalidadePrefix(`meetups`);

    return meetup;
  }
}

export default new UpdateMeetupService();
