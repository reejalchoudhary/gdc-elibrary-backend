# Complete Deployment Guide - Backend to Render

## ✅ Backend Files Check

All backend files are ready for deployment:

### Core Files ✅
- ✅ `server.js` - Main server file
- ✅ `package.json` - Dependencies configured
- ✅ `.gitignore` - Properly configured (excludes .env)
- ✅ `render.yaml` - Render deployment config

### Controllers ✅
- ✅ `controllers/auth.controller.js`
- ✅ `controllers/student.controller.js`
- ✅ `controllers/admin.controller.js`
- ✅ `controllers/content.controller.js`
- ✅ `controllers/discussion.controller.js`

### Models ✅
- ✅ `models/User.model.js`
- ✅ `models/Book.model.js`
- ✅ `models/Note.model.js`
- ✅ `models/PYQ.model.js`
- ✅ `models/Discussion.model.js`

### Middleware ✅
- ✅ `middleware/auth.middleware.js`
- ✅ `middleware/role.middleware.js`
- ✅ `middleware/upload.middleware.js`
- ✅ `middleware/errorHandler.js`

### Routes ✅
- ✅ `routes/auth.routes.js`
- ✅ `routes/student.routes.js`
- ✅ `routes/admin.routes.js`
- ✅ `routes/content.routes.js`
- ✅ `routes/discussion.routes.js`

### Utils ✅
- ✅ `utils/jwt.utils.js`

### Scripts ✅
- ✅ `scripts/seedAdmin.js` - Admin user creation

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Local Repository

#### 1.1 Initialize Git (if not already done)
```bash
cd backend
git init
```

#### 1.2 Check Git Status
```bash
git status
```

#### 1.3 Verify .env is Ignored
```bash
# Check if .env is in .gitignore
cat .gitignore | grep .env
# Should output: .env
```

#### 1.4 Create .env File (Local Development)
```bash
# Create .env file with your credentials
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
MONGODB_URI=mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=supersecretkey-refresh-token
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@gdcnagrota.edu.in
ADMIN_PASSWORD=admin123
EOF
```

