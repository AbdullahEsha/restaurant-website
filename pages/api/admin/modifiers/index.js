import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../helpers/auth";
import Modifier from "../../../../models/Modifier";
import db from "../../../../helpers/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const modifier = await Modifier.find({});
  await db.disconnect();
  res.send(modifier);
});

handler.post(async (req, res) => {
  await db.connect();
  const newModifier = new Modifier({
    title: `sample title ${Math.floor(Math.random() * 100)}`,
    option: [],
    usedIn: [],
    price: 0,
  });

  const modifier = await newModifier.save();
  await db.disconnect();
  res.send({ message: "Modifier Created", modifier });
});

export default handler;
