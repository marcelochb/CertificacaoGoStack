import { object, string, ref } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      name: string().required(),
      email: string()
        .email()
        .required(),
      password: string()
        .required()
        .min(6),
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
