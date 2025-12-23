import express from 'express';
import {
  getAllStudents,
  getPendingStudents,
  approveStudent,
  rejectStudent,
  blockStudent,
  unblockStudent,
  deleteBook,
  deleteNote,
  deletePYQ,
  deleteDiscussionMessage,
  getDashboardStats
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

router.get('/students', getAllStudents);
router.get('/students/pending', getPendingStudents);
router.put('/students/:studentId/approve', approveStudent);
router.delete('/students/:studentId/reject', rejectStudent);
router.put('/students/:studentId/block', blockStudent);
router.put('/students/:studentId/unblock', unblockStudent);

router.delete('/books/:bookId', deleteBook);
router.delete('/notes/:noteId', deleteNote);
router.delete('/pyqs/:pyqId', deletePYQ);
router.delete('/discussions/:messageId', deleteDiscussionMessage);

router.get('/dashboard/stats', getDashboardStats);

export default router;

