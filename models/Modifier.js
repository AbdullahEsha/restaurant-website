import mongoose from 'mongoose'

const modifierSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    option: [{ type: String, required: true, unique: true, trim: true }], // options which may add on a particular product
    usedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // products _id, where it can be used or added on
    price: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
)

const Modifier =
  mongoose.models.Modifier || mongoose.model('Modifier', modifierSchema)

export default Modifier
