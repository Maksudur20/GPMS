import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePasswords, generateToken } from '../utils/cryptography.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    const token = generateToken(admin.id, admin.username);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin.id, username: admin.username, email: admin.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isValidPassword = await comparePasswords(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.username);

    res.json({
      message: 'Login successful',
      admin: { id: admin.id, username: admin.username, email: admin.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
