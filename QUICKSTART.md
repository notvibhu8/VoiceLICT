# VoiceLICT Frontend - Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Start a Local Server
```bash
cd voicelict-frontend
python -m http.server 8080
```

### Step 2: Open in Browser
```
http://localhost:8080
```

### Step 3: Configure Backend
Make sure your FastAPI backend is running on `http://localhost:8000`

## 📂 File Overview

| File | Purpose |
|------|---------|
| `index.html` | Landing page with features and benefits |
| `login.html` | Google OAuth login page |
| `dashboard.html` | Main app - submit problems & see trending |
| `submissions.html` | View user's submission history |
| `static/css/styles.css` | Complete design system & components |
| `static/js/main.js` | Utilities, toast notifications |
| `static/js/auth.js` | Authentication & token management |
| `static/js/api.js` | API client for backend requests |
| `static/js/upload.js` | File upload with drag-and-drop |

## 🎯 Key Features Implemented

### ✅ Landing Page
- Hero section with CTA
- How it works (4 steps)
- Recent impact examples
- Feature showcase
- Mobile-responsive navigation

### ✅ Login Page
- Google OAuth integration
- Email domain validation
- Error handling
- Clean, centered design

### ✅ Dashboard
- Problem submission form
- Multi-file upload (drag & drop)
- Character counter
- Anonymous submission option
- Trending issues sidebar
- Real-time updates

### ✅ My Submissions
- Submission history
- Status filtering (All, Pending, Clustered, Escalated, Resolved)
- Delete pending submissions
- File attachment previews
- Similar reports count

## 🎨 Design System

### Colors
```css
--primary: #0706af
--accent-orange: #ff6b35
--accent-yellow: #ffd23f
--success: #10b981
--error: #ef4444
```

### Components
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Cards: `.card`, `.submission-card`, `.trending-item`
- Forms: `.form-group`, `.form-input`, `.form-textarea`
- Badges: `.badge-pending`, `.badge-clustered`, `.badge-escalated`, `.badge-resolved`
- Toasts: Automatic notifications

## 🔧 JavaScript API

### Authentication
```javascript
checkAuth()           // Check if logged in
logout()             // Clear session and redirect
getAuthToken()       // Get JWT token
getAuthUser()        // Get user object
```

### API Requests
```javascript
apiRequest(endpoint, options)  // Generic API call
apiGet(endpoint)              // GET request
apiPost(endpoint, data)       // POST request
apiDelete(endpoint)           // DELETE request
```

### File Upload
```javascript
uploadFile(file)              // Upload single file
uploadFiles()                 // Upload all queued files
clearUploadedFiles()          // Clear upload queue
```

### Utilities
```javascript
showToast(message, type)      // Show notification
formatDate(dateString)        // Format timestamps
validateFileType(file)        // Check file type
validateFileSize(file, type)  // Check file size
```

## 📱 Mobile Optimization

- Mobile-first CSS approach
- Touch-friendly buttons (48px min)
- Responsive grid layouts
- Hamburger menu < 640px
- Optimized file upload for mobile

## 🔒 Security Features

- JWT token storage in localStorage
- XSS prevention (HTML escaping)
- File type validation
- File size limits enforced
- Email domain restriction
- Automatic token refresh

## 🧪 Testing Pages

### Test Login Flow
1. Go to `/login.html`
2. Click "Continue with Google"
3. Should redirect to backend OAuth
4. Callback should store token and redirect to dashboard

### Test Submission
1. Go to `/dashboard.html` (after login)
2. Fill in title and description
3. Drag files to upload area
4. Click "Submit Problem"
5. Should see success toast and form reset

### Test Filtering
1. Go to `/submissions.html`
2. Click different status filters
3. List should update accordingly

## 🎯 Customization Points

### Change Colors
Edit CSS variables in `static/css/styles.css`:
```css
:root {
  --primary: #0706af;  /* Your brand color */
  --accent-orange: #ff6b35;
}
```

### Change API URL
Edit `static/js/api.js`:
```javascript
const API_BASE_URL = 'https://your-api.com/api/v1';
```

### Add New Pages
1. Create new HTML file
2. Include CSS and JS: `<link rel="stylesheet" href="static/css/styles.css">`
3. Add to navigation in navbar

## 💡 Pro Tips

1. **Use Browser DevTools**: Open console to see API calls and errors
2. **Test Mobile**: Use Chrome DevTools responsive mode
3. **Check Accessibility**: Use Lighthouse in Chrome DevTools
4. **Monitor Network**: Check Network tab for failed API calls
5. **Clear Cache**: Hard refresh (Ctrl+Shift+R) when CSS doesn't update

## 🐛 Common Issues

### "Failed to fetch" error
- Backend not running
- CORS not configured
- Wrong API URL

### Login redirect fails
- OAuth not configured in backend
- Wrong callback URL
- Browser blocking cookies

### File upload stuck
- File too large
- Wrong file type
- Backend endpoint issue

## 📚 Next Steps

1. **Deploy Backend**: Get FastAPI running in production
2. **Configure OAuth**: Set up Google Cloud credentials
3. **Test Email**: Verify @lict.edu.np domain works
4. **Add Monitoring**: Set up error tracking
5. **Load Testing**: Test with multiple concurrent users

## 🤝 Need Help?

- Check README.md for detailed documentation
- Review browser console for errors
- Test API endpoints with Postman
- Verify backend is accessible

---

**Happy Coding! 🎉**