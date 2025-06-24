import express from 'express';
import multer from 'multer';
import WorkOrder from '../models/WorkOrder.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create uploads directory if not exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// GET all work orders
router.get('/', async (req, res) => {
  try {
    const workOrders = await WorkOrder.find().sort({ createdAt: -1 }); // latest first
    res.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ message: 'Failed to fetch work orders' });
  }
});

// POST /api/workorders
router.post('/', upload.array('files'), async (req, res) => {
  try {
    
    console.log('📥 Request Body (data):', req.body.data); // should be JSON string
    console.log('📁 Uploaded Files:', req.files);
    
    const workOrderData = JSON.parse(req.body.data);
    console.log('🛠️ Parsed WorkOrder Data:', workOrderData);
   // Generate next work order number
  const generateNextWorkOrderNumber = async () => {
    const latestOrder = await WorkOrder.findOne().sort({ createdAt: -1 });
    const year = new Date().getFullYear();
    const lastNumber = latestOrder?.workOrderNumber?.split('-')[2] || '0000';
    const nextNumber = (parseInt(lastNumber, 10) + 1).toString().padStart(4, '0');
    return `WO-${year}-${nextNumber}`;
      };

    // Then inside POST:
    workOrderData.workOrderNumber = await generateNextWorkOrderNumber();

    
    // Attach uploaded file names to the work order
    const fileNames = req.files.map(file => file.filename);
    workOrderData.files = fileNames;

    const newWorkOrder = new WorkOrder(workOrderData);
    await newWorkOrder.save();

    res.status(201).json({ message: 'Work order created successfully', workOrder: newWorkOrder });
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: 'Failed to create work order' });
  }
});
// Update status of a work order
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotationStatus } = req.body;

    const updated = await WorkOrder.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(quotationStatus && { quotationStatus }) },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Failed to update status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});


export default router;
