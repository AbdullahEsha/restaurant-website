import nc from "next-connect";
import Modifier from "../../../../../models/Modifier";
import db from "../../../../../helpers/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const modifier = await Modifier.findById(req.query.id);
  await db.disconnect();
  res.send(modifier);
});

handler.put(async (req, res) => {
  await db.connect();
  const modifier = await Modifier.findById(req.query.id);
  if (modifier) {
    modifier.title = req.body.title;
    modifier.option = req.body.option;
    modifier.usedIn = req.body.usedIn;
    modifier.price = req.body.price;
    await modifier.save();
    await db.disconnect();
    res.send({ message: "Modifier Updated Successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Modifier Not Found" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const modifier = await Modifier.findById(req.query.id);
  if (modifier) {
    await modifier.remove();
    await db.disconnect();
    res.send({ message: "Modifier Deleted!" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Modifier Not Found!" });
  }
});

export default handler;
