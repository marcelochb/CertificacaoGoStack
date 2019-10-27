import request from 'supertest';
import bcrypt from 'bcryptjs';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import fs from 'fs';
import { resolve } from 'path';
import { format } from 'date-fns';

import app from '../../src/app';

import truncate from '../util/truncate';
import factory from '../factories';
import authConfig from '../../src/config/auth';

describe('User-Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able register without name', async () => {
    const user = await factory.attrs('User');
    user.name = '';

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body.messages[0]).toBe('name is a required field');
  });

  it('should not be able register without email', async () => {
    const user = await factory.attrs('User');
    user.email = '';

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body.messages[0]).toBe('email is a required field');
  });

  it('should not be able register without password', async () => {
    const user = await factory.attrs('User');
    user.password = '';

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body.messages[0]).toBe('password is a required field');
  });

  it('should not be able created (on Model) user without password', async () => {
    try {
      await factory.create('User', {
        password: '',
      });
    } catch (err) {
      expect(err).toMatchObject(Error('Password required!'));
    }
  });

  it('should not be able register with confirmPassword not equal to password', async () => {
    const user = await factory.attrs('User');
    user.confirmPassword = faker.internet.password();

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body.messages[0]).toBe('Passwords must match');
  });

  it('should not be able register with length password less then six', async () => {
    const user = await factory.attrs('User');
    user.password = faker.internet.password(1, 5);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body.messages[0]).toBe(
      'password must be at least 6 characters'
    );
  });

  it('should encrypt user passord when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should not be able register duplicate name', async () => {
    const user = (await factory.create('User')).dataValues;

    const response = await request(app)
      .post('/users')
      .send({
        ...user,
        email: faker.internet.email(),
        name: user.name,
      });

    expect(response.body.error).toBe('User name already exists.');
  });

  it('should not be able register duplicate email', async () => {
    const user = (await factory.create('User')).dataValues;

    const response = await request(app)
      .post('/users')
      .send({
        ...user,
        name: faker.name.findName(),
      });

    expect(response.body.error).toBe('User email already exists.');
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });
});

describe('User-Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able authenticate without email', async () => {
    const user = await factory.attrs('User');
    user.email = '';

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.body.messages[0]).toBe('email is a required field');
  });

  it('should not be able authenticate without password', async () => {
    const user = await factory.attrs('User');
    user.password = '';

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.body.messages[0]).toBe('password is a required field');
  });

  it('should not be able authenticate with wrong password', async () => {
    /**
     * Create a fake user
     */
    const user = (await factory.create('User')).dataValues;
    /**
     * Try authenticate with wrong password
     */
    const response = await request(app)
      .post('/session')
      .send({ ...user, password: faker.internet.password() });

    expect(response.body.error).toBe('password does not match');
  });

  it('should not be able authenticate unknow user', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.body.error).toBe('user not found');
  });

  it('should be able authenticate', async () => {
    /**
     * Create a fake user
     */
    const user = (await factory.create('User')).dataValues;

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.status).toBe(200);
  });

  it('should be able authenticate and get a token', async () => {
    /**
     * Create a fake user
     */
    const user = (await factory.create('User')).dataValues;

    const response = await request(app)
      .post('/session')
      .send(user);

    expect(response.body).toHaveProperty('token');
  });

  it('should be able get logged userId from token after authenticate', async () => {
    try {
      /**
       * Create a fake user
       */
      const userFake = (await factory.create('User')).dataValues;
      /**
       * Authenticated and get a token
       */
      const { user, token } = (await request(app)
        .post('/session')
        .send(userFake)).body;
      /**
       * Decoded token e get user id
       */
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);
      /**
       * Compare id of token with user logged id
       */
      const compareId = decoded.id === user.id;

      expect(compareId).toBe(true);
    } catch (err) {
      expect(err).toMatchObject(Error('Token was invalid'));
    }
  });
});

