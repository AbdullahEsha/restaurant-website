import nc from "next-connect";
import Order from "../../../models/Order";
import { isAuth } from "../../../helpers/auth";
import db from "../../../helpers/db";
import { onError } from "../../../helpers/error";

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  console.log("req.body", req.body);
  const newOrder = new Order({
    ...req.body,
    user: req.user._id,
  });
  const order = await newOrder.save();
  res.status(201).send(order);
});

export default handler;
