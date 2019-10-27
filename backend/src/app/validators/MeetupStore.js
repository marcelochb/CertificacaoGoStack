import { object, string, date, number } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      title: string().required(),
      file_id: number().required(),
      description: string().required(),
      location: string().required(),
      date: date().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.errors });
  }
};
