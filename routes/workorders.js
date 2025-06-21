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

// POST /api/workorders
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const workOrderData = JSON.parse(req.body.data);

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

export default router;
