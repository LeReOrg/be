import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  large_url: String,
  small_url: String
}, {
  timestamps: true,
});

const productSchema = new Schema({
  id: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  image: imageSchema  ,  
  cover_images: [imageSchema], 
  price: { type: Number, required: true },
  in_stock: { type: Number, required: true },
  description: { type: String },
  location: {
    longtitude: Number,
    latitude: Number
  }
}, {
  timestamps: true,
});   

const Product = mongoose.model('Product', productSchema);

module.exports = Product;