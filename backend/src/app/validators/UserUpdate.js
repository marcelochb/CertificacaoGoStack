import { object, string, ref } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      name: string(),
      email: string().email(),
      oldPassword: string().min(6),
      password: string().min(6),
      confirmPassword: string().oneOf(
        [ref('password'), null],
        'Passwords must match'
      ),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.errors });
  }
};
