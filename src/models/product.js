import mongoose from "mongoose"; 

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: String, required: true},
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true},
  owner_id: { type: String, required: true},
  name: { type: String, required: true},
  image_url: { type: String, required: true},
  image_url_thumbnails: { type: String, default: 'null'},
  cover_image: { type: [String], default: ['null', 'null']},
  price: { type: Number, required: true},
  in_stock: { type: Number, required: true},
}, {
  timestamps: true,
});

productSchema.index({cover_image : '2d'});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;