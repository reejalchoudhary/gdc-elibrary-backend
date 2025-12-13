# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication Endpoints

### Register Student
**POST** `/auth/register`

**Body:**
```json
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

---

### Student Login
**POST** `/auth/login/student`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Admin Login
**POST** `/auth/login/admin`

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Refresh Token
**POST** `/auth/refresh`

**Body:**
```json
{
  "refreshToken": "..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### Get Current User
**GET** `/auth/me` (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "status": "approved"
  }
}
```

---

### Logout
**POST** `/auth/logout` (Protected)

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👨‍🎓 Student Endpoints

### Get Profile
**GET** `/students/profile` (Protected - Student only)

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Update Profile
**PUT** `/students/profile` (Protected - Student only)

**Body:**
```json
{
  "name": "John Doe Updated",
  "mobile": "9876543210"
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Students
**GET** `/admin/students` (Protected - Admin only)

**Query Parameters:**
- `status`: pending | approved | blocked
- `department`: BCA | BA | BSC | BCOM
- `search`: Search by name, email, or rollno

**Example:** `/admin/students?status=pending&department=BCA`

---

### Get Pending Students
**GET** `/admin/students/pending` (Protected - Admin only)

---

### Approve Student
**PUT** `/admin/students/:studentId/approve` (Protected - Admin only)

---

### Reject Student
**DELETE** `/admin/students/:studentId/reject` (Protected - Admin only)

---

### Block Student
**PUT** `/admin/students/:studentId/block` (Protected - Admin only)

---

### Unblock Student
**PUT** `/admin/students/:studentId/unblock` (Protected - Admin only)

---

### Delete Book
**DELETE** `/admin/books/:bookId` (Protected - Admin only)

---

### Delete Note
**DELETE** `/admin/notes/:noteId` (Protected - Admin only)

---

### Delete PYQ
**DELETE** `/admin/pyqs/:pyqId` (Protected - Admin only)

---

### Delete Discussion
**DELETE** `/admin/discussions/:messageId` (Protected - Admin only)

---

### Get Dashboard Stats
**GET** `/admin/dashboard/stats` (Protected - Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "students": {
      "total": 100,
      "pending": 5,
      "approved": 90,
      "blocked": 5
    },
    "content": {
      "books": 50,
      "notes": 30,
      "pyqs": 20,
      "discussions": 200
    }
  }
}
```

---

## 📚 Content Endpoints

### Books

#### Get All Books
**GET** `/content/books` (Public)

**Query Parameters:**
- `department`: BCA | BA | BSC | BCOM | All
- `year`: Filter by year/semester
- `category`: Filter by category
- `search`: Search by name or category

---

#### Get Single Book
**GET** `/content/books/:bookId` (Public)

---

#### Upload Book
**POST** `/content/books` (Protected - Approved users only)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File (PDF, DOC, DOCX, TXT, Images - Max 30MB)
- `name`: Book name
- `category`: Category
- `department`: BCA | BA | BSC | BCOM | All
- `year`: Year/Semester

---

### Notes

#### Get All Notes
**GET** `/content/notes` (Public)

**Query Parameters:** Same as books

---

#### Get Single Note
**GET** `/content/notes/:noteId` (Public)

---

#### Upload Note
**POST** `/content/notes` (Protected - Approved users only)

**Content-Type:** `multipart/form-data`

**Form Data:** Same as books

---

### PYQs

#### Get All PYQs
**GET** `/content/pyqs` (Public)

**Query Parameters:** Same as books

---

#### Get Single PYQ
**GET** `/content/pyqs/:pyqId` (Public)

---

#### Upload PYQ
**POST** `/content/pyqs` (Protected - Approved users only)

**Content-Type:** `multipart/form-data`

**Form Data:** Same as books

---

## 💬 Discussion Endpoints

### Get All Discussions
**GET** `/discussions` (Public)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "...",
      "text": "Hello everyone!",
      "name": "John Doe",
      "from": "Student",
      "createdAt": "..."
    }
  ]
}
```

---

### Create Discussion
**POST** `/discussions` (Protected - Approved users only)

**Body:**
```json
{
  "text": "Hello everyone!"
}
```

---

### Delete Discussion
**DELETE** `/discussions/:messageId` (Protected - Admin only)

---

## 📝 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔄 Token Refresh Flow

1. Client stores both `accessToken` and `refreshToken`
2. When `accessToken` expires (15 minutes), use `refreshToken` to get new tokens
3. Call `POST /api/auth/refresh` with `refreshToken`
4. Receive new `accessToken` and `refreshToken`
5. Update stored tokens

---

## 📋 File Upload Requirements

- **Max File Size:** 30MB
- **Allowed Types:** PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF
- **Content-Type:** `multipart/form-data`
- **Field Name:** `file`

---

## 🔒 Role-Based Access

### Student (Approved)
- ✅ View all content
- ✅ Upload content
- ✅ Participate in discussions
- ✅ View/Update own profile
- ❌ Cannot delete content
- ❌ Cannot manage students

### Admin
- ✅ All student permissions
- ✅ Delete any content
- ✅ Manage students (approve/reject/block)
- ✅ Delete discussions
- ✅ View dashboard stats

### Student (Pending)
- ❌ Cannot login
- ❌ Cannot access protected routes

### Student (Blocked)
- ❌ Cannot login
- ❌ Cannot access protected routes

