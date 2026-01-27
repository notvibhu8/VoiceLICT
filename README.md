# VoiceLICT Frontend

A modern, mobile-first web application for LICT college students to submit and track campus problems.

## 🚀 Features

- **Anonymous Problem Reporting**: Submit issues via text, images, videos, or voice recordings
- **AI-Powered Clustering**: Automatically groups similar problems together
- **Real-time Trending**: See what issues are affecting the most students
- **Track Submissions**: Monitor the status of your reported problems
- **Google OAuth**: Secure login with @lict.edu.np email
- **Mobile-First Design**: Optimized for smartphones (70% of users)
- **Accessible**: WCAG 2.1 Level AA compliant

## 📁 Project Structure

```
voicelict-frontend/
├── index.html              # Landing page
├── login.html              # Login/authentication page
├── dashboard.html          # Main dashboard with submission form
├── submissions.html        # User's submission history
├── static/
│   ├── css/
│   │   └── styles.css      # Main stylesheet with design system
│   ├── js/
│   │   ├── main.js         # Utility functions & toast notifications
│   │   ├── auth.js         # Authentication logic
│   │   ├── api.js          # API client
│   │   └── upload.js       # File upload handling
│   └── images/
│       └── (logo, icons, etc.)
└── README.md               # This file
```

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom design system with CSS variables
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Google Fonts** - Space Grotesk for headings
- **FastAPI Backend** - REST API at `http://localhost:8000`

## 🎨 Design System

### Colors
- **Primary**: `#0706af` (Deep Blue)
- **Accent**: Orange `#ff6b35`, Yellow `#ffd23f`, Green `#10b981`, Pink `#ec4899`
- **Semantic**: Success, Error, Warning, Info

### Typography
- **Display Font**: Space Grotesk (700, 800)
- **Body Font**: System font stack

### Breakpoints
- Mobile: 0-640px (default)
- Tablet: 641px+
- Desktop: 1024px+
- Large: 1280px+

## ⚙️ Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running at `http://localhost:8000`

### Installation

1. **Clone or download this repository**
   ```bash
   cd voicelict-frontend
   ```

2. **Serve the files**
   
   Option A - Python HTTP Server:
   ```bash
   python -m http.server 8080
   ```
   
   Option B - Node.js HTTP Server:
   ```bash
   npx serve .
   ```
   
   Option C - VS Code Live Server:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Access the application**
   ```
   http://localhost:8080
   ```

### Backend Configuration

Ensure your FastAPI backend is running with these endpoints:

```
POST   /api/v1/auth/google/login      - Initiate OAuth
GET    /api/v1/auth/me                - Get user info
POST   /api/v1/submissions            - Create submission
GET    /api/v1/submissions/me         - Get user submissions
DELETE /api/v1/submissions/:id        - Delete submission
POST   /api/v1/files/upload           - Upload file
GET    /api/v1/clusters/trending      - Get trending issues
GET    /api/v1/clusters               - Get all clusters
```

## 📱 Usage Guide

### For Students

1. **Landing Page** (`/`)
   - Learn about VoiceLICT
   - See recent impact examples
   - Click "Get Started" to login

2. **Login** (`/login.html`)
   - Click "Continue with Google"
   - Sign in with @lict.edu.np email
   - Redirected to dashboard

3. **Dashboard** (`/dashboard.html`)
   - Submit new problems
   - Attach files (images, videos, audio)
   - Choose anonymous submission
   - View trending issues

4. **My Submissions** (`/submissions.html`)
   - View all your submissions
   - Filter by status (Pending, Clustered, Escalated, Resolved)
   - Delete pending submissions
   - Track similar reports

## 🔐 Authentication Flow

```
1. User clicks "Login with Google"
   ↓
2. Redirect to /api/v1/auth/google/login
   ↓
3. Google OAuth flow
   ↓
4. Callback with JWT token
   ↓
5. Store token in localStorage
   ↓
6. Include token in API requests: Authorization: Bearer {token}
```

