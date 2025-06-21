import WorkOrder from '../models/WorkOrder.js';
import fs from 'fs';
import path from 'path';

export const createWorkOrder = async (req, res) => {
  try {
    const { data } = req.body;
    const parsedData = JSON.parse(data);

    // Handle file uploads
    const filePaths = [];
    if (req.files && req.files.length > 0) {
      const uploadDir = `uploads/${parsedData.company}/${parsedData.createdBy}/${new Date().getFullYear()}`;
      const fullUploadPath = path.join(process.cwd(), uploadDir);

      // Ensure directory exists
      fs.mkdirSync(fullUploadPath, { recursive: true });

      // Save files
      for (const file of req.files) {
        const filePath = path.join(fullUploadPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(`${uploadDir}/${file.originalname}`);
      }

      parsedData.files = filePaths;
    }

    const workOrder = new WorkOrder(parsedData);
    await workOrder.save();

    res.status(201).json({ message: 'Work order created', workOrder });
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ message: 'Failed to create work order' });
  }
};
