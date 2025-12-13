# Frontend Integration Guide

This guide helps you integrate the backend API with your existing React frontend.

## 1. Create API Service File

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
};

// Helper function to get refresh token
const getRefreshToken = () => {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
};

// Helper function to store tokens
const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Helper function to clear tokens
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

// API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // If token expired, try to refresh
    if (response.status === 401 && data.message?.includes('expired')) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry request with new token
        config.headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
        return await retryResponse.json();
      }
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    window.location.href = '/login-selector';
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    
    if (data.success) {
      storeTokens(data.data.accessToken, data.data.refreshToken);
      return data.data.accessToken;
    } else {
      clearTokens();
      window.location.href = '/login-selector';
      return null;
    }
  } catch (error) {
    clearTokens();
    window.location.href = '/login-selector';
    return null;
  }
};

// Auth API
export const authAPI = {
  register: (studentData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),

  loginStudent: (email, password) => apiRequest('/auth/login/student', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  loginAdmin: (username, password) => apiRequest('/auth/login/admin', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  }),

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getCurrentUser: () => apiRequest('/auth/me'),
};

// Student API
export const studentAPI = {
  getProfile: () => apiRequest('/students/profile'),
  updateProfile: (data) => apiRequest('/students/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Admin API
export const adminAPI = {
  getAllStudents: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/admin/students${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getPendingStudents: () => apiRequest('/admin/students/pending'),
  
  approveStudent: (studentId) => apiRequest(`/admin/students/${studentId}/approve`, {
    method: 'PUT',
  }),
  
  rejectStudent: (studentId) => apiRequest(`/admin/students/${studentId}/reject`, {
    method: 'DELETE',
  }),
  
  blockStudent: (studentId) => apiRequest(`/admin/students/${studentId}/block`, {
    method: 'PUT',
  }),
  
  unblockStudent: (studentId) => apiRequest(`/admin/students/${studentId}/unblock`, {
    method: 'PUT',
  }),
  
  deleteBook: (bookId) => apiRequest(`/admin/books/${bookId}`, {
    method: 'DELETE',
  }),
  
  deleteNote: (noteId) => apiRequest(`/admin/notes/${noteId}`, {
    method: 'DELETE',
  }),
  
  deletePYQ: (pyqId) => apiRequest(`/admin/pyqs/${pyqId}`, {
    method: 'DELETE',
  }),
  
  deleteDiscussion: (messageId) => apiRequest(`/admin/discussions/${messageId}`, {
    method: 'DELETE',
  }),
  
  getDashboardStats: () => apiRequest('/admin/dashboard/stats'),
};

// Content API
export const contentAPI = {
  // Books
  getAllBooks: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/content/books${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getBook: (bookId) => apiRequest(`/content/books/${bookId}`),
  
  uploadBook: async (file, data) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('department', data.department);
    formData.append('year', data.year);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/content/books`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  },

  // Notes
  getAllNotes: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/content/notes${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getNote: (noteId) => apiRequest(`/content/notes/${noteId}`),
  
  uploadNote: async (file, data) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('department', data.department);
    formData.append('year', data.year);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/content/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  },

  // PYQs
  getAllPYQs: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/content/pyqs${queryParams ? `?${queryParams}` : ''}`);
  },
  
  getPYQ: (pyqId) => apiRequest(`/content/pyqs/${pyqId}`),
  
  uploadPYQ: async (file, data) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('department', data.department);
    formData.append('year', data.year);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/content/pyqs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await response.json();
  },
};

// Discussion API
export const discussionAPI = {
  getAllDiscussions: () => apiRequest('/discussions'),
  
  createDiscussion: (text) => apiRequest('/discussions', {
    method: 'POST',
    body: JSON.stringify({ text }),
  }),
  
  deleteDiscussion: (messageId) => apiRequest(`/discussions/${messageId}`, {
    method: 'DELETE',
  }),
};

export { storeTokens, clearTokens, getAuthToken };
```

## 2. Update Student Login Component

Update `src/pages/Login/StudentLogin.jsx`:

```javascript
import { authAPI, storeTokens } from '../../services/api';

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await authAPI.loginStudent(email, password);
    
    if (response.success) {
      // Store tokens
      storeTokens(response.data.accessToken, response.data.refreshToken);
      
      // Store user data
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('role', response.data.user.role);
      sessionStorage.setItem('loggedInStudent', JSON.stringify(response.data.user));
      
      setMessage(`✅ Welcome ${response.data.user.name}! Redirecting...`);
      
      if (onLogin) onLogin();
      setTimeout(() => navigate('/home'), 1500);
    } else {
      setMessage(response.message || 'Login failed');
    }
  } catch (error) {
    setMessage('❌ An error occurred. Please try again.');
  }
};
```

## 3. Update Admin Login Component

Update `src/pages/Login/AdminLogin.jsx`:

```javascript
import { authAPI, storeTokens } from '../../services/api';

const handleAdminLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await authAPI.loginAdmin(username, password);
    
    if (response.success) {
      storeTokens(response.data.accessToken, response.data.refreshToken);
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('role', 'admin');
      
      setMessage('✅ Admin login successful!');
      setIsError(false);
      
      setTimeout(() => {
        if (onLogin) onLogin();
        navigate('/admin-dashboard');
      }, 1500);
    } else {
      setMessage(response.message || '❌ Invalid admin credentials');
      setIsError(true);
    }
  } catch (error) {
    setMessage('❌ An error occurred. Please try again.');
    setIsError(true);
  }
};
```

## 4. Update Register Component

Update `src/pages/Register.jsx`:

```javascript
import { authAPI } from '../services/api';

const handleRegister = async (e) => {
  e.preventDefault();
  
  try {
    const response = await authAPI.register({
      name,
      email,
      password,
      rollno,
      department,
      year,
      mobile
    });
    
    if (response.success) {
      setMessage(response.message);
      setTimeout(() => navigate('/student-login'), 2000);
    } else {
      setMessage(response.message || 'Registration failed');
    }
  } catch (error) {
    setMessage('❌ An error occurred. Please try again.');
  }
};
```

## 5. Update Books Component

Update `src/pages/Books.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { contentAPI } from '../services/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadBooks();
  }, []);
  
  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAllBooks({
        department: departmentFilter,
        year: yearFilter,
        category: categoryFilter,
        search: query
      });
      
      if (response.success) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of component
}
```

## 6. Update Upload Component

Update `src/pages/Upload.jsx`:

```javascript
import { contentAPI } from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!file) return pushToast('Choose a file.', 'error');
  
  try {
    pushToast('Uploading...', 'info', 1500);
    
    const uploadFunction = 
      type === 'book' ? contentAPI.uploadBook :
      type === 'note' ? contentAPI.uploadNote :
      contentAPI.uploadPYQ;
    
    const response = await uploadFunction(file, {
      name: name.trim(),
      category: category.trim(),
      department,
      year
    });
    
    if (response.success) {
      pushToast('Upload successful 🎉', 'success');
      // Reload content
      loadContent();
    } else {
      pushToast(response.message || 'Upload failed', 'error');
    }
  } catch (error) {
    pushToast('Upload failed. Please try again.', 'error');
  }
};
```

## 7. Environment Variables

Add to `.env` (frontend root):

```env
VITE_API_URL=http://localhost:5000/api
```

## 8. Update App.jsx for Auth Check

```javascript
import { useEffect } from 'react';
import { authAPI } from './services/api';

// Check if user is still authenticated on app load
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          setIsLoggedIn(true);
          setRole(response.data.role);
        }
      } catch (error) {
        // Token invalid, clear storage
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  };
  
  checkAuth();
}, []);
```

## Key Changes Summary

1. ✅ Replace localStorage with API calls
2. ✅ Add JWT token to all authenticated requests
3. ✅ Implement token refresh logic
4. ✅ Handle file uploads with FormData
5. ✅ Update all CRUD operations to use API
6. ✅ Add loading and error states
7. ✅ Handle authentication state properly

## Testing Checklist

- [ ] Student registration works
- [ ] Student login works (only if approved)
- [ ] Admin login works
- [ ] Token refresh works
- [ ] File uploads work
- [ ] Content listing works
- [ ] Admin approval workflow works
- [ ] Discussions work
- [ ] Logout clears tokens

---

**Note:** Make sure your backend is running before testing frontend integration!

