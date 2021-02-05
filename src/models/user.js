import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, required: true},
  order_id: { type: String, required: true},
  first_name: { type: String, required: true},
  last_name: { type: String, required: true},
  gender: { type: String, required: true},
  mobile: { type: String, required: true},
  email: { type: String, required: true},
  address_longitude: { type: Number, required: true},
  address_latitude: { type: Number, required: true},
  firebase_token: { type: String}
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;