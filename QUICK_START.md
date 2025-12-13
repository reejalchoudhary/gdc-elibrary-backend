# Quick Start Guide

Get your backend up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gdc-elibrary
JWT_SECRET=change-this-to-a-random-string
JWT_REFRESH_SECRET=change-this-to-another-random-string
ADMIN_EMAIL=admin@gdcnagrota.edu.in
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

**For Cloudinary (Optional but Recommended):**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

**OR use MongoDB Atlas (Cloud):**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

## Step 4: Seed Admin User

```bash
npm run seed
```

This creates the default admin user:
- Email: `admin@gdcnagrota.edu.in`
- Password: `admin123`

**⚠️ Change password after first login!**

## Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Step 6: Test the API

Open your browser or use Postman:

```
GET http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "E-Library API is running"
}
```

## 🎉 You're Ready!

Your backend is now running at `http://localhost:5000`

### Next Steps:

1. **Test Student Registration:**
   ```bash
   POST http://localhost:5000/api/auth/register
   ```

2. **Login as Admin:**
   ```bash
   POST http://localhost:5000/api/auth/login/admin
   Body: { "username": "admin", "password": "admin123" }
   ```

3. **Approve a Student:**
   ```bash
   PUT http://localhost:5000/api/admin/students/:studentId/approve
   ```

4. **Connect Frontend:**
   - Update frontend API base URL to `http://localhost:5000/api`
   - Add JWT token to requests

## 📚 Documentation

- Full API docs: `API_DOCUMENTATION.md`
- Setup guide: `README.md`
- Environment variables: `ENV_SETUP.md`

## 🐛 Troubleshooting

**Port already in use?**
- Change `PORT` in `.env` to another port (e.g., 5001)

**MongoDB connection failed?**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas, check network access settings

**Cloudinary upload fails?**
- Verify credentials in `.env`
- Check file size (max 30MB)
- Check file type (PDF, DOC, DOCX, TXT, Images only)

## 💡 Tips

- Use **Postman** or **Thunder Client** to test APIs
- Check server logs for detailed error messages
- Enable CORS for your frontend URL in `.env`

