import nc from 'next-connect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { isAuth, isAdmin } from '../../../helpers/auth';
import db from '../../../helpers/db';
import { onError } from '../../../helpers/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    try{
        await db.connect();
        const ordersCount = await Order.countDocuments();
        const productsCount = await Product.countDocuments();
        const usersCount = await User.countDocuments();
        const ordersPriceGroup = await Order.aggregate([
          {
            $group: {
              _id: null,
              sales: { $sum: '$totalPrice' },
            },
          },
        ]);
        const ordersPrice =
          ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;
        const salesData = await Order.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              totalSales: { $sum: '$totalPrice' },
            },
          },
        ]);
        await db.disconnect();
        res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
    }catch(err){
        res.send(err)
    }
});

export default handler;