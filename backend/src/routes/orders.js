import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validation.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', verifyToken, validateOrder, createOrder);
router.get('/', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id', verifyToken, updateOrder);
router.delete('/:id', verifyToken, deleteOrder);

export default router;
