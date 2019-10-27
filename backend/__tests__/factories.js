import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import File from '../src/app/models/File';
import Meetup from '../src/app/models/Meetup';
import Subscription from '../src/app/models/Subscription';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  confirmPassword: this.password,
  oldPassword: this.password,
});

factory.define('userSecond', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  confirmPassword: this.password,
  oldPassword: this.password,
});

factory.define('File', File, {
  name: faker.system.fileName(),
  path: faker.system.fileName(),
});

factory.define('fileSecond', File, {
  name: faker.system.fileName(),
  path: faker.system.fileName(),
});

factory.define('Meetup', Meetup, {
  title: faker.name.title(),
  description: faker.name.jobDescriptor(),
  location: `${faker.address.streetName()} ${faker.address.streetAddress()} - ${faker.address.city()},${faker.address.state()}`,
  date: faker.date.future(),
  file_id: 1,
  user_id: 1,
});

factory.define('meetupSecond', Meetup, {
  title: faker.name.title(),
  description: faker.name.jobDescriptor(),
  location: `${faker.address.streetName()} ${faker.address.streetAddress()} - ${faker.address.city()},${faker.address.state()}`,
  date: faker.date.future(),
  file_id: 1,
  user_id: 1,
});

factory.define('Subscription', Subscription, {
  meetup_id: 1,
  user_id: 1,
});

export default factory;
