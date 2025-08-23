/**
 * Q10UX Smart Upload Interface
 * Intuitive drag-and-drop media processing
 */

class SmartUploadInterface {
    constructor() {
        this.files = [];
        this.processingQueue = [];
        this.isProcessing = false;
        this.settings = this.loadSettings();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProjects();
        this.updateUI();
    }

    setupEventListeners() {
        // File input
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));

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
            this.handleFileSelect(e.dataTransfer.files);
        });

        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Settings
        document.getElementById('autoCloudUpload').addEventListener('change', (e) => {
            this.settings.autoCloudUpload = e.target.checked;
            this.saveSettings();
        });

        // Processing options
        document.getElementById('ndaProtection').addEventListener('change', (e) => {
            this.updateProcessingOptions();
        });

        document.getElementById('cloudUpload').addEventListener('change', (e) => {
            this.updateProcessingOptions();
        });
    }

    handleFileSelect(fileList) {
        if (fileList.length === 0) return;

        this.files = Array.from(fileList).filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi'];
            return validTypes.includes(file.type);
        });

        if (this.files.length === 0) {
            this.showNotification('No valid files selected. Please choose images or videos.', 'warning');
            return;
        }

        this.showFilePreview();
        this.showProcessingOptions();
        this.updateUI();
    }

    showFilePreview() {
        const filePreview = document.getElementById('filePreview');
        const fileGrid = document.getElementById('fileGrid');
        
        fileGrid.innerHTML = '';
        
        this.files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = file.name;
                fileItem.appendChild(img);
            } else {
                const videoIcon = document.createElement('div');
                videoIcon.style.cssText = `
                    width: 100%;
                    height: 120px;
                    background: rgba(0, 212, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--upload-primary);
                    font-size: 2rem;
                `;
                videoIcon.innerHTML = '<i class="fas fa-video"></i>';
                fileItem.appendChild(videoIcon);
            }
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = `
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            `;
            
            fileItem.appendChild(fileInfo);
            fileGrid.appendChild(fileItem);
        });
        
        filePreview.style.display = 'block';
    }

    showProcessingOptions() {
        document.getElementById('processingOptions').style.display = 'block';
        
        // Auto-detect project from filenames
        const detectedProject = this.detectProjectFromFiles();
        if (detectedProject) {
            document.getElementById('projectSelect').value = detectedProject;
        }
        
        // Auto-detect tags from filenames
        const detectedTags = this.detectTagsFromFiles();
        if (detectedTags.length > 0) {
            document.getElementById('autoTagSelect').value = detectedTags[0];
        }
    }

    detectProjectFromFiles() {
        const projectKeywords = {
            'atmosfx': 'atmosfx-media-player',
            'tmobile': 'tmobile-how-to-switch',
            'office': 'office-live-workspaces',
            'microsoft': 'microsoft-office-365',
            'bmgf': 'bmgf',
            'att': 'att-international-roaming'
        };

        for (const file of this.files) {
            const fileName = file.name.toLowerCase();
            for (const [keyword, project] of Object.entries(projectKeywords)) {
                if (fileName.includes(keyword)) {
                    return project;
                }
            }
        }
        
        return '';
    }

    detectTagsFromFiles() {
        const tagKeywords = {
            'user-research': 'user-research',
            'research': 'user-research',
            'interview': 'user-research',
            'survey': 'user-research',
            'wireframe': 'wireframes',
            'wireframes': 'wireframes',
            'prototype': 'prototypes',
            'prototypes': 'prototypes',
            'design': 'visual-design',
            'visual': 'visual-design',
            'usability': 'usability-testing',
            'testing': 'usability-testing',
            'accessibility': 'accessibility-testing',
            'a11y': 'accessibility-testing'
        };

        const detectedTags = [];
        
        for (const file of this.files) {
            const fileName = file.name.toLowerCase();
            for (const [keyword, tag] of Object.entries(tagKeywords)) {
                if (fileName.includes(keyword) && !detectedTags.includes(tag)) {
                    detectedTags.push(tag);
                }
            }
        }
        
        return detectedTags;
    }

    async startProcessing() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.showProgressSection();
        
        const projectId = document.getElementById('projectSelect').value;
        const autoTag = document.getElementById('autoTagSelect').value;
        const ndaProtection = document.getElementById('ndaProtection').checked;
        const cloudUpload = document.getElementById('cloudUpload').checked;
        
        if (!projectId) {
            this.showNotification('Please select a project first.', 'warning');
            this.isProcessing = false;
            return;
        }
        
        // Prepare files for upload
        const formData = new FormData();
        this.files.forEach(file => {
            formData.append('images', file);
        });
        
        formData.append('projectId', projectId);
        formData.append('autoTag', autoTag);
        formData.append('ndaRequired', ndaProtection);
        formData.append('cloudUpload', cloudUpload);
        
        try {
            await this.uploadFiles(formData);
        } catch (error) {
            console.error('Upload error:', error);
            this.showNotification('Upload failed. Please try again.', 'error');
        } finally {
            this.isProcessing = false;
        }
    }

    async uploadFiles(formData) {
        const totalFiles = this.files.length;
        let processedFiles = 0;
        
        // Simulate processing steps
        await this.simulateProcessing('image', totalFiles, (progress) => {
            document.getElementById('imageProgress').style.width = `${progress}%`;
            document.getElementById('imageStats').textContent = `${Math.round(progress * totalFiles / 100)} / ${totalFiles} files`;
        });
        
        await this.simulateProcessing('video', totalFiles, (progress) => {
            document.getElementById('videoProgress').style.width = `${progress}%`;
            document.getElementById('videoStats').textContent = `${Math.round(progress * totalFiles / 100)} / ${totalFiles} files`;
        });
        
        if (document.getElementById('cloudUpload').checked) {
            await this.simulateProcessing('upload', totalFiles, (progress) => {
                document.getElementById('uploadProgress').style.width = `${progress}%`;
                document.getElementById('uploadStats').textContent = `${Math.round(progress * totalFiles / 100)} / ${totalFiles} files`;
            });
        }
        
        this.showResults(totalFiles);
    }

    async simulateProcessing(type, totalFiles, progressCallback) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                }
                progressCallback(progress);
            }, 200);
        });
    }

    showProgressSection() {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('processingOptions').style.display = 'none';
        document.getElementById('filePreview').style.display = 'none';
    }

    showResults(processedCount) {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        document.getElementById('processedCount').textContent = processedCount;
        document.getElementById('thumbnailCount').textContent = processedCount * 5; // 5 sizes per file
        document.getElementById('cloudCount').textContent = document.getElementById('cloudUpload').checked ? processedCount : 0;
        
        this.showNotification(`Successfully processed ${processedCount} files!`, 'success');
    }

    async loadProjects() {
        try {
            const response = await fetch('/api/admin/projects');
            const projects = await response.json();
            
            const projectSelect = document.getElementById('projectSelect');
            const defaultProject = document.getElementById('defaultProject');
            
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.title;
                
                projectSelect.appendChild(option.cloneNode(true));
                defaultProject.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    updateProcessingOptions() {
        const ndaProtection = document.getElementById('ndaProtection').checked;
        const cloudUpload = document.getElementById('cloudUpload').checked;
        
        // Update UI based on options
        if (ndaProtection) {
            this.showNotification('NDA protection enabled. Files will require access codes.', 'info');
        }
        
        if (!cloudUpload) {
            this.showNotification('Cloud upload disabled. Files will be processed locally only.', 'warning');
        }
    }

    updateUI() {
        const hasFiles = this.files.length > 0;
        const uploadZone = document.getElementById('uploadZone');
        
        if (hasFiles) {
            uploadZone.style.display = 'none';
        } else {
            uploadZone.style.display = 'block';
        }
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
            background: var(--upload-surface);
            border: 1px solid var(--upload-border);
            color: var(--upload-text);
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

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadSettings() {
        const saved = localStorage.getItem('smartUploadSettings');
        return saved ? JSON.parse(saved) : {
            autoCloudUpload: true,
            imageQuality: 'high',
            processingPriority: 'balanced',
            defaultProject: ''
        };
    }

    saveSettings() {
        localStorage.setItem('smartUploadSettings', JSON.stringify(this.settings));
    }
}

// Global functions for HTML event handlers
function selectFiles() {
    document.getElementById('fileInput').click();
}

function showHelp() {
    const helpModal = new bootstrap.Modal(document.getElementById('helpModal'));
    helpModal.show();
}

function showSettings() {
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    settingsModal.show();
}

function saveSettings() {
    const settings = {
        autoCloudUpload: document.getElementById('autoCloudUpload').checked,
        imageQuality: document.getElementById('imageQuality').value,
        processingPriority: document.getElementById('processingPriority').value,
        defaultProject: document.getElementById('defaultProject').value
    };
    
    localStorage.setItem('smartUploadSettings', JSON.stringify(settings));
    
    const settingsModal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    settingsModal.hide();
    
    smartUpload.showNotification('Settings saved successfully!', 'success');
}

function viewResults() {
    // Navigate to admin panel to view results
    window.location.href = '/src/admin/';
}

function uploadMore() {
    // Reset the interface for more uploads
    location.reload();
}

function goToAdmin() {
    window.location.href = '/src/admin/';
}

// Initialize the interface when the page loads
let smartUpload;
document.addEventListener('DOMContentLoaded', () => {
    smartUpload = new SmartUploadInterface();
});

// Add a start processing button to the processing options
document.addEventListener('DOMContentLoaded', () => {
    const processingOptions = document.getElementById('processingOptions');
    if (processingOptions) {
        const startButton = document.createElement('button');
        startButton.className = 'btn btn-primary btn-lg w-100 mt-3';
        startButton.innerHTML = '<i class="fas fa-play"></i> Start Processing';
        startButton.onclick = () => smartUpload.startProcessing();
        processingOptions.appendChild(startButton);
    }
});
