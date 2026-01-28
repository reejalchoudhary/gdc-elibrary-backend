import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  rollno: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['BCA', 'BA', 'BSC', 'BCOM']
  },
  year: {
    type: String,
    required: [true, 'Year/Semester is required']
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Mobile must be 10 digits']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending'
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;





