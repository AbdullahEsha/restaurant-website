import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../helpers/auth';
import User from '../../../../models/User';
import db from '../../../../helpers/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});

export default handler;