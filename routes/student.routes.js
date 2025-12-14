import express from 'express';
import { getProfile, updateProfile } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isStudent } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Student routes
router.get('/profile', isStudent, getProfile);
router.put('/profile', isStudent, updateProfile);

export default router;



