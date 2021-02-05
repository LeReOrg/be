import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const userAuthenSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
})

const userSchema = new Schema({
<<<<<<< HEAD
  id: { type: String},
  order_id: { type: String},
  first_name: { type: String, required: true, default: "A"},
  last_name: { type: String, required: true, default: "Nguyen"},
  gender: { type: String, required: true, default: "male"},
  mobile: { type: String, required: true, default: "113"},
  email: { type: String},
  address_longitude: { type: Number, required: true, default: 1.0000},
  address_latitude: { type: Number, required: true, default: 1.0000},
  authentication: userAuthenSchema
=======
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
>>>>>>> 006cbd341007937db3be81bd4429dd729e190ed7
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;