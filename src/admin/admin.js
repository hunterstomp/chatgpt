class Q10UXAdmin {
    constructor() {
        this.apiBase = 'http://localhost:3001/api';
        this.token = localStorage.getItem('adminToken');
        this.currentProject = null;
        this.selectedFiles = [];
        this.selectedImages = new Set();
        this.uxDeliverables = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
        this.loadUXDeliverables();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Project form
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createProject();
        });

        // File input
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // Upload zone drag and drop
        const uploadZone = document.getElementById('uploadZone');
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFileSelection(e.dataTransfer.files);
        });

        // Auto-generate slug from title
        document.getElementById('projectTitle').addEventListener('input', (e) => {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            document.getElementById('projectSlug').value = slug;
        });

        // NDA required toggle
        document.getElementById('ndaRequired').addEventListener('change', (e) => {
            const ndaCodeSection = document.getElementById('ndaCodeSection');
            if (e.target.value === 'true') {
                ndaCodeSection.style.display = 'block';
            } else {
                ndaCodeSection.style.display = 'none';
            }
        });

        // Bulk tag selection change
        document.getElementById('bulkTag').addEventListener('change', (e) => {
            const uploadFlow = document.getElementById('uploadFlow');
            if (e.target.value) {
                uploadFlow.disabled = true;
                uploadFlow.parentElement.style.opacity = '0.5';
            } else {
                uploadFlow.disabled = false;
                uploadFlow.parentElement.style.opacity = '1';
            }
        });
    }

    async loadUXDeliverables() {
        try {
            const response = await fetch(`${this.apiBase}/admin/ux-deliverables`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            if (response.ok) {
                this.uxDeliverables = await response.json();
            }
        } catch (error) {
            console.error('Failed to load UX deliverables:', error);
        }
    }

    async checkAuth() {
        if (this.token) {
            try {
                // Verify token is still valid
                const response = await fetch(`${this.apiBase}/admin/projects`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    this.showDashboard();
                    this.loadProjects();
                } else {
                    this.showLogin();
                }
            } catch (error) {
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.apiBase}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('adminToken', this.token);
                this.showDashboard();
                this.loadProjects();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Connection error', 'error');
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('adminToken');
        this.showLogin();
        this.showNotification('Logged out successfully', 'success');
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    }

    async loadProjects() {
        try {
            const response = await fetch(`${this.apiBase}/admin/projects`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const projects = await response.json();
                this.renderProjects(projects);
                this.populateProjectSelect(projects);
                this.populateBulkTagProjectSelect(projects);
            }
        } catch (error) {
            this.showNotification('Failed to load projects', 'error');
        }
    }

    renderProjects(projects) {
        const container = document.getElementById('projectsContainer');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                        <h4>No case studies yet</h4>
                        <p class="text-muted">Create your first case study to get started</p>
                        <button class="btn btn-primary" onclick="showCreateProject()">
                            <i class="fas fa-plus"></i> Create Case Study
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = projects.map(project => `
            <div class="project-card" onclick="admin.viewProject('${project.id}')">
                <h4>
                    ${project.title}
                    ${project.ndaRequired ? '<span class="nda-indicator"><i class="fas fa-shield-alt"></i> NDA</span>' : ''}
                </h4>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span>${new Date(project.updatedAt).toLocaleDateString()}</span>
                    <span class="project-status ${project.status}">${project.status}</span>
                </div>
            </div>
        `).join('');
    }

    populateProjectSelect(projects) {
        const select = document.getElementById('uploadProject');
        select.innerHTML = '<option value="">Choose a case study...</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.title + (project.ndaRequired ? ' (NDA)' : '');
            select.appendChild(option);
        });
    }

    populateBulkTagProjectSelect(projects) {
        const select = document.getElementById('bulkTagProject');
        select.innerHTML = '<option value="">Choose a case study...</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.title + (project.ndaRequired ? ' (NDA)' : '');
            select.appendChild(option);
        });
    }

    async createProject() {
        const formData = {
            title: document.getElementById('projectTitle').value,
            slug: document.getElementById('projectSlug').value,
            description: document.getElementById('projectDescription').value,
            status: document.getElementById('projectStatus').value,
            ndaRequired: document.getElementById('ndaRequired').value === 'true',
            ndaCode: document.getElementById('ndaRequired').value === 'true' ? document.getElementById('ndaCode').value : null,
            flowPrivacy: {}
        };

        try {
            const response = await fetch(`${this.apiBase}/admin/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Case study created successfully!', 'success');
                this.showProjects();
                this.loadProjects();
                document.getElementById('projectForm').reset();
                document.getElementById('ndaCodeSection').style.display = 'none';
            } else {
                this.showNotification(data.error || 'Failed to create project', 'error');
            }
        } catch (error) {
            this.showNotification('Connection error', 'error');
        }
    }

    handleFileSelection(files) {
        this.selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (this.selectedFiles.length > 0) {
            document.getElementById('uploadBtn').disabled = false;
            this.showNotification(`${this.selectedFiles.length} images selected`, 'success');
        } else {
            document.getElementById('uploadBtn').disabled = true;
            this.showNotification('Please select image files only', 'warning');
        }
    }

    async uploadImages() {
        const projectId = document.getElementById('uploadProject').value;
        const flow = document.getElementById('uploadFlow').value;
        const ndaRequired = document.getElementById('uploadNdaRequired').checked;
        const bulkTag = document.getElementById('bulkTag').value;

        if (!projectId) {
            this.showNotification('Please select a case study', 'warning');
            return;
        }

        if (this.selectedFiles.length === 0) {
            this.showNotification('Please select images to upload', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('flow', flow);
        formData.append('ndaRequired', ndaRequired);
        if (bulkTag) {
            formData.append('bulkTag', bulkTag);
        }
        this.selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        // Show progress
        document.getElementById('uploadProgress').style.display = 'block';
        document.getElementById('uploadBtn').disabled = true;

        try {
            const response = await fetch(`${this.apiBase}/admin/projects/${projectId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification(`Uploaded ${data.data.successful.length} images successfully!`, 'success');
                this.selectedFiles = [];
                document.getElementById('fileInput').value = '';
                document.getElementById('uploadBtn').disabled = true;
                document.getElementById('uploadNdaRequired').checked = false;
                document.getElementById('bulkTag').value = '';
                document.getElementById('uploadFlow').disabled = false;
                document.getElementById('uploadFlow').parentElement.style.opacity = '1';
                
                // Update project gallery if viewing it
                if (this.currentProject === projectId) {
                    this.loadProjectGallery(projectId);
                }
            } else {
                this.showNotification(data.error || 'Upload failed', 'error');
            }
        } catch (error) {
            this.showNotification('Upload failed', 'error');
        } finally {
            document.getElementById('uploadProgress').style.display = 'none';
        }
    }

    async viewProject(projectId) {
        this.currentProject = projectId;
        this.showProjectGallery();
        this.loadProjectGallery(projectId);
    }

    async loadProjectGallery(projectId) {
        try {
            const response = await fetch(`${this.apiBase}/admin/projects/${projectId}/images`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderGallery(data);
            }
        } catch (error) {
            this.showNotification('Failed to load gallery', 'error');
        }
    }

    renderGallery(data) {
        const container = document.getElementById('galleryContainer');
        const project = this.getProjectById(data.projectId);
        
        if (project) {
            document.getElementById('galleryTitle').textContent = `${project.title} - Gallery`;
        }

        const flowTitles = {
            research: 'Research & Discovery',
            ideation: 'Ideation & Concepts',
            design: 'Design & Prototyping',
            testing: 'Testing & Validation',
            implementation: 'Implementation & Handoff',
            results: 'Results & Impact',
            screens: 'Additional Screenshots',
            process: 'Process Documentation'
        };

        let html = '';
        
        Object.entries(data.flows).forEach(([flow, images]) => {
            if (images.length > 0) {
                const ndaImages = images.filter(img => img.ndaRequired);
                const publicImages = images.filter(img => !img.ndaRequired);
                
                if (publicImages.length > 0) {
                    html += `
                        <div class="mb-4">
                            <h4 class="mb-3">${flowTitles[flow]} (${publicImages.length})</h4>
                            <div class="gallery-container">
                                ${publicImages.map(image => `
                                    <div class="gallery-item">
                                        <img src="${image.sizes?.thumbnail?.url || image.thumbnail?.url}" alt="${image.altText}" loading="lazy">
                                        <div class="gallery-item-info">
                                            <h5>${image.originalName}</h5>
                                            <p>${image.caption}</p>
                                            <div class="gallery-item-actions">
                                                <button class="btn btn-danger btn-sm" onclick="admin.deleteImage('${image.id}')">
                                                    <i class="fas fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
                
                if (ndaImages.length > 0) {
                    html += `
                        <div class="mb-4">
                            <h4 class="mb-3">
                                ${flowTitles[flow]} - NDA Protected (${ndaImages.length})
                                <span class="nda-indicator"><i class="fas fa-shield-alt"></i> NDA</span>
                            </h4>
                            <div class="gallery-container">
                                ${ndaImages.map(image => `
                                    <div class="gallery-item">
                                        <img src="${image.sizes?.thumbnail?.url || image.thumbnail?.url}" alt="${image.altText}" loading="lazy">
                                        <div class="gallery-item-info">
                                            <h5>${image.originalName}</h5>
                                            <p>${image.caption}</p>
                                            <div class="gallery-item-actions">
                                                <button class="btn btn-danger btn-sm" onclick="admin.deleteImage('${image.id}')">
                                                    <i class="fas fa-trash"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            }
        });

        if (!html) {
            html = `
                <div class="text-center py-5">
                    <i class="fas fa-images fa-3x text-muted mb-3"></i>
                    <h4>No images yet</h4>
                    <p class="text-muted">Upload images to see them here</p>
                    <button class="btn btn-primary" onclick="showUpload()">
                        <i class="fas fa-upload"></i> Upload Images
                    </button>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    async deleteImage(imageId) {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/admin/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.showNotification('Image deleted successfully', 'success');
                if (this.currentProject) {
                    this.loadProjectGallery(this.currentProject);
                }
            } else {
                this.showNotification('Failed to delete image', 'error');
            }
        } catch (error) {
            this.showNotification('Delete failed', 'error');
        }
    }

    async loadNDAStats() {
        try {
            const response = await fetch(`${this.apiBase}/admin/projects`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const projects = await response.json();
                const ndaProjects = projects.filter(p => p.ndaRequired).length;
                
                // Count NDA flows and images (simplified for demo)
                let ndaFlows = 0;
                let ndaImages = 0;
                
                for (const project of projects) {
                    if (project.flowPrivacy) {
                        Object.values(project.flowPrivacy).forEach(fp => {
                            if (fp.ndaRequired) ndaFlows++;
                        });
                    }
                }

                document.getElementById('ndaProjectsCount').textContent = ndaProjects;
                document.getElementById('ndaFlowsCount').textContent = ndaFlows;
                document.getElementById('ndaImagesCount').textContent = ndaImages;
            }
        } catch (error) {
            console.error('Failed to load NDA stats:', error);
        }
    }

    async showFlowPrivacySettings() {
        if (!this.currentProject) {
            this.showNotification('No project selected', 'warning');
            return;
        }

        const flowTitles = {
            research: 'Research & Discovery',
            ideation: 'Ideation & Concepts',
            design: 'Design & Prototyping',
            testing: 'Testing & Validation',
            implementation: 'Implementation & Handoff',
            results: 'Results & Impact',
            screens: 'Additional Screenshots',
            process: 'Process Documentation'
        };

        const container = document.getElementById('flowPrivacySettings');
        container.innerHTML = Object.entries(flowTitles).map(([flow, title]) => `
            <div class="flow-privacy-item">
                <div class="flow-privacy-header">
                    <div class="flow-privacy-title">${title}</div>
                    <div class="flow-privacy-controls">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="flow_${flow}_nda" data-flow="${flow}">
                            <label class="form-check-label" for="flow_${flow}_nda">
                                Require NDA
                            </label>
                        </div>
                    </div>
                </div>
                <p class="flow-privacy-description">
                    When enabled, images in this flow will only be visible to users with valid NDA access.
                </p>
            </div>
        `).join('');

        this.showFlowPrivacy();
    }

    async saveFlowPrivacy() {
        if (!this.currentProject) {
            this.showNotification('No project selected', 'warning');
            return;
        }

        const flowPrivacy = {};
        const checkboxes = document.querySelectorAll('#flowPrivacySettings input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const flow = checkbox.dataset.flow;
            flowPrivacy[flow] = {
                ndaRequired: checkbox.checked
            };
        });

        try {
            const response = await fetch(`${this.apiBase}/admin/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    id: this.currentProject,
                    flowPrivacy: flowPrivacy
                })
            });

            if (response.ok) {
                this.showNotification('Flow privacy settings saved successfully!', 'success');
                this.showProjectGallery();
            } else {
                this.showNotification('Failed to save privacy settings', 'error');
            }
        } catch (error) {
            this.showNotification('Save failed', 'error');
        }
    }

    // Bulk Tagging Methods
    async loadProjectImages() {
        const projectId = document.getElementById('bulkTagProject').value;
        if (!projectId) {
            document.getElementById('imageSelectionSection').style.display = 'none';
            document.getElementById('taggingOptions').style.display = 'none';
            document.getElementById('bulkTagActions').style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/admin/projects/${projectId}/images`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderImageSelectionGrid(data);
                document.getElementById('imageSelectionSection').style.display = 'block';
            }
        } catch (error) {
            this.showNotification('Failed to load project images', 'error');
        }
    }

    renderImageSelectionGrid(data) {
        const container = document.getElementById('imageSelectionGrid');
        const allImages = Object.values(data.flows).flat();
        
        if (allImages.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-images fa-2x text-muted mb-2"></i>
                    <p class="text-muted">No images found in this project</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allImages.map(image => `
            <div class="image-selection-item" data-image-id="${image.id}" onclick="admin.toggleImageSelection('${image.id}')">
                <img src="${image.sizes?.thumbnail?.url || image.thumbnail?.url}" alt="${image.altText}">
                <div class="selection-overlay">
                    <i class="fas fa-check"></i>
                </div>
                <div class="image-info">
                    <h6>${image.originalName}</h6>
                    <p>${image.deliverableName || image.flow}</p>
                </div>
            </div>
        `).join('');

        this.selectedImages.clear();
        this.updateSelectedCount();
    }

    toggleImageSelection(imageId) {
        const item = document.querySelector(`[data-image-id="${imageId}"]`);
        if (this.selectedImages.has(imageId)) {
            this.selectedImages.delete(imageId);
            item.classList.remove('selected');
        } else {
            this.selectedImages.add(imageId);
            item.classList.add('selected');
        }
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const count = this.selectedImages.size;
        document.getElementById('selectedCount').textContent = `${count} images selected`;
        
        if (count > 0) {
            document.getElementById('taggingOptions').style.display = 'block';
            document.getElementById('bulkTagActions').style.display = 'flex';
        } else {
            document.getElementById('taggingOptions').style.display = 'none';
            document.getElementById('bulkTagActions').style.display = 'none';
        }
    }

    selectAllImages() {
        const items = document.querySelectorAll('.image-selection-item');
        items.forEach(item => {
            const imageId = item.dataset.imageId;
            this.selectedImages.add(imageId);
            item.classList.add('selected');
        });
        this.updateSelectedCount();
    }

    deselectAllImages() {
        const items = document.querySelectorAll('.image-selection-item');
        items.forEach(item => {
            const imageId = item.dataset.imageId;
            this.selectedImages.delete(imageId);
            item.classList.remove('selected');
        });
        this.updateSelectedCount();
    }

    async applyBulkTags() {
        const projectId = document.getElementById('bulkTagProject').value;
        const deliverable = document.getElementById('bulkTagDeliverable').value;
        const flow = document.getElementById('bulkTagFlow').value;
        const customTags = document.getElementById('bulkTagCustom').value;

        if (this.selectedImages.size === 0) {
            this.showNotification('Please select images to tag', 'warning');
            return;
        }

        if (!deliverable && !flow) {
            this.showNotification('Please select at least one tagging option', 'warning');
            return;
        }

        const tags = [];
        if (deliverable && this.uxDeliverables[deliverable]) {
            tags.push(...this.uxDeliverables[deliverable].tags);
        }
        if (customTags) {
            tags.push(...customTags.split(',').map(tag => tag.trim()).filter(tag => tag));
        }

        try {
            const response = await fetch(`${this.apiBase}/admin/projects/${projectId}/bulk-tag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    imageIds: Array.from(this.selectedImages),
                    deliverable,
                    tags,
                    flow
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification(`Updated ${data.data.successful.length} images successfully!`, 'success');
                this.selectedImages.clear();
                this.updateSelectedCount();
                
                // Refresh the image selection grid
                this.loadProjectImages();
                
                // Update project gallery if viewing it
                if (this.currentProject === projectId) {
                    this.loadProjectGallery(projectId);
                }
            } else {
                this.showNotification(data.error || 'Bulk tagging failed', 'error');
            }
        } catch (error) {
            this.showNotification('Bulk tagging failed', 'error');
        }
    }

    getProjectById(projectId) {
        // This would need to be implemented with a projects cache
        // For now, return null
        return null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Navigation methods
    showProjects() {
        this.hideAllSections();
        document.getElementById('projectList').style.display = 'block';
    }

    showCreateProject() {
        this.hideAllSections();
        document.getElementById('createProjectForm').style.display = 'block';
    }

    showUpload() {
        this.hideAllSections();
        document.getElementById('uploadInterface').style.display = 'block';
    }

    showProjectGallery() {
        this.hideAllSections();
        document.getElementById('projectGallery').style.display = 'block';
    }

    showNDAManager() {
        this.hideAllSections();
        document.getElementById('ndaManager').style.display = 'block';
        this.loadNDAStats();
    }

    showBulkTagging() {
        this.hideAllSections();
        document.getElementById('bulkTagging').style.display = 'block';
    }

    showFlowPrivacy() {
        this.hideAllSections();
        document.getElementById('flowPrivacy').style.display = 'block';
        this.showFlowPrivacySettings();
    }

    hideAllSections() {
        document.getElementById('projectList').style.display = 'none';
        document.getElementById('createProjectForm').style.display = 'none';
        document.getElementById('uploadInterface').style.display = 'none';
        document.getElementById('projectGallery').style.display = 'none';
        document.getElementById('ndaManager').style.display = 'none';
        document.getElementById('bulkTagging').style.display = 'none';
        document.getElementById('flowPrivacy').style.display = 'none';
    }
}

// Global functions for onclick handlers
function logout() {
    admin.logout();
}

function showCreateProject() {
    admin.showCreateProject();
}

function showProjects() {
    admin.showProjects();
}

function showUpload() {
    admin.showUpload();
}

function showNDAManager() {
    admin.showNDAManager();
}

function showBulkTagging() {
    admin.showBulkTagging();
}

function showFlowPrivacy() {
    admin.showFlowPrivacy();
}

function saveFlowPrivacy() {
    admin.saveFlowPrivacy();
}

function selectFiles() {
    document.getElementById('fileInput').click();
}

function uploadImages() {
    admin.uploadImages();
}

function loadProjectImages() {
    admin.loadProjectImages();
}

function selectAllImages() {
    admin.selectAllImages();
}

function deselectAllImages() {
    admin.deselectAllImages();
}

function applyBulkTags() {
    admin.applyBulkTags();
}

// Initialize admin
const admin = new Q10UXAdmin();