**Note:** This .env file will NOT be committed to GitHub (it's in .gitignore)

---

### Step 2: Push to GitHub

#### 2.1 Add All Files
```bash
# Make sure you're in the backend directory
cd backend

# Add all files (except .env which is ignored)
git add .
```

#### 2.2 Commit Changes
```bash
git commit -m "Initial backend deployment - MongoDB integration complete"
```

#### 2.3 Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `gdc-elibrary-backend` (or your preferred name)
4. Description: "GDC E-Library Backend API"
5. Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license
7. Click "Create repository"

**Option B: Via GitHub CLI**
```bash
gh repo create gdc-elibrary-backend --public --source=. --remote=origin --push
```

#### 2.4 Add Remote and Push
```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-backend.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/gdc-elibrary-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### 2.5 Verify Push
```bash
# Check remote
git remote -v

# Verify files on GitHub
# Go to your repository on GitHub and verify all files are there
# Make sure .env is NOT visible (it should be ignored)
```

---

### Step 3: Deploy to Render

#### 3.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/Login (use GitHub for easy integration)

#### 3.2 Create New Web Service

1. **Click "New +"** → **"Web Service"**

2. **Connect Repository:**
   - Click "Connect account" if not connected
   - Select your GitHub account
   - Choose repository: `gdc-elibrary-backend`
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `gdc-elibrary-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ **IMPORTANT**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free` (or upgrade if needed)

4. **Set Environment Variables:**
   Click "Add Environment Variable" and add each:

   ```
   NODE_ENV = production
   ```
   
   ```
   PORT = 10000
   ```
   
   ```
   MONGO_URI = mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
   ```
   
   ```
   MONGODB_URI = mongodb+srv://reejalree_db_user:cvN5icLe2h14Hqs1@gdc-elibrary.qnvqe8h.mongodb.net/?appName=gdc-elibrary
   ```
   
   ```
   JWT_SECRET = supersecretkey
   ```
   
   ```
   JWT_REFRESH_SECRET = supersecretkey-refresh-token
   ```
   
   ```
   JWT_EXPIRE = 15m
   ```
   
   ```
   JWT_REFRESH_EXPIRE = 7d
   ```
   
   ```
   FRONTEND_URL = http://localhost:5173
   ```
   ⚠️ **Update this later with your Vercel URL after frontend deployment**
   
   ```
   ADMIN_EMAIL = admin@gdcnagrota.edu.in
   ```
   
   ```
   ADMIN_PASSWORD = admin123
   ```

5. **Advanced Settings (Optional):**
   - Auto-Deploy: `Yes` (deploys on every push to main)
   - Health Check Path: `/api/health`

6. **Click "Create Web Service"**

#### 3.3 Wait for Deployment
- Render will:
  1. Clone your repository
  2. Install dependencies (`npm install`)
  3. Build the application
  4. Start the server (`npm start`)
- This takes 3-5 minutes
- Watch the logs for any errors

#### 3.4 Verify Deployment
1. Once deployed, you'll see a URL like:
   `https://gdc-elibrary-backend.onrender.com`

2. Test the health endpoint:
   ```
   https://gdc-elibrary-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"E-Library API is running"}`

3. Check logs in Render dashboard for any errors

---

### Step 4: Seed Admin User

#### 4.1 Using Render Shell
1. In Render dashboard, go to your service
2. Click "Shell" tab
3. Run:
   ```bash
   cd backend
   npm run seed
   ```

#### 4.2 Or Use MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Use MongoDB Compass or Atlas UI
3. Manually create admin user (see seed script for structure)

---

### Step 5: Update Frontend URL

After frontend is deployed on Vercel:

1. Go to Render dashboard
2. Go to your service → Environment
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
4. Save changes (will trigger redeploy)

---

## 📋 Complete Command Checklist

### Local Setup
```bash
# Navigate to backend
cd backend

# Initialize git (if not done)
git init

# Check .gitignore
cat .gitignore

# Create .env (for local development only)
# Copy from .env.example and fill values

# Test locally
npm install
npm run seed
npm run dev
```

### GitHub Push
```bash
# Add files
git add .

# Commit
git commit -m "Backend ready for deployment"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/gdc-elibrary-backend.git

# Push
git branch -M main
git push -u origin main
```

### Render Deployment
1. Create account on render.com
2. Connect GitHub
3. Create Web Service
4. Configure settings (see Step 3.2)
5. Set environment variables
6. Deploy

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend URL is accessible
- [ ] Health endpoint works: `/api/health`
- [ ] MongoDB connection successful (check logs)
- [ ] Admin user seeded
- [ ] Environment variables set correctly
- [ ] CORS allows frontend URL
- [ ] API endpoints respond correctly

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (should be 16+)
- Verify all dependencies in package.json
- Check build logs in Render

### MongoDB Connection Error
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access
- Verify username/password

### Port Error
- Render uses PORT 10000 (or provided PORT env var)
- Make sure server.js uses `process.env.PORT`

### CORS Error
- Update FRONTEND_URL in environment variables
- Restart service after updating

---

## 🔄 Updating Deployment

### After Code Changes
```bash
# Make changes locally
git add .
git commit -m "Update description"
git push origin main

# Render will auto-deploy (if auto-deploy enabled)
```

### Manual Redeploy
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 📝 Important Notes

1. **Never commit .env file** - It's in .gitignore
2. **Always set environment variables in Render** - Don't hardcode secrets
3. **Update FRONTEND_URL** - After frontend deployment
4. **Change admin password** - After first login
5. **Monitor logs** - Check Render logs regularly

---

## 🎉 Success!

Your backend is now deployed on Render!

**Backend URL:** `https://gdc-elibrary-backend.onrender.com`  
**API Base:** `https://gdc-elibrary-backend.onrender.com/api`

Next: Deploy frontend to Vercel and update FRONTEND_URL in Render.

