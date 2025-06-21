import express from 'express';
import multer from 'multer';
import WorkOrder from '../models/WorkOrder.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // or customize this

router.post('/', upload.array('files'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data); // parsed work order

    const newOrder = new WorkOrder({
      ...data,
      files: req.files?.map(f => f.filename)
    });

    await newOrder.save();

    res.status(201).json({ message: 'Work order created', order: newOrder });
  } catch (error) {
    console.error('POST /workorders error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
