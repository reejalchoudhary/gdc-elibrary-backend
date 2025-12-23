import express from 'express';
import {
  registerStudent,
  loginStudent,
  loginAdmin,
  refreshToken,
  logout,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { authenticate, verifyRefreshToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login/student', loginStudent);
router.post('/login/admin', loginAdmin);
router.post('/refresh', verifyRefreshToken, refreshToken);

router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;




