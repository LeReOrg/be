import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  id: { type: String, required: true},
  owner_id: { type: String, required: true},
  product_details: {
    product_ids: [ Number],
    quantities: [ Number ]
  },
  status: { type: String, required: true},
  from_date: { type: Date, required: true},
  to_date: { type: Date, required: true},
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;