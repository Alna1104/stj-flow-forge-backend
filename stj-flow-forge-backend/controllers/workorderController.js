const WorkOrder = require('../models/WorkOrder');

const createWorkOrder = async (req, res) => {
  try {
    const workOrder = new WorkOrder(req.body);
    await workOrder.save();
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkOrders = async (req, res) => {
  try {
    const orders = await WorkOrder.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createWorkOrder, getWorkOrders };
