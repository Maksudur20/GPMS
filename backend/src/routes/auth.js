import express from 'express';
import { validateAuth } from '../middleware/validation.js';
import { register, login, verifyPassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/verify-password', verifyToken, verifyPassword);

export default router;
