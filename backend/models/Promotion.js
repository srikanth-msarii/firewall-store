import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  model: { type: String },
  description: { type: String, required: true },
  dealText: { type: String, required: true },
  image: { type: String, required: true }, // S3 URL
  link: { type: String, required: true }, // e.g., /products/60b8...
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;