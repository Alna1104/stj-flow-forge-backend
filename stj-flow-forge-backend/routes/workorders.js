const express = require('express');
const router = express.Router();
const { createWorkOrder, getWorkOrders } = require('../controllers/workorderController');

router.post("/", createWorkOrder);
router.get("/", getWorkOrders);

module.exports = router;
