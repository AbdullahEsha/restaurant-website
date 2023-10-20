import nc from 'next-connect';
import Newsletter from '../../../models/Newsletter';
import db from '../../../helpers/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const newsletter = await Newsletter.find({});
  await db.disconnect();
  res.send( newsletter);
});

handler.post(async (req, res) => {
  await db.connect();
  const newNewSletterUser = new Newsletter({
    email: req.body.email
  });

  const newsLetterUser = await newNewSletterUser.save();
  await db.disconnect();
  res.send({ message: 'You Have Subscribe to Delivera Newsletter!!', newsLetterUser });
});

export default handler;