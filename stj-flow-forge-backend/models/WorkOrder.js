import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema({
  workOrderNumber: { type: String, required: true },
  date: { type: String, required: true },
  company: { type: String, required: true },
  contactPerson: { type: String, required: true },
  jobDescription: { type: String, required: true },
  quantity: { type: Number, required: true },
  workType: { type: String, enum: ['Machining', 'Sheetmetal', 'Both'], required: true },
  quotationStatus: { type: String, default: 'TBQ' },
  status: { type: String, default: 'To Start' },
  billingEntity: { type: String, default: 'STJ' },
  remarks: { type: [String], default: [] },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  files: { type: [String] } // Optional: store file URLs or names
});

export default mongoose.model('WorkOrder', workOrderSchema);
