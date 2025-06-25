import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  contactPerson: { type: String, required: true },
  phone: String,
  email: String,
  department: String
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contacts: [contactSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', companySchema);
