import express from 'express';
import {
  uploadBook,
  getAllBooks,
  getBook,
  uploadNote,
  getAllNotes,
  getNote,
  uploadPYQ,
  getAllPYQs,
  getPYQ
} from '../controllers/content.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isApproved } from '../middleware/role.middleware.js';
import { upload, handleFileUpload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/books', getAllBooks);
router.get('/books/:bookId', getBook);
router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNote);
router.get('/pyqs', getAllPYQs);
router.get('/pyqs/:pyqId', getPYQ);

router.post('/books', authenticate, isApproved, upload.single('file'), handleFileUpload, uploadBook);
router.post('/notes', authenticate, isApproved, upload.single('file'), handleFileUpload, uploadNote);
router.post('/pyqs', authenticate, isApproved, upload.single('file'), handleFileUpload, uploadPYQ);

export default router;




