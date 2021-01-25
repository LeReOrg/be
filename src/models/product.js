import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: String, required: true},
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true},
  owner_id: { type: String, required: true},
  name: { type: String, required: true},
  image_url: { type: String, required: true},
  image_url_thumbnails: { type: String, required: true},
  cover_image: [ String ],
  thumbnails: [ String ],
  price: { type: Number, required: true},
  in_stock: { type: Number, required: true},
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;