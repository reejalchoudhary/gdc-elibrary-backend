import express from 'express';
import {
  getAllDiscussions,
  createDiscussion,
  deleteDiscussion
} from '../controllers/discussion.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isApproved } from '../middleware/role.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

// Public route (viewing discussions)
router.get('/', getAllDiscussions);

// Protected routes
router.post('/', authenticate, isApproved, createDiscussion);
router.delete('/:messageId', authenticate, isAdmin, deleteDiscussion);

export default router;



