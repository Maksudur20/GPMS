import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (adminId, username) => {
  return jwt.sign(
    { id: adminId, username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
