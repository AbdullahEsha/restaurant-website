import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../helpers/auth';
import Product from '../../../../models/Product';
import db from '../../../../helpers/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-slug-' + Math.random(),
    image: '/images/product_01.1.jpg',
    image01: '/images/product_01.1.jpg',
    image02: '/images/product_2.1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product Created', product });
});

export default handler;