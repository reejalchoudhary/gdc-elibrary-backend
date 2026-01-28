import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Book name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['BCA', 'BA', 'BSC', 'BCOM', 'All']
  },
  year: {
    type: String,
    required: [true, 'Year/Semester is required']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  fileData: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

bookSchema.index({ department: 1, year: 1 });
bookSchema.index({ category: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book; 