describe('User-Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able update without token', async () => {
    /**
     * Try update the name
     * without token
     */

    const response = await request(app)
      .put('/users')
      .send({ name: 'Name changed successfully' });

    expect(response.body.error).toBe('Token not provider');
  });

  it('should not be able update with invalid token', async () => {
    /**
     * Create a fake token
     */
    const token = '{ id }ipiruqPIOUPIU&)*HIH)*^)*GHHFHJHGCJGH%^&$';
    /**
     * Try update the name
     * with invalid token
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ name: 'Name changed successfully' });

    expect(response.body.error).toBe('Token was invalid');
  });

  it('should not be able update with duplicate name', async () => {
    /**
     * Create faker first user
     */
    const { name } = (await factory.create('User')).dataValues;

    /**
     * Create faker second user
     */
    const { id } = (await factory.create('userSecond')).dataValues;

    /**
     * Create a token of second faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update second user
     * with name of the first user.
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ name });

    expect(response.body.error).toBe('User name already exists.');
  });

  it('should not be able update with duplicate email', async () => {
    /**
     * Create faker first user
     */
    const { email } = (await factory.create('User')).dataValues;

    /**
     * Create faker second user
     */
    const { id } = (await factory.create('userSecond')).dataValues;

    /**
     * Create a token of second faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update second user
     * with email of the first user.
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ email });

    expect(response.body.error).toBe('User e-mail already exists.');
  });

  it('should not be able update password without correct oldPassword', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the password
     * without oldPassword.
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ password: '123456', confirmPassword: '123456' });

    expect(response.body.error).toBe('Password does not match');
  });

  it('should not be able update password without confimPassword', async () => {
    /**
     * Create a fake user
     */
    const { id, password: oldPassword } = (await factory.create(
      'User'
    )).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the password
     * without confirmPassword.
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ password: '123456', oldPassword });

    expect(response.body.error).toBe(
      'Confirm password is required to be change'
    );
  });

  it('should not be able update password without correct confirmPassword', async () => {
    /**
     * Create a fake user
     */
    const { id, password: oldPassword } = (await factory.create(
      'User'
    )).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the password
     * withou correct confirmPassword.
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({
        oldPassword,
        password: '123456',
        confirmPassword: '12345678',
      });

    expect(response.body.messages[0]).toBe('Passwords must match');
  });

  it('should be able update name', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the name
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ name: 'New name' });

    expect(response.body.name).toBe('New name');
  });

  it('should be able update email', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the email
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({ email: 'emailChanged@gmail.com' });

    expect(response.body.email).toBe('emailChanged@gmail.com');
  });

  it('should be able update password', async () => {
    /**
     * Create a fake user
     */
    const { id, password: oldPassword } = (await factory.create(
      'User'
    )).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try update the password
     */

    const response = await request(app)
      .put('/users')
      .set('authorization', `Bearer ${token}`)
      .send({
        oldPassword,
        password: 'passwordChanged',
        confirmPassword: 'passwordChanged',
      });

    expect(response.status).toBe(200);
  });
});

describe('Files-Upload', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able upload no image file', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try upload
     * with no image file
     */
    const fileStream = await fs.readFileSync(
      `${resolve(__dirname, '..', 'testFiles')}/test.pdf`
    );

    const response = await request(app)
      .post('/files')
      .attach('file', fileStream, 'test.pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error.message).toBe('Invalid file type.');
  });

  it('should not be able upload file greater than two Megabites', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try upload
     * with no image file
     */
    const fileStream = fs.readFileSync(
      `${resolve(__dirname, '..', 'testFiles')}/bigger.jpg`,
      'utf8'
    );

    const response = await request(app)
      .post('/files')
      .attach('file', fileStream, 'bigger.jpg')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error.message).toBe('File too large');
  });

  it('should not be able upload file without token', async () => {
    /**
     * Try upload
     * with no image file
     */
    const fileStream = fs.readFileSync(
      `${resolve(__dirname, '..', 'testFiles')}/feijao.jpg`
    );

    const response = await request(app)
      .post('/files')
      .attach('file', fileStream, 'feijao.jpg');

    expect(response.body.error).toBe('Token not provider');
  });

  it('should be able upload file', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try upload
     * with no image file
     */
    const fileStream = fs.readFileSync(
      `${resolve(__dirname, '..', 'testFiles')}/feijao.jpg`
    );

    const response = await request(app)
      .post('/files')
      .attach('file', fileStream, 'feijao.jpg')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('path');
  });
});

describe('Meetups-Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able register with duplicate meetup title', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup fake
     */
    const meetup = (await factory.create('Meetup', {
      file_id,
      user_id: id,
    })).dataValues;
    /**
     * Try create meetup
     * with duplicate title
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send(meetup);

    expect(response.body.error).toBe('Meetup title already exists');
  });

  it('should not be able register meetup without title', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });
    /**
     * Try register meetup
     * with field title null
     */

    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...meetup,
        title: '',
      });

    expect(response.body.messages[0]).toBe('title is a required field');
  });

  it('should not be able register meetup without description', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });
    /**
     * Try register meetup
     * with field description null
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...meetup,
        description: '',
      });

    expect(response.body.messages[0]).toBe('description is a required field');
  });

  it('should not be able register meetup without location', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });
    /**
     * Try register meetup
     * with field location null
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...meetup,
        location: '',
      });

    expect(response.body.messages[0]).toBe('location is a required field');
  });

  it('should not be able register meetup without date', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });
    /**
     * Try register meetup
     * with field date null
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...meetup,
        date: '',
      });

    expect(response.body.messages[0]).toBe(
      'date must be a `date` type, but the final value was: `Invalid Date` (cast from the value `""`).'
    );
  });

  it('should not be able register meetup with past date', async () => {
    /**
     * Create a fake user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });
    /**
     * Try register meetup
     * with field date null
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...meetup,
        date: faker.date.past(),
      });

    expect(response.body.error).toBe('Meetup date invalid');
  });

  it('should be able register meetup', async () => {
    /**
     * Create a fake user
     */
    const { id } = await factory.create('User');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a file
     */
    const { id: file_id } = await factory.create('File');
    /**
     * Create a meetup object
     */
    const meetup = await factory.attrs('Meetup', {
      file_id,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post('/meetups')
      .set('Authorization', `Bearer ${token}`)
      .send(meetup);

    expect(response.body).toHaveProperty('id');
  });
});

