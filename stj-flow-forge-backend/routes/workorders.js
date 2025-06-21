import express from 'express';
import multer from 'multer';
import { createWorkOrder } from '../controllers/workorderController.js';

const router = express.Router();

// Use memory storage since the controller will save files
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.array('files'), createWorkOrder);

export default router;
