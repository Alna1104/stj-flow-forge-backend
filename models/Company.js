import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: String,
  email: String,
  department: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', companySchema);
