import User from '../models/User.model.js';
import Book from '../models/Book.model.js';
import Note from '../models/Note.model.js';
import PYQ from '../models/PYQ.model.js';
import Discussion from '../models/Discussion.model.js';

export const getAllStudents = async (req, res, next) => {
  try {
    const { status, department, search } = req.query;
    const query = { role: 'student' };

    if (status) query.status = status;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollno: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student', status: 'pending' })
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

export const approveStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.status = 'approved';
    await student.save();

    res.json({
      success: true,
      message: 'Student approved successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const rejectStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await User.findByIdAndDelete(studentId);

    res.json({
      success: true,
      message: 'Student registration rejected and removed'
    });
  } catch (error) {
    next(error);
  }
};

export const blockStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.status = 'blocked';
    student.refreshToken = null;
    await student.save();

    res.json({
      success: true,
      message: 'Student blocked successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const unblockStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.status = 'approved';
    await student.save();

    res.json({
      success: true,
      message: 'Student unblocked successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        status: student.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await Book.findByIdAndDelete(bookId);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    await Note.findByIdAndDelete(noteId);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePYQ = async (req, res, next) => {
  try {
    const { pyqId } = req.params;

    const pyq = await PYQ.findById(pyqId);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: 'PYQ not found'
      });
    }

    await PYQ.findByIdAndDelete(pyqId);

    res.json({
      success: true,
      message: 'PYQ deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiscussionMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Discussion.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await Discussion.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Discussion message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      pendingStudents,
      approvedStudents,
      blockedStudents,
      totalBooks,
      totalNotes,
      totalPYQs,
      totalDiscussions
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', status: 'pending' }),
      User.countDocuments({ role: 'student', status: 'approved' }),
      User.countDocuments({ role: 'student', status: 'blocked' }),
      Book.countDocuments(),
      Note.countDocuments(),
      PYQ.countDocuments(),
      Discussion.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          pending: pendingStudents,
          approved: approvedStudents,
          blocked: blockedStudents
        },
        content: {
          books: totalBooks,
          notes: totalNotes,
          pyqs: totalPYQs,
          discussions: totalDiscussions
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 

