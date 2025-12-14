import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  from: {
    type: String,
    enum: ['Admin', 'Student'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  highlight: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
discussionSchema.index({ createdAt: -1 });

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;



