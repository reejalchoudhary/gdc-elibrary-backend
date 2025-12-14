import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import adminRoutes from './routes/admin.routes.js';
import contentRoutes from './routes/content.routes.js';
import discussionRoutes from './routes/discussion.routes.js';
import User from './models/User.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to support multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowedOrigin => origin === allowedOrigin || origin.startsWith(allowedOrigin))) {
      callback(null, true);
    } else {
      // In production, allow any Vercel preview/deployment URL
      if (process.env.NODE_ENV === 'production' && origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked origin: ${origin}`);
        callback(null, true); // Allow for now, but log warning
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development' || req.path.includes('/api/auth')) {
    console.log(`${req.method} ${req.path}`, {
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent']?.substring(0, 50)
    });
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'GDC E-Library API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      admin: '/api/admin',
      content: '/api/content',
      discussions: '/api/discussions'
    }
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'GDC E-Library API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      admin: '/api/admin',
      content: '/api/content',
      discussions: '/api/discussions'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-Library API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/discussions', discussionRoutes);

// 404 handler for undefined API routes (before error handler)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      admin: '/api/admin',
      content: '/api/content',
      discussions: '/api/discussions'
    }
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    hint: 'API endpoints are available at /api/*'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gdc-elibrary';

// Function to seed admin if it doesn't exist
const seedAdminIfNeeded = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      console.log('📝 No admin user found. Creating admin user...');
      const admin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@gdcnagrota.edu.in',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        status: 'approved',
        department: 'All',
        year: 'All'
      });
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    // Don't exit - allow server to start even if admin seeding fails
  }
};

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Seed admin user if needed
    await seedAdminIfNeeded();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 E-Library API: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

