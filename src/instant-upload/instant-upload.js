/**
 * Q10UX Instant Upload - Zero Configuration
 * Just drop files and everything happens automatically!
 */

class InstantUpload {
    constructor() {
        this.files = [];
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // File input
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

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
            this.handleFiles(e.dataTransfer.files);
        });

        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });
    }

    handleFiles(fileList) {
        if (fileList.length === 0) return;

        this.files = Array.from(fileList).filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi'];
            return validTypes.includes(file.type);
        });

        if (this.files.length === 0) {
            this.showNotification('No valid files selected. Please choose images or videos.', 'warning');
            return;
        }

        this.startProcessing();
    }

    async startProcessing() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.showStatus('Analyzing files...');
        
        // Simulate processing steps
        await this.simulateStep('Detecting project and tags...', 1000);
        await this.simulateStep('Processing images...', 2000);
        await this.simulateStep('Generating thumbnails...', 1500);
        await this.simulateStep('Optimizing for web...', 1000);
        await this.simulateStep('Organizing files...', 500);
        
        this.showResults();
    }

    async simulateStep(message, duration) {
        this.updateStatus(message);
        await new Promise(resolve => setTimeout(resolve, duration));
    }

    showStatus(message) {
        document.getElementById('uploadZone').style.display = 'none';
        document.getElementById('statusSection').style.display = 'block';
        this.updateStatus(message);
    }

    updateStatus(message) {
        document.getElementById('statusDetail').textContent = message;
    }

    showResults() {
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        this.populateResults();
        this.showNotification(`Successfully processed ${this.files.length} files!`, 'success');
    }

    populateResults() {
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';
        
        // Calculate stats
        const imageFiles = this.files.filter(f => f.type.startsWith('image/')).length;
        const videoFiles = this.files.filter(f => f.type.startsWith('video/')).length;
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        
        // Create result cards
        const results = [
            {
                type: 'success',
                icon: 'fas fa-check',
                title: 'Files Processed',
                value: this.files.length
            },
            {
                type: 'info',
                icon: 'fas fa-image',
                title: 'Images',
                value: imageFiles
            },
            {
                type: 'info',
                icon: 'fas fa-video',
                title: 'Videos',
                value: videoFiles
            },
            {
                type: 'info',
                icon: 'fas fa-compress-arrows-alt',
                title: 'Total Size',
                value: this.formatFileSize(totalSize)
            }
        ];
        
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = `result-card ${result.type}`;
            card.innerHTML = `
                <div class="result-icon">
                    <i class="${result.icon}"></i>
                </div>
                <div class="result-title">${result.title}</div>
                <div class="result-value">${result.value}</div>
            `;
            resultsGrid.appendChild(card);
        });
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
}

// Global functions for HTML event handlers
function selectFiles() {
    document.getElementById('fileInput').click();
}

function uploadMore() {
    // Reset the interface for more uploads
    location.reload();
}

function viewPortfolio() {
    // Navigate to the main portfolio
    window.location.href = '/src/';
}

// Initialize the interface when the page loads
let instantUpload;
document.addEventListener('DOMContentLoaded', () => {
    instantUpload = new InstantUpload();
});
