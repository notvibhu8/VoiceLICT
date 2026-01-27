// VoiceLICT - File Upload Module

let uploadedFiles = [];

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
  const uploadArea = document.getElementById('fileUploadArea');
  const fileInput = document.getElementById('fileInput');
  const previewList = document.getElementById('filePreviewList');
  
  if (!uploadArea || !fileInput) return;
  
  // Click to upload
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // File input change
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
}

/**
 * Handle selected files
 */
function handleFiles(files) {
  Array.from(files).forEach(file => {
    // Validate file type
    const typeValidation = validateFileType(file);
    if (!typeValidation.valid) {
      showToast(`Invalid file type: ${file.name}`, 'error');
      return;
    }
    
    // Validate file size
    if (!validateFileSize(file, typeValidation.type)) {
      const maxSizes = {
        image: '5MB',
        video: '50MB',
        audio: '10MB'
      };
      showToast(`File too large: ${file.name} (max ${maxSizes[typeValidation.type]})`, 'error');
      return;
    }
    
    // Add to uploaded files
    uploadedFiles.push({
      file: file,
      type: typeValidation.type,
      preview: null
    });
    
    // Create preview
    createFilePreview(file, typeValidation.type);
  });
}

/**
 * Create file preview
 */
function createFilePreview(file, type) {
  const previewList = document.getElementById('filePreviewList');
  const previewItem = document.createElement('div');
  previewItem.className = 'file-preview-item';
  previewItem.dataset.filename = file.name;
  
  if (type === 'image') {
    // Image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewItem.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}" class="file-preview-img">
        <div class="file-preview-name">${file.name}</div>
        <button class="file-remove-btn" aria-label="Remove file">×</button>
      `;
      
      // Add remove button listener
      previewItem.querySelector('.file-remove-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        removeFile(file.name);
      });
    };
    reader.readAsDataURL(file);
  } else if (type === 'video') {
    // Video preview
    previewItem.innerHTML = `
      <div style="width: 100%; height: 120px; background: var(--gray-800); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
        🎥
      </div>
      <div class="file-preview-name">${file.name}</div>
      <button class="file-remove-btn" aria-label="Remove file">×</button>
    `;
    
    previewItem.querySelector('.file-remove-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      removeFile(file.name);
    });
  } else if (type === 'audio') {
    // Audio preview
    previewItem.innerHTML = `
      <div style="width: 100%; height: 120px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
        🎵
      </div>
      <div class="file-preview-name">${file.name}</div>
      <button class="file-remove-btn" aria-label="Remove file">×</button>
    `;
    
    previewItem.querySelector('.file-remove-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      removeFile(file.name);
    });
  }
  
  previewList.appendChild(previewItem);
}

/**
 * Remove file from upload list
 */
function removeFile(filename) {
  // Remove from uploadedFiles array
  uploadedFiles = uploadedFiles.filter(item => item.file.name !== filename);
  
  // Remove preview element
  const previewList = document.getElementById('filePreviewList');
  const previewItem = previewList.querySelector(`[data-filename="${filename}"]`);
  if (previewItem) {
    previewItem.remove();
  }
  
  showToast('File removed', 'info');
}

/**
 * Upload all files to server
 */
async function uploadFiles() {
  if (uploadedFiles.length === 0) {
    return [];
  }
  
  const fileUrls = [];
  
  try {
    for (const item of uploadedFiles) {
      const url = await uploadFile(item.file);
      fileUrls.push(url);
    }
    
    return fileUrls;
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload files');
  }
}

/**
 * Clear all uploaded files
 */
function clearUploadedFiles() {
  uploadedFiles = [];
  const previewList = document.getElementById('filePreviewList');
  if (previewList) {
    previewList.innerHTML = '';
  }
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.value = '';
  }
}

/**
 * Get file icon based on type
 */
function getFileIcon(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  
  const icons = {
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    mp4: '🎥',
    mov: '🎥',
    avi: '🎥',
    mp3: '🎵',
    wav: '🎵',
    m4a: '🎵',
    pdf: '📄',
    doc: '📄',
    docx: '📄',
    txt: '📄'
  };
  
  return icons[extension] || '📎';
}

/**
 * Show upload progress
 */
function showUploadProgress(filename, progress) {
  const previewItem = document.querySelector(`[data-filename="${filename}"]`);
  if (!previewItem) return;
  
  let progressBar = previewItem.querySelector('.upload-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'upload-progress';
    progressBar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gray-200);
      overflow: hidden;
    `;
    
    const progressFill = document.createElement('div');
    progressFill.className = 'upload-progress-fill';
    progressFill.style.cssText = `
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
      width: 0%;
    `;
    
    progressBar.appendChild(progressFill);
    previewItem.appendChild(progressBar);
  }
  
  const progressFill = progressBar.querySelector('.upload-progress-fill');
  progressFill.style.width = `${progress}%`;
  
  if (progress >= 100) {
    setTimeout(() => {
      progressBar.remove();
    }, 500);
  }
}

/**
 * Validate total upload size
 */
function validateTotalSize() {
  const totalSize = uploadedFiles.reduce((sum, item) => sum + item.file.size, 0);
  const maxTotalSize = 100 * 1024 * 1024; // 100MB total
  
  if (totalSize > maxTotalSize) {
    showToast('Total file size exceeds 100MB limit', 'error');
    return false;
  }
  
  return true;
}

/**
 * Get uploaded files info
 */
function getUploadedFilesInfo() {
  return uploadedFiles.map(item => ({
    name: item.file.name,
    size: item.file.size,
    type: item.type,
    mimeType: item.file.type
  }));
}

// Initialize upload on page load
document.addEventListener('DOMContentLoaded', () => {
  initFileUpload();
});