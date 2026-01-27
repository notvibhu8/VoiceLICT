// VoiceLICT - API Client Module

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Build request options
  const requestOptions = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, requestOptions);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid
      clearAuth();
      window.location.href = '/login.html';
      throw new Error('Authentication required');
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET request
 */
async function apiGet(endpoint) {
  return apiRequest(endpoint, {
    method: 'GET'
  });
}

/**
 * POST request
 */
async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT request
 */
async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE request
 */
async function apiDelete(endpoint) {
  return apiRequest(endpoint, {
    method: 'DELETE'
  });
}

/**
 * Upload file to server
 */
async function uploadFile(file) {
  const token = getAuthToken();
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('File upload failed');
  }
  
  const data = await response.json();
  return data.url;
}

/**
 * Upload multiple files
 */
async function uploadMultipleFiles(files) {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

/**
 * Create submission
 */
async function createSubmission(submissionData) {
  return apiPost('/submissions', submissionData);
}

/**
 * Get user's submissions
 */
async function getMySubmissions() {
  const response = await apiGet('/submissions/me');
  return response.json();
}

/**
 * Get submission by ID
 */
async function getSubmission(id) {
  const response = await apiGet(`/submissions/${id}`);
  return response.json();
}

/**
 * Delete submission
 */
async function deleteSubmission(id) {
  return apiDelete(`/submissions/${id}`);
}

/**
 * Get trending issues
 */
async function getTrendingIssues() {
  const response = await apiGet('/clusters/trending');
  return response.json();
}

/**
 * Get all clusters
 */
async function getAllClusters(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = queryString ? `/clusters?${queryString}` : '/clusters';
  const response = await apiGet(endpoint);
  return response.json();
}

/**
 * Get cluster by ID
 */
async function getCluster(id) {
  const response = await apiGet(`/clusters/${id}`);
  return response.json();
}

/**
 * Search submissions
 */
async function searchSubmissions(query) {
  const response = await apiGet(`/submissions/search?q=${encodeURIComponent(query)}`);
  return response.json();
}

/**
 * Get user profile
 */
async function getUserProfile() {
  const response = await apiGet('/auth/me');
  return response.json();
}

/**
 * Update user profile
 */
async function updateUserProfile(profileData) {
  return apiPut('/auth/me', profileData);
}

/**
 * Handle API errors
 */
function handleApiError(error, fallbackMessage = 'An error occurred') {
  console.error('API Error:', error);
  
  if (error.message === 'Authentication required') {
    showToast('Please login to continue', 'error');
    return;
  }
  
  if (error.message === 'Network request failed') {
    showToast('Network error. Please check your connection.', 'error');
    return;
  }
  
  showToast(fallbackMessage, 'error');
}

/**
 * Retry failed requests
 */
async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}