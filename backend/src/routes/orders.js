import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validation.js';
import {
  previewOrder,
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/preview', verifyToken, previewOrder);
router.post('/', verifyToken, validateOrder, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id', verifyToken, updateOrder);
router.patch('/:id/status', verifyToken, updateOrderStatus);
router.delete('/:id', verifyToken, deleteOrder);

export default router;
