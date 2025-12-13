# GDC E-Library Backend API

Complete backend system for the GDC Nagrota Surian E-Library built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **JWT Authentication** with access and refresh tokens
- **Role-Based Access Control** (Student & Admin)
- **Student Approval Workflow** (Pending → Approved)
- **File Upload** with Cloudinary integration
- **Content Management** (Books, Notes, PYQs)
- **Discussion Forum** with moderation
- **RESTful API** architecture
- **MVC Pattern** for clean code organization

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads) - Optional but recommended

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/gdc-elibrary
   # OR use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdc-elibrary

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-too
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d

   # Cloudinary Configuration (Optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Admin Default Credentials
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@gdcnagrota.edu.in
   ADMIN_PASSWORD=admin123

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

5. **Seed admin user:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Student registration
- `POST /api/auth/login/student` - Student login
- `POST /api/auth/login/admin` - Admin login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Student Routes

- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile

### Admin Routes

**Student Management:**
- `GET /api/admin/students` - Get all students (with filters)
- `GET /api/admin/students/pending` - Get pending students
- `PUT /api/admin/students/:studentId/approve` - Approve student
- `DELETE /api/admin/students/:studentId/reject` - Reject student
- `PUT /api/admin/students/:studentId/block` - Block student
- `PUT /api/admin/students/:studentId/unblock` - Unblock student

**Content Management:**
- `DELETE /api/admin/books/:bookId` - Delete book
- `DELETE /api/admin/notes/:noteId` - Delete note
- `DELETE /api/admin/pyqs/:pyqId` - Delete PYQ

**Discussion Management:**
- `DELETE /api/admin/discussions/:messageId` - Delete discussion message

**Dashboard:**
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Content Routes

**Books:**
- `GET /api/content/books` - Get all books (with filters)
- `GET /api/content/books/:bookId` - Get single book
- `POST /api/content/books` - Upload book (requires auth)

**Notes:**
- `GET /api/content/notes` - Get all notes (with filters)
- `GET /api/content/notes/:noteId` - Get single note
- `POST /api/content/notes` - Upload note (requires auth)

**PYQs:**
- `GET /api/content/pyqs` - Get all PYQs (with filters)
- `GET /api/content/pyqs/:pyqId` - Get single PYQ
- `POST /api/content/pyqs` - Upload PYQ (requires auth)

### Discussion Routes

- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create discussion message (requires auth)
- `DELETE /api/discussions/:messageId` - Delete message (admin only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Flow:

1. **Login** → Receive `accessToken` and `refreshToken`
2. **Access Token** expires in 15 minutes (configurable)
3. **Refresh Token** expires in 7 days (configurable)
4. When access token expires, use refresh token to get new access token
5. **Logout** → Invalidates refresh token

## 📝 Request/Response Examples

### Student Registration

**Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollno": "23BCA045",
  "department": "BCA",
  "year": "1st Semester",
  "mobile": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration submitted! Please wait for admin approval.",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending"
  }
}
```

### Upload Book

**Request:**
```
POST /api/content/books
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <file>
- name: "Introduction to Programming"
- category: "Programming"
- department: "BCA"
- year: "1st Semester"
```

## 🗂️ Project Structure

```
backend/
├── controllers/       # Business logic
│   ├── auth.controller.js
│   ├── student.controller.js
│   ├── admin.controller.js
│   ├── content.controller.js
│   └── discussion.controller.js
├── middleware/       # Custom middleware
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── upload.middleware.js
│   └── errorHandler.js
├── models/           # MongoDB models
│   ├── User.model.js
│   ├── Book.model.js
│   ├── Note.model.js
│   ├── PYQ.model.js
│   └── Discussion.model.js
├── routes/           # API routes
│   ├── auth.routes.js
│   ├── student.routes.js
│   ├── admin.routes.js
│   ├── content.routes.js
│   └── discussion.routes.js
├── utils/            # Utility functions
│   ├── jwt.utils.js
│   └── cloudinary.utils.js
├── scripts/          # Utility scripts
│   └── seedAdmin.js
├── server.js         # Entry point
├── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation
- File type and size validation
- CORS configuration
- Error handling middleware

## 🧪 Testing

You can test the API using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl
- Frontend application

## 📚 User Roles & Permissions

### Student Role
- Register (status: pending)
- Login (only if approved)
- View books, notes, PYQs
- Upload books, notes, PYQs (if approved)
- Participate in discussions (if approved)
- View own profile

### Admin Role
- Login (no approval needed)
- View all students
- Approve/Reject/Block students
- Delete any content (books, notes, PYQs)
- Delete discussion messages
- View dashboard statistics

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

**Cloudinary Upload Error:**
- Verify Cloudinary credentials in .env
- Check file size limits (30MB max)

**JWT Token Error:**
- Ensure JWT_SECRET is set in .env
- Check token expiration settings

## 📄 License

ISC

## 👨‍💻 Development

For development with auto-reload:
```bash
npm run dev
```

The server will restart automatically on file changes.

