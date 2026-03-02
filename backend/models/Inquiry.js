import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  countryRegion: { type: String, required: true },
  technicalRequirements: { type: String, required: true },
  productType: { type: String, required: true },
  budgetRange: { type: String, required: true },
  expectedDeliveryTime: { type: String, required: true },
  additionalInfo: { type: String },
  contactByEmail: { type: Boolean, default: true },
  contactByPhone: { type: Boolean, default: false },
  // We will add S3 file URLs here
  // files: [{ name: String, url: String }],
  
  // Admin tracking
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Resolved', 'Archived'],
    default: 'New',
  },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;