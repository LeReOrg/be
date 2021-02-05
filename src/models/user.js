import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const userAuthenSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
})

const userSchema = new Schema({
  id: { type: String},
  order_id: { type: String},
  first_name: { type: String, required: true, default: "A"},
  last_name: { type: String, required: true, default: "Nguyen"},
  gender: { type: String, required: true, default: "male"},
  mobile: { type: String, required: true, default: "113"},
  email: { type: String},
  address_longitude: { type: Number, required: true, default: 1.0000},
  address_latitude: { type: Number, required: true, default: 1.0000},
  firebase_token: { type: String},
  authentication: userAuthenSchema
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;