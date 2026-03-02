import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema({
  // Product info (if applicable)
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  
  // User info
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  message: { type: String },
  
  // Admin tracking
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved', 'Archived'],
    default: 'New',
  },
}, { timestamps: true });

const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);
export default QuoteRequest;