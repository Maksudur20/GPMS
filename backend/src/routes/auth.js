import express from 'express';
import { validateAuth } from '../middleware/validation.js';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);

export default router;
