# Quick Deploy Commands

## 🚀 Fast Track Deployment

### 1. Prepare & Push to GitHub

```bash
# Navigate to backend folder
cd backend

# Check git status
git status

# Add all files (except .env which is ignored)
git add .

# Commit
git commit -m "Backend ready for Render deployment"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) → Sign up/Login
2. Click "New +" → "Web Service"
3. Connect GitHub → Select repository
4. Configure:
   - **Name:** `gdc-elibrary-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables (see below)
6. Click "Create Web Service"

### 3. Environment Variables for Render

Copy and paste these in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
MONGODB_URI=mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=supersecretkey-refresh-token
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@gdcnagrota.edu.in
ADMIN_PASSWORD=admin123
```

### 4. Seed Admin User

After deployment, in Render Shell:
```bash
cd backend
npm run seed
```

### 5. Test Deployment

Visit: `https://your-service.onrender.com/api/health`

Should return: `{"status":"OK","message":"E-Library API is running"}`

---

## ✅ Done!

Your backend is live on Render! 🎉

