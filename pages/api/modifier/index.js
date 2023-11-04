import nc from 'next-connect'
import Modifier from '../../../models/Modifier'
import db from '../../../helpers/db'

const handler = nc()

handler.get(async (req, res) => {
  await db.connect()
  const modifier = await Modifier.find({})
  await db.disconnect()
  res.send(modifier)
})

handler.post(async (req, res) => {
  await db.connect()
  const newModifier = await Modifier.create(req.body)
  await db.disconnect()
  res.send({
    message: 'New Modifier added to Halal Kabab & Curry!!',
    result: newModifier,
  })
})

export default handler
