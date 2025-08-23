/**
 * Q10UX Instant Upload - Zero Configuration
 * Just drop files and everything happens automatically!
 */

class InstantUpload {
    constructor() {
        this.files = [];
        this.isProcessing = false;
        this.isCancelled = false;
        this.currentUploadController = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File input with enhanced error handling
        const fileInput = document.getElementById('fileInput');
        
        fileInput.addEventListener('change', (e) => {
            console.log('🔥 File input change event triggered!');
            console.log('Files selected:', e.target.files);
            console.log('Files count:', e.target.files ? e.target.files.length : 0);
            
            if (e.target.files && e.target.files.length > 0) {
                console.log('✅ Files found, processing...');
                
                // Show immediate feedback
                this.showFileStatus(`Selected ${e.target.files.length} file(s)!`);
                
                // Show feature status updates
                this.updateFeatureStatus('detection', 'active', 'Detecting projects & tags...');
                
                // Process files
                this.handleFiles(e.target.files);
            } else {
                console.log('❌ No files selected or files array is empty');
                this.showNotification('No files were selected. Please try again.', 'warning');
            }
        });
        
        // Add input event listener as backup
        fileInput.addEventListener('input', (e) => {
            console.log('🔄 File input "input" event triggered!');
            console.log('Input files:', e.target.files);
        });

        // Drag and drop
        const uploadZone = document.getElementById('uploadZone');
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            console.log('Files dropped:', e.dataTransfer.files);
            this.handleFiles(e.dataTransfer.files);
        });

        // Click to upload with better handling
        uploadZone.addEventListener('click', (e) => {
            // Prevent triggering if clicking on child elements
            if (e.target.closest('.upload-content') || e.target.closest('button')) {
                return;
            }
            
            console.log('Upload zone clicked, triggering file input');
            fileInput.click();
        });

        // Add click handler for the browse button specifically
        const browseButton = document.getElementById('browseButton');
        if (browseButton) {
            browseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🖱️ Browse button clicked!');
                console.log('About to trigger file input click...');
                fileInput.click();
                console.log('File input click() called');
            });
        } else {
            console.error('❌ Browse button not found!');
        }

        // Keyboard accessibility for upload zone
        uploadZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });

        // Make upload zone focusable and accessible
        uploadZone.setAttribute('tabindex', '0');
        uploadZone.setAttribute('role', 'button');
        uploadZone.setAttribute('aria-label', 'Click or press Enter to select files for upload');

        // Add event listeners for dynamically created buttons
        this.setupDynamicEventListeners();
    }

    setupDynamicEventListeners() {
        // Use event delegation for dynamically created elements
        document.addEventListener('click', (e) => {
            if (e.target.id === 'startUploadBtn' || e.target.closest('#startUploadBtn')) {
                e.preventDefault();
                if (this.startProcessing) {
                    this.startProcessing();
                }
            }
            
            if (e.target.id === 'cancelUploadBtn' || e.target.closest('#cancelUploadBtn')) {
                e.preventDefault();
                this.cancelUpload();
            }
        });

        // Keyboard support for dynamic buttons and escape key
        document.addEventListener('keydown', (e) => {
            // Escape key to cancel/exit
            if (e.key === 'Escape') {
                e.preventDefault();
                if (this.files.length > 0) {
                    this.cancelUpload();
                }
            }
        });
    }

    handleFiles(fileList) {
        if (fileList.length === 0) return;

        // Update detection status
        this.updateFeatureStatus('detection', 'success', `Detected ${fileList.length} files`);

        // Simple file processing
        this.files = Array.from(fileList);

        if (this.files.length === 0) {
            this.showNotification('No valid files found. Please choose images, videos, or design files.', 'warning');
            this.updateFeatureStatus('detection', 'error', 'No valid files found');
            return;
        }

        // Update processing status
        this.updateFeatureStatus('processing', 'active', 'Processing files...');

        // Calculate and display file size information
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const sizeInfo = this.formatFileSize(totalSize);
        
        // Update processing status to success
        this.updateFeatureStatus('processing', 'success', `Processed ${this.files.length} files`);
        
        // Update portfolio status
        this.updateFeatureStatus('portfolio', 'active', 'Preparing for portfolio...');
        
        this.showFilePreview();
        this.showNotification(`Found ${this.files.length} files (${sizeInfo}) ready to upload`, 'info');
        
        // Final portfolio status
        setTimeout(() => {
            this.updateFeatureStatus('portfolio', 'success', 'Ready for portfolio!');
        }, 1000);
    }

    showFilePreview() {
        const uploadZone = document.getElementById('uploadZone');
        const twoPanelLayout = document.getElementById('twoPanelLayout');
        
        // Hide upload zone and show two-panel layout
        uploadZone.style.display = 'none';
        twoPanelLayout.style.display = 'grid';
        
        // Populate left panel with file details
        this.populateFileDetails();
        
        // Populate right panel with file preview
        this.populateFilePreview();
    }
    
    populateFileDetails() {
        const fileDetails = document.getElementById('fileDetails');
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        
        let detailsHTML = `
            <div class="file-detail-item">
                <div class="file-info">
                    <i class="fas fa-folder-open file-icon"></i>
                    <span class="file-name">Total Files</span>
                </div>
                <span class="file-size">${this.files.length} files</span>
            </div>
            <div class="file-detail-item">
                <div class="file-info">
                    <i class="fas fa-weight-hanging file-icon"></i>
                    <span class="file-name">Total Size</span>
                </div>
                <span class="file-size">${this.formatFileSize(totalSize)}</span>
            </div>
        `;
        
        // Add individual file details
        this.files.forEach((file, index) => {
            const fileIcon = this.getFileIcon(file.type);
            detailsHTML += `
                <div class="file-detail-item">
                    <div class="file-info">
                        <i class="${fileIcon} file-icon"></i>
                        <span class="file-name">${file.name}</span>
                    </div>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                </div>
            `;
        });
        
        fileDetails.innerHTML = detailsHTML;
    }
    
    populateFilePreview() {
        const filePreview = document.getElementById('filePreview');
        
        if (this.files.length === 0) {
            filePreview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-image"></i>
                    <span>No files to preview</span>
                </div>
            `;
            return;
        }
        
        // Show the first file as preview
        const firstFile = this.files[0];
        
        if (firstFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreview.innerHTML = `
                    <div class="preview-content">
                        <img src="${e.target.result}" alt="${firstFile.name}" />
                    </div>
                `;
            };
            reader.readAsDataURL(firstFile);
        } else if (firstFile.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreview.innerHTML = `
                    <div class="preview-content">
                        <video controls>
                            <source src="${e.target.result}" type="${firstFile.type}">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            };
            reader.readAsDataURL(firstFile);
        } else {
            // For other file types, show a placeholder
            filePreview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="${this.getFileIcon(firstFile.type)}"></i>
                    <span>${firstFile.name}</span>
                    <small>${this.formatFileSize(firstFile.size)}</small>
                </div>
            `;
        }
    }
    
    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'fas fa-image';
        if (fileType.startsWith('video/')) return 'fas fa-video';
        if (fileType === 'application/pdf') return 'fas fa-file-pdf';
        if (fileType.includes('word')) return 'fas fa-file-word';
        if (fileType.includes('photoshop') || fileType.includes('psd')) return 'fas fa-file-image';
        if (fileType.includes('illustrator') || fileType.includes('ai')) return 'fas fa-file-image';
        if (fileType.includes('indesign') || fileType.includes('indd')) return 'fas fa-file-image';
        if (fileType.includes('figma')) return 'fas fa-file-image';
        if (fileType.includes('sketch')) return 'fas fa-file-image';
        if (fileType.includes('zip') || fileType.includes('rar')) return 'fas fa-file-archive';
        return 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            background: var(--instant-surface);
            border: 1px solid var(--instant-border);
            color: var(--instant-text);
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showFileStatus(message) {
        const fileStatus = document.getElementById('fileStatus');
        const fileStatusText = document.getElementById('fileStatusText');
        
        if (fileStatus && fileStatusText) {
            fileStatusText.textContent = message;
            fileStatus.style.display = 'block';
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                fileStatus.style.display = 'none';
            }, 3000);
        }
    }

    updateFeatureStatus(feature, status, message = '') {
        const statusElement = document.getElementById(`${feature}Status`);
        if (!statusElement) return;
        
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');
        
        // Remove existing status classes
        statusElement.classList.remove('active', 'success', 'error');
        
        switch (status) {
            case 'active':
                statusElement.classList.add('active');
                icon.className = 'fas fa-spinner fa-spin';
                if (message) text.textContent = message;
                break;
            case 'success':
                statusElement.classList.add('success');
                icon.className = 'fas fa-check';
                if (message) text.textContent = message;
                break;
            case 'error':
                statusElement.classList.add('error');
                icon.className = 'fas fa-exclamation-triangle';
                if (message) text.textContent = message;
                break;
            default:
                // Reset to default state
                if (feature === 'detection') {
                    icon.className = 'fas fa-magic';
                    text.textContent = 'Auto-detect project & tags';
                } else if (feature === 'processing') {
                    icon.className = 'fas fa-cogs';
                    text.textContent = 'Auto-process & optimize';
                } else if (feature === 'portfolio') {
                    icon.className = 'fas fa-check';
                    text.textContent = 'Ready for portfolio';
                }
        }
    }

    cancelUpload() {
        this.isCancelled = true;
        this.isProcessing = false;
        
        this.showNotification('Upload cancelled', 'warning');
        this.resetUpload();
    }

    resetUpload() {
        this.isProcessing = false;
        this.files = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('uploadZone').style.display = 'flex';
        document.getElementById('twoPanelLayout').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        
        // Reset feature status
        this.updateFeatureStatus('detection', 'default');
        this.updateFeatureStatus('processing', 'default');
        this.updateFeatureStatus('portfolio', 'default');
        
        // Hide file status
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.style.display = 'none';
        }
    }

    async startProcessing() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.isCancelled = false;
        
        this.showNotification('Upload started!', 'info');
        
        // Simple simulation for now
        setTimeout(() => {
            this.showNotification('Upload completed successfully!', 'success');
            this.resetUpload();
        }, 2000);
    }
}

// Global functions for HTML event handlers
function selectFiles() {
    console.log('selectFiles() called');
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        console.log('File input found, clicking...');
        fileInput.click();
    } else {
        console.error('File input not found!');
    }
}

// Fallback function for browse button
function browseFiles() {
    console.log('browseFiles() called');
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        console.log('File input found, clicking...');
        fileInput.click();
    } else {
        console.error('File input not found!');
    }
}

function uploadMore() {
    // Reset the interface for more uploads
    if (instantUpload) {
        instantUpload.resetUpload();
    }
}

function viewPortfolio() {
    // Navigate to the main portfolio
    window.location.href = '/src/';
}

// Initialize the interface when the page loads
let instantUpload;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing InstantUpload...');
    instantUpload = new InstantUpload();
    console.log('InstantUpload initialized:', instantUpload);
    
    // Test file input
    const fileInput = document.getElementById('fileInput');
    console.log('File input element:', fileInput);
});