## 📤 File Upload

### Supported Formats
- **Images**: JPG, PNG (max 5MB)
- **Videos**: MP4 (max 50MB)
- **Audio**: MP3, WAV (max 10MB)

### Upload Process
1. Drag & drop files or click to browse
2. Frontend validates type and size
3. Files uploaded to `/api/v1/files/upload`
4. Receives file URLs
5. URLs included in submission

## 🧪 Testing Checklist

- [ ] Login with @lict.edu.np email works
- [ ] Login with non-LICT email is rejected
- [ ] File upload validates types and sizes
- [ ] File upload shows progress
- [ ] Submission form validates required fields
- [ ] Submission succeeds and shows confirmation
- [ ] My Submissions shows all user submissions
- [ ] Trending issues display correctly
- [ ] Anonymous submission hides user info
- [ ] Logout clears session
- [ ] Mobile responsive on iPhone/Android
- [ ] Works in Chrome, Firefox, Safari
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible

## 🐛 Troubleshooting

### Login Issues
- Ensure backend OAuth is configured correctly
- Check browser console for errors
- Verify @lict.edu.np email domain

### File Upload Fails
- Check file size limits
- Verify file type is supported
- Check network connection
- Ensure backend `/files/upload` endpoint is working

### API Errors
- Verify backend is running on `http://localhost:8000`
- Check browser console for detailed errors
- Ensure CORS is configured on backend

## 🔒 Security

- JWT tokens stored in localStorage
- XSS prevention via HTML escaping
- File type validation on frontend and backend
- CSRF protection (implement on backend)
- HTTPS required in production
- Email domain restriction (@lict.edu.np only)

## ♿ Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast ratio 4.5:1+
- Screen reader compatible
- Reduced motion support

## 📊 Performance

- Page load time < 3 seconds
- Images lazy loaded
- CSS/JS minified in production
- Gzip compression enabled
- Local storage for auth caching

## 🚀 Deployment

### Production Checklist

1. **Update API endpoint**
   ```javascript
   // In static/js/api.js
   const API_BASE_URL = 'https://api.voicelict.edu.np/api/v1';
   ```

2. **Enable HTTPS**
   - Configure SSL certificate
   - Force HTTPS redirects

3. **Minify assets**
   ```bash
   # CSS
   npx csso static/css/styles.css --output static/css/styles.min.css
   
   # JavaScript
   npx terser static/js/*.js -o static/js/bundle.min.js
   ```

4. **Configure CDN** (optional)
   - Upload static assets to CDN
   - Update asset URLs

5. **Set up monitoring**
   - Error tracking (e.g., Sentry)
   - Analytics (e.g., Google Analytics)

## 📝 API Response Examples

### Create Submission
```javascript
// POST /api/v1/submissions
{
  "title": "WiFi not working in Block B",
  "description": "WiFi has been down for 2 days...",
  "file_urls": ["https://s3.../image1.jpg"],
  "is_anonymous": false
}

// Response:
{
  "id": 123,
  "title": "WiFi not working in Block B",
  "status": "pending",
  "created_at": "2026-01-27T10:30:00Z"
}
```

### Get Trending Issues
```javascript
// GET /api/v1/clusters/trending
[
  {
    "id": 1,
    "title": "WiFi connectivity issues",
    "student_count": 23,
    "status": "escalated"
  },
  {
    "id": 2,
    "title": "Library opening hours",
    "student_count": 18,
    "status": "under_review"
  }
]
```

## 🤝 Contributing

1. Follow existing code style
2. Test on multiple browsers
3. Ensure mobile responsiveness
4. Maintain accessibility standards
5. Document any new features

## 📄 License

Copyright © 2026 VoiceLICT. For LICT students only.

## 📧 Support

For issues or questions:
- Email: support@voicelict.edu.np
- Submit issue in the app

---

**Built with ❤️ for LICT students**