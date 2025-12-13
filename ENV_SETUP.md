# Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

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

# Cloudinary Configuration (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Default Credentials (change after first login)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@gdcnagrota.edu.in
ADMIN_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## How to Get Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Paste them in the `.env` file

## Security Notes

- **Never commit `.env` file to version control**
- Change default admin credentials after first login
- Use strong, random strings for JWT secrets in production
- Use MongoDB Atlas connection string for production deployments

