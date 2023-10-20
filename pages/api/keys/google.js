import nc from 'next-connect';
import { isAuth } from '../../../helpers/auth';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  res.send(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'nokey');
});

export default handler;