import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDashboardStats, getAnalytics } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', verifyToken, getDashboardStats);
router.get('/analytics', verifyToken, getAnalytics);

export default router;
