import mongoose from 'mongoose';

const specSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  title: { type: String },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const questionSchema = new mongoose.Schema({
  author: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String },
  date: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String }, // Storing as string (e.g., "$2,450" or "On Request")
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  
  image: { type: String }, // Main image URL (from S3)
  images: [{ type: String }], // Gallery image URLs (from S3)
  specImage: { type: String }, // Specs tab image (from S3)

  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  
  specs: [specSchema],
  reviews: [reviewSchema],
  questions: [questionSchema],
  
  datasheetUrl: { type: String },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;