import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  url: { type: String, required: true },
  screenshot: { type: String }, // You can store the base64 image here or use a URL if stored on cloud storage
  name: { type: String },
  description: { type: String },
  logo: { type: String },
  facebook: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  instagram: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
