import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String }, // Will come from S3
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;