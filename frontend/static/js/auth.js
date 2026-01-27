// VoiceLICT - Authentication Module

const AUTH_STORAGE_KEY = 'voicelict_auth';
const TOKEN_STORAGE_KEY = 'voicelict_token';

/**
 * Store authentication data
 */
function storeAuth(token, user) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Get stored authentication token
 */
function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Get stored user data
 */
function getAuthUser() {
  const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Clear authentication data
 */
function clearAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Logout user
 */
function logout() {
  clearAuth();
  window.location.href = '/login.html';
}

/**
 * Check authentication and redirect if needed
 * Call this on protected pages
 */
function checkAuth() {
  const token = getAuthToken();
  const user = getAuthUser();
  
  if (!token || !user) {
    // Not authenticated, redirect to login
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  
  return user;
}

/**
 * Handle OAuth callback
 * Call this on the callback page after OAuth redirect
 */
function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const error = urlParams.get('error');
  
  if (error) {
    showToast('Authentication failed: ' + error, 'error');
    return false;
  }
  
  if (token) {
    // In a real implementation, you'd also get user info from the API
    // For now, we'll decode the token or make an API call
    fetchUserInfo(token);
    return true;
  }
  
  return false;
}

/**
 * Fetch user information after successful OAuth
 */
async function fetchUserInfo(token) {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const user = await response.json();
      storeAuth(token, user);
      
      // Redirect to intended page or dashboard
      const redirect = getQueryParam('redirect') || '/dashboard.html';
      window.location.href = redirect;
    } else {
      showToast('Failed to fetch user information', 'error');
      clearAuth();
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    showToast('Authentication error', 'error');
    clearAuth();
  }
}

/**
 * Validate email domain
 */
function validateLICTEmail(email) {
  return email.endsWith('@lict.edu.np');
}

/**
 * Refresh authentication token
 */
async function refreshAuthToken() {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const user = getAuthUser();
      storeAuth(data.token, user);
      return data.token;
    } else {
      // Token refresh failed, user needs to login again
      clearAuth();
      window.location.href = '/login.html';
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

/**
 * Check token expiration
 * This is a simple check - in production, you'd decode the JWT
 */
function isTokenExpired() {
  // Simple implementation - you'd want to decode JWT and check exp claim
  const token = getAuthToken();
  if (!token) return true;
  
  // For now, assume token doesn't expire
  // In production, implement proper JWT decoding
  return false;
}

// Set up logout button listeners on page load
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to logout?')) {
        logout();
      }
    });
  }
});

// Auto-refresh token before expiration (every 30 minutes)
if (isAuthenticated()) {
  setInterval(async () => {
    if (isTokenExpired()) {
      await refreshAuthToken();
    }
  }, 30 * 60 * 1000); // 30 minutes
}