import { object, string, date, number } from 'yup';

export default async (req, res, next) => {
  try {
    const schema = object().shape({
      title: string(),
      file_id: number(),
      description: string(),
      location: string(),
      date: date(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails', messages: err.errors });
  }
};
