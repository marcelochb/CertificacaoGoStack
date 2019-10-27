import User from '../models/User';

class UserController {
  async store(req, res) {
    const userNameExists = await User.findOne({
      where: { name: req.body.name },
    });

    if (userNameExists) {
      return res.status(400).json({ error: 'User name already exists.' });
    }

    const userEmailExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userEmailExists) {
      return res.status(400).json({ error: 'User email already exists.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const { name, email, oldPassword, password, confirmPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (name && name !== user.name) {
      const userExists = await User.findOne({ where: { name } });
      if (userExists) {
        return res.status(400).json({ error: 'User name already exists.' });
      }
    }
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User e-mail already exists.' });
      }
    }

    if (password && !confirmPassword) {
      return res
        .status(401)
        .json({ error: 'Confirm password is required to be change' });
    }

    if (
      (password || confirmPassword) &&
      (!oldPassword || !(await user.checkPassword(oldPassword)))
    ) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    await user.update(req.body);
    return res.json({
      name,
      email,
    });
  }
}
export default new UserController();
