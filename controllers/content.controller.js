import Book from '../models/Book.model.js';
import Note from '../models/Note.model.js';
import PYQ from '../models/PYQ.model.js';
import User from '../models/User.model.js';

export const uploadBook = async (req, res, next) => {
  try {
    const { name, category, department, year } = req.body;
    const user = await User.findById(req.user._id);

    if (!req.fileData) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed'
      });
    }

    const book = await Book.create({
      name,
      category,
      department,
      year,
      uploader: req.user._id,
      uploaderName: user.name,
      fileData: req.fileData,
      fileName: req.fileName,
      fileSize: req.fileSize,
      mimeType: req.mimeType
    });

    res.status(201).json({
      success: true,
      message: 'Book uploaded successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBooks = async (req, res, next) => {
  try {
    const { department, year, category, search } = req.query;
    const query = {};

    if (department && department !== 'All') query.department = department;
    if (year) query.year = year;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query)
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('uploader', 'name email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

export const uploadNote = async (req, res, next) => {
  try {
    const { name, category, department, year } = req.body;
    const user = await User.findById(req.user._id);

    if (!req.fileData) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed'
      });
    }

    const note = await Note.create({
      name,
      category,
      department,
      year,
      uploader: req.user._id,
      uploaderName: user.name,
      fileData: req.fileData,
      fileName: req.fileName,
      fileSize: req.fileSize,
      mimeType: req.mimeType
    });

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { department, year, category, search } = req.query;
    const query = {};

    if (department && department !== 'All') query.department = department;
    if (year) query.year = year;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query)
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId)
      .populate('uploader', 'name email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPYQ = async (req, res, next) => {
  try {
    const { name, category, department, year } = req.body;
    const user = await User.findById(req.user._id);

    if (!req.fileData) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed'
      });
    }

    const pyq = await PYQ.create({
      name,
      category,
      department,
      year,
      uploader: req.user._id,
      uploaderName: user.name,
      fileData: req.fileData,
      fileName: req.fileName,
      fileSize: req.fileSize,
      mimeType: req.mimeType
    });

    res.status(201).json({
      success: true,
      message: 'PYQ uploaded successfully',
      data: pyq
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPYQs = async (req, res, next) => {
  try {
    const { department, year, category, search } = req.query;
    const query = {};

    if (department && department !== 'All') query.department = department;
    if (year) query.year = year;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const pyqs = await PYQ.find(query)
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pyqs.length,
      data: pyqs
    });
  } catch (error) {
    next(error);
  }
};

export const getPYQ = async (req, res, next) => {
  try {
    const pyq = await PYQ.findById(req.params.pyqId)
      .populate('uploader', 'name email');

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: 'PYQ not found'
      });
    }

    res.json({
      success: true,
      data: pyq
    });
  } catch (error) {
    next(error);
  }
};
 