describe('Meetups-Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should no be able update meetups if they are not owner', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a second faker user
     */
    const { id: user_id } = (await factory.create('userSecond')).dataValues;
    /**
     * Create a meetup
     * with second user
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Try update meetup that user is not owner
     */

    const response = await request(app)
      .put(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'title changed' });

    expect(response.body.error).toBe('Not authorized');
  });

  it('should not be able update meetups if it was happened', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     * with past date
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      date: faker.date.past(),
      file_id,
      user_id: id,
    });

    /**
     * Try update meetup date past
     */

    const response = await request(app)
      .put(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'title changed' });

    expect(response.body.error).toBe("Can't update past meetups.");
  });

  it('should not be able update meetups with past date', async () => {
    /**
     * Create faker user
     */
    const { id } = await factory.create('User');

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = await factory.create('File');
    /**
     * Create a meetup
     */

    const meetup = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Try update meetup date past
     */

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: faker.date.past(),
      });

    expect(response.body.error).toBe('Meetup date invalid');
  });

  it('should not be able update meetups with validation fails field', async () => {
    /**
     * Create faker user
     */
    const { id } = await factory.create('User');

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = await factory.create('File');
    /**
     * Create a meetup
     */

    const meetup = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Try update meetup date past
     */

    const response = await request(app)
      .put(`/meetups/${meetup.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: faker.name.findName(),
      });

    expect(response.body.error).toBe('Validation fails');
  });

  it('should be able update meetups', async () => {
    /**
     * Create faker user
     */
    const { id } = await factory.create('User');

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a faker file
     */
    const { id: file_id } = await factory.create('File');
    /**
     * Create a fake meetup
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Create a faker second file
     */

    const { id: fileSecond_id } = await factory.create('File');
    /**
     * Create a fake second meetup
     */

    const meetup = await factory.attrs('meetupSecond', {
      file_id: fileSecond_id,
    });

    /**
     * Try update all filed of meetup
     */

    const response = await request(app)
      .put(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...meetup, user_id: '' });

    expect(response.status).toBe(200);
  });
});

describe('Meetups-Organizing', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able list Meetups Organizing by logged user', async () => {
    /**
     * Create faker user
     */
    const { id } = await factory.create('User');

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = await factory.create('File');

    /**
     * Create a second file
     */
    const { id: fileSecond_id } = await factory.create('fileSecond');

    /**
     * Create a meetup
     */

    await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Create a second meetup
     */

    await factory.create('meetupSecond', {
      file_id: fileSecond_id,
      user_id: id,
    });

    /**
     * List Meetups organizing
     * by logged user
     */

    const response = await request(app)
      .get('/organizing')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(2);
  });
});

describe('Meetups-Cancel', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able cancel meetup if they are not owner', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a second faker user
     */
    const { id: user_id } = (await factory.create('userSecond')).dataValues;
    /**
     * Create a meetup
     * with second user
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Try cancel meetup that user is not owner
     */

    const response = await request(app)
      .delete(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe('Not authorized');
  });

  it('should not be able cancel meetups that was happened', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     * with past date
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      date: faker.date.past(),
      file_id,
      user_id: id,
    });

    /**
     * Try cancel meetup date past
     */

    const response = await request(app)
      .delete(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe("Can't delete past meetups.");
  });

  it('should be able cancel meetups', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Try cancel and delete meetup
     */

    const response = await request(app)
      .delete(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should be able delete meetups after cancel', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     */

    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Try cancel and delete meetup
     */

    await request(app)
      .delete(`/meetups/${meetup_id}`)
      .set('Authorization', `Bearer ${token}`);

    /**
     * Check if meetup was deleted
     */

    const response = await request(app)
      .get('/organizing')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(0);
  });
});

describe('Meetups-List', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able list all meetups without date param', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     */

    await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    const response = await request(app)
      .get('/meetups')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(1);
  });

  it('should be able list meetups with date param', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     */

    const { date } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    const response = await request(app)
      .get('/meetups')
      .query({ date: format(date, 'yyyy-MM-dd') })
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(1);
  });

  it('should be able list meetups with date and page param', async () => {
    /**
     * Create faker user
     */
    const { id } = (await factory.create('User')).dataValues;

    /**
     * Create a token
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    /**
     * Create a file
     */
    const { id: file_id } = (await factory.create('File')).dataValues;
    /**
     * Create a meetup
     */

    const { date } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    const response = await request(app)
      .get('/meetups')
      .query({ date: format(date, 'yyyy-MM-dd') })
      .query({ page: '1' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe('Subscription-Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able create subscription on owner meetup', async () => {
    /**
     * Create a fake Meetup
     */
    const { id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id: id,
    });

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post(`/meetups/${meetup_id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe("Can't subscribe to you own meetups");
  });
  it('should not be able create subscription on meetup that was happened', async () => {
    /**
     * Create a fake Meetup
     */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      date: faker.date.past(),
      file_id,
      user_id,
    });

    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post(`/meetups/${meetup_id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe("Can't subscribe to past meetups");
  });
  it('should not be able create subscription on meetup twice', async () => {
    /**
     * Create a fake Meetup
     */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a faker first
     * meetup subscription
     */
    await factory.create('Subscription', {
      meetup_id,
      user_id: id,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post(`/meetups/${meetup_id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe('You already subscribe on this meetups.');
  });
  it('should not be able create subscription on meetups with the same date/hour', async () => {
    /**
     * Create a fake Meetup
     */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id, date } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a faker first
     * meetup subscription
     */
    await factory.create('Subscription', {
      meetup_id,
      user_id: id,
    });

    /**
     * Create a second fake Meetup
     * with de same da from the first
     */
    const { id: meetupSecond_id } = await factory.create('Meetup', {
      date,
      file_id,
      user_id,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post(`/meetups/${meetupSecond_id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.error).toBe(
      "Can't subscribe to two meetups at the same time"
    );
  });
  it('should be able create subscription on meetup', async () => {
    /**
     * Create a fake Meetup
     */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Try register meetup
     */
    const response = await request(app)
      .post(`/meetups/${meetup_id}/subscriptions`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('id');
  });
  it('should be able send e-mail to owner meetup after create subscription', async () => {
    // /**
    //  * Create a fake Meetup
    //  */
    // const { id: user_id } = await factory.create('User');
    // const { id: file_id } = await factory.create('File');
    // const { id: meetup_id } = await factory.create('Meetup', {
    //   file_id,
    //   user_id,
    // });
    // /**
    //  * Create a fake user
    //  */
    // const { id } = await factory.create('userSecond');
    // /**
    //  * Create a token of faker user
    //  */
    // const token = jwt.sign({ id }, authConfig.secret, {
    //   expiresIn: authConfig.expiresIn,
    // });
    // /**
    //  * Try register meetup
    //  */
    // const response = await request(app)
    //   .post(`/meetups/${meetup_id}/subscriptions`)
    //   .set('Authorization', `Bearer ${token}`);
    // expect(response.body).toHaveProperty('id');
  });
});

describe('Subscription-List', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be able list subscriptions from logged user', async () => {
    // /**
    //  * Create a fake Meetup
    //  */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a faker
     * meetup subscription
     */
    await factory.create('Subscription', {
      meetup_id,
      user_id: id,
    });

    /**
     * Get subscriptions by logged user
     */
    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(1);
  });
  it("should be able list subscriptions from logged user that wasn't happened", async () => {
    // /**
    //  * Create a fake Meetup
    //  */
    const { id: user_id } = await factory.create('User');
    const { id: file_id } = await factory.create('File');
    const { id: meetup_id } = await factory.create('Meetup', {
      file_id,
      user_id,
    });

    /**
     * Create a second fake meetup
     * with past date
     */
    const { id: meetupSecond_id } = await factory.create('Meetup', {
      date: faker.date.past(),
      file_id,
      user_id,
    });
    /**
     * Create a fake user
     */
    const { id } = await factory.create('userSecond');

    /**
     * Create a token of faker user
     */
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    /**
     * Create a faker
     * meetup first subscription
     */
    await factory.create('Subscription', {
      meetup_id,
      user_id: id,
    });
    /**
     * Create a faker
     * meetup second subscription
     * with past date
     */
    await factory.create('Subscription', {
      meetup_id: meetupSecond_id,
      user_id: id,
    });

    /**
     * Get subscriptions by logged user
     */
    const response = await request(app)
      .get('/subscriptions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toHaveLength(1);
  });
});
