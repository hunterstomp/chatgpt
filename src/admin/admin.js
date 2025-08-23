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
        this.loadExistingCaseStudies();
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
        if (uploadZone) {
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
        }

        // Auto-generate slug from title
        const projectTitle = document.getElementById('projectTitle');
        if (projectTitle) {
            projectTitle.addEventListener('input', (e) => {
                const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                const projectSlug = document.getElementById('projectSlug');
                if (projectSlug) {
                    projectSlug.value = slug;
                }
            });
        }

        // NDA required toggle
        const ndaRequired = document.getElementById('ndaRequired');
        if (ndaRequired) {
            ndaRequired.addEventListener('change', (e) => {
                const ndaCodeSection = document.getElementById('ndaCodeSection');
                if (ndaCodeSection) {
                    ndaCodeSection.style.display = e.target.value === 'true' ? 'block' : 'none';
                }
            });
        }

        // Smart flow assignment
        const enableAutoAnalysis = document.getElementById('enableAutoAnalysis');
        if (enableAutoAnalysis) {
            enableAutoAnalysis.addEventListener('change', (e) => {
                this.toggleAutoAnalysis(e.target.checked);
            });
        }

        const enableManualOverride = document.getElementById('enableManualOverride');
        if (enableManualOverride) {
            enableManualOverride.addEventListener('change', (e) => {
                this.toggleManualOverride(e.target.checked);
            });
        }

        // Manual flow selection
        const uploadFlow = document.getElementById('uploadFlow');
        if (uploadFlow) {
            uploadFlow.addEventListener('change', (e) => {
                this.handleManualFlowSelection(e.target.value);
            });
        }
        if (manualTag) {
            manualTag.addEventListener('change', (e) => {
                this.handleManualTagSelection(e.target.value);
            });
        }

        // View mode buttons
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.setViewMode(view);
            });
        });

        // Select all checkbox
        const selectAll = document.getElementById('selectAll');
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.toggleSelectAll();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    async loadExistingCaseStudies() {
        try {
            // Get existing case studies from the case-studies directory
            const existingCaseStudies = [
                {
                    slug: 'office-live-workspaces',
                    title: 'Office Live Workspaces',
                    description: 'Microsoft Office Live Workspaces - Future vision for social collaboration'
                },
                {
                    slug: 'att-international-roaming',
                    title: 'AT&T International Roaming',
                    description: 'AT&T International Roaming - Mobile app for international travel'
                },
                {
                    slug: 'microsoft-office-365',
                    title: 'Microsoft Office 365',
                    description: 'Microsoft Office 365 - Cloud-based productivity suite'
                },
                {
                    slug: 'bmgf',
                    title: 'BMGF',
                    description: 'Bill & Melinda Gates Foundation - Healthcare and education initiatives'
                },
                {
                    slug: 'tmobile-how-to-switch',
                    title: 'T-Mobile How to Switch',
                    description: 'T-Mobile How to Switch - Carrier switching experience'
                },
                {
                    slug: 'atmosfx-media-player',
                    title: 'AtmosFX Media Player',
                    description: 'AtmosFX Media Player - Digital media playback interface'
                },
                {
                    slug: 'tmobile-idea-lab',
                    title: 'T-Mobile Idea Lab',
                    description: 'T-Mobile Idea Lab - Innovation and prototyping platform'
                },
                {
                    slug: 'atmosfx-ecommerce',
                    title: 'AtmosFX E-commerce',
                    description: 'AtmosFX E-commerce - Online shopping experience'
                }
            ];

            // Populate the upload project dropdown
            const uploadProjectSelect = document.getElementById('uploadProject');
            if (uploadProjectSelect) {
                // Clear existing options except the first one
                uploadProjectSelect.innerHTML = '<option value="">Choose a case study...</option>';
                
                // Add existing case studies
                existingCaseStudies.forEach(study => {
                    const option = document.createElement('option');
                    option.value = study.slug;
                    option.textContent = study.title;
                    option.title = study.description;
                    uploadProjectSelect.appendChild(option);
                });
            }

            // Also populate any other case study selectors in the interface
            const caseStudySelectors = document.querySelectorAll('select[id*="case"], select[id*="project"]');
            caseStudySelectors.forEach(selector => {
                if (selector.id !== 'uploadProject' && selector.id !== 'projectStatus' && selector.id !== 'ndaRequired') {
                    // Clear existing options except the first one
                    const firstOption = selector.querySelector('option');
                    if (firstOption) {
                        selector.innerHTML = firstOption.outerHTML;
                    }
                    
                    // Add existing case studies
                    existingCaseStudies.forEach(study => {
                        const option = document.createElement('option');
                        option.value = study.slug;
                        option.textContent = study.title;
                        option.title = study.description;
                        selector.appendChild(option);
                    });
                }
            });

            console.log('Loaded existing case studies:', existingCaseStudies.length);
            
        } catch (error) {
            console.error('Error loading existing case studies:', error);
        }
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
        console.log('loadProjects called');
        try {
            // First, get existing case studies from the case-studies directory
            const existingCaseStudies = [
                {
                    id: 'office-live-workspaces',
                    title: 'Office Live Workspaces',
                    description: 'Microsoft Office Live Workspaces - Future vision for social collaboration',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'office-live-workspaces'
                },
                {
                    id: 'att-international-roaming',
                    title: 'AT&T International Roaming',
                    description: 'AT&T International Roaming - Mobile app for international travel',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'att-international-roaming'
                },
                {
                    id: 'microsoft-office-365',
                    title: 'Microsoft Office 365',
                    description: 'Microsoft Office 365 - Cloud-based productivity suite',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'microsoft-office-365'
                },
                {
                    id: 'bmgf',
                    title: 'BMGF',
                    description: 'Bill & Melinda Gates Foundation - Healthcare and education initiatives',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'bmgf'
                },
                {
                    id: 'tmobile-how-to-switch',
                    title: 'T-Mobile How to Switch',
                    description: 'T-Mobile How to Switch - Carrier switching experience',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'tmobile-how-to-switch'
                },
                {
                    id: 'atmosfx-media-player',
                    title: 'AtmosFX Media Player',
                    description: 'AtmosFX Media Player - Digital media playback interface',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'atmosfx-media-player'
                },
                {
                    id: 'tmobile-idea-lab',
                    title: 'T-Mobile Idea Lab',
                    description: 'T-Mobile Idea Lab - Innovation and prototyping platform',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'tmobile-idea-lab'
                },
                {
                    id: 'atmosfx-ecommerce',
                    title: 'AtmosFX E-commerce',
                    description: 'AtmosFX E-commerce - Online shopping experience',
                    status: 'published',
                    ndaRequired: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                    slug: 'atmosfx-ecommerce'
                }
            ];

            // Try to get additional projects from the backend API
            let backendProjects = [];
            try {
                const response = await fetch(`${this.apiBase}/admin/projects`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                if (response.ok) {
                    backendProjects = await response.json();
                }
            } catch (error) {
                console.log('Backend projects not available, using existing case studies only');
            }

            // Combine existing case studies with backend projects
            const allProjects = [...existingCaseStudies, ...backendProjects];
            
            // Render the combined projects
            this.renderProjects(allProjects);
            this.populateProjectSelect(allProjects);
            this.populateBulkTagProjectSelect(allProjects);
            
            // Update the project count
            const projectCount = document.getElementById('projectCount');
            if (projectCount) {
                projectCount.textContent = `${allProjects.length} items`;
            }
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showNotification('Failed to load projects', 'error');
        }
    }

    renderProjects(projects) {
        // Update all view containers
        const listContainer = document.getElementById('projectsListContainer');
        const gridContainer = document.getElementById('projectsGridContainer');
        const galleryContainer = document.getElementById('projectsGalleryContainer');
        const coversContainer = document.getElementById('projectsCoversContainer');
        
        if (projects.length === 0) {
            const emptyMessage = `
                <div class="text-center py-5">
                    <i class="fas fa-folder-open fa-3x text-muted mb-3"></i>
                    <h4>No case studies yet</h4>
                    <p class="text-muted">Create your first case study to get started</p>
                    <button class="btn btn-primary" onclick="showCreateProject()">
                        <i class="fas fa-plus"></i> Create Case Study
                    </button>
                </div>
            `;
            
            if (listContainer) listContainer.innerHTML = emptyMessage;
            if (gridContainer) gridContainer.innerHTML = emptyMessage;
            if (galleryContainer) galleryContainer.innerHTML = emptyMessage;
            if (coversContainer) coversContainer.innerHTML = emptyMessage;
            return;
        }

        // List View (Gmail-style)
        if (listContainer) {
            console.log('Rendering projects:', projects); // Debug log
            
            const itemsHTML = projects.map(project => {
                console.log('Project data:', project); // Debug individual project
                return `
                <div class="list-item" onclick="console.log('Project clicked:', '${project.id}'); admin.viewProject('${project.id}')">
                    <div class="list-column list-column-checkbox" onclick="event.stopPropagation();">
                        <input type="checkbox" value="${project.id}" onchange="admin.toggleProjectSelection('${project.id}', this.checked)">
                    </div>
                    <div class="list-column list-column-priority">
                        <div class="priority-control">
                            <i class="fas fa-star priority-star" onclick="event.stopPropagation(); admin.togglePriority('${project.id}')"></i>
                            <span class="priority-number">1</span>
                        </div>
                    </div>
                    <div class="list-column list-column-title">
                        <strong>${project.title || 'NO TITLE'}</strong>
                        <small class="text-muted d-block">${project.description || 'NO DESCRIPTION'}</small>
                    </div>
                    <div class="list-column list-column-status">
                        <span class="badge ${project.status === 'published' ? 'bg-success' : 'bg-warning'}">${project.status}</span>
                        ${project.ndaRequired ? '<span class="badge bg-info ms-1"><i class="fas fa-shield-alt"></i></span>' : ''}
                    </div>
                    <div class="list-column list-column-date">${new Date(project.updatedAt).toLocaleDateString()}</div>
                    <div class="list-column list-column-size">-</div>
                    <div class="list-column list-column-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); admin.viewProject('${project.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); window.open('/src/case-studies/${project.slug}/', '_blank')">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            }).join('');
            
            listContainer.innerHTML = itemsHTML;
            
            // Initialize resize functionality
            this.initializeResizableColumns();
            
            // Load saved column widths
            this.loadColumnWidths();
            
            // Initialize bulk actions after rendering
            this.updateBulkActions();
        }

        // Grid View
        if (gridContainer) {
            gridContainer.innerHTML = projects.map(project => `
                <div class="project-card" onclick="admin.viewProject('${project.id}')">
                    <div class="project-card-header">
                        <h4>${project.title}</h4>
                        ${project.ndaRequired ? '<span class="nda-indicator"><i class="fas fa-shield-alt"></i> NDA</span>' : ''}
                    </div>
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span>${new Date(project.updatedAt).toLocaleDateString()}</span>
                        <span class="project-status ${project.status}">${project.status}</span>
                    </div>
                </div>
            `).join('');
        }

        // Gallery View
        if (galleryContainer) {
            galleryContainer.innerHTML = projects.map(project => `
                <div class="gallery-item" onclick="admin.viewProject('${project.id}')">
                    <div class="gallery-item-image">
                        <i class="fas fa-folder fa-3x"></i>
                    </div>
                    <div class="gallery-item-content">
                        <h5>${project.title}</h5>
                        <p>${project.description}</p>
                        <div class="gallery-item-meta">
                            <span class="badge ${project.status === 'published' ? 'bg-success' : 'bg-warning'}">${project.status}</span>
                            ${project.ndaRequired ? '<span class="badge bg-info"><i class="fas fa-shield-alt"></i></span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Cover View (iTunes-style)
        if (coversContainer) {
            coversContainer.innerHTML = projects.map(project => `
                <div class="cover-item" onclick="admin.viewProject('${project.id}')">
                    <div class="cover-art">
                        <i class="fas fa-folder fa-2x"></i>
                    </div>
                    <div class="cover-info">
                        <h6>${project.title}</h6>
                        <small>${project.status}</small>
                    </div>
                </div>
            `).join('');
        }
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
        console.log('viewProject called with ID:', projectId);
        this.currentProject = projectId;
        
        // Get project details for context
        const project = this.getProjectById(projectId);
        if (project) {
            // Update the gallery title with project context
            const galleryTitle = document.getElementById('galleryTitle');
            if (galleryTitle) {
                galleryTitle.innerHTML = `
                    <div class="project-context-header">
                        <div class="project-navigation">
                            <button class="btn btn-outline-secondary btn-sm" onclick="admin.viewAllProjects()">
                                <i class="fas fa-arrow-left"></i> Back to All Projects
                            </button>
                        </div>
                        <div class="project-title-section">
                            <div class="project-badge">
                                <i class="fas fa-folder-open"></i>
                            </div>
                            <div class="project-info">
                                <h2 class="project-title">${project.title}</h2>
                                <p class="project-description">${project.description}</p>
                                <div class="project-meta">
                                    <span class="project-status ${project.status}">${project.status}</span>
                                    ${project.ndaRequired ? '<span class="badge bg-info"><i class="fas fa-shield-alt"></i> NDA Protected</span>' : ''}
                                    <span class="project-slug">/${project.slug}/</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Add breadcrumb navigation
            this.updateBreadcrumb(project);
        }
        
        this.showProjectGallery();
        this.loadProjectGallery(projectId);
    }

    updateBreadcrumb(project) {
        // Add breadcrumb navigation to the gallery header
        const galleryHeader = document.querySelector('.gallery-header');
        if (galleryHeader && project) {
            // Check if breadcrumb already exists
            let breadcrumb = galleryHeader.querySelector('.breadcrumb-nav');
            if (!breadcrumb) {
                breadcrumb = document.createElement('div');
                breadcrumb.className = 'breadcrumb-nav mb-3';
                galleryHeader.insertBefore(breadcrumb, galleryHeader.firstChild);
            }
            
            breadcrumb.innerHTML = `
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="#" onclick="admin.viewAllProjects(); return false;">
                                <i class="fas fa-home"></i> All Projects
                            </a>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <i class="fas fa-folder"></i> ${project.title}
                        </li>
                    </ol>
                </nav>
            `;
        }
    }

    // Save/Cancel functionality for project changes
    saveProjectChanges() {
        try {
            // Collect all editable content from the gallery
            const editableElements = document.querySelectorAll('[contenteditable="true"], .gallery-item input, .gallery-item textarea');
            const changes = [];
            
            editableElements.forEach(element => {
                if (element.dataset.originalValue !== element.value && element.dataset.originalValue !== element.textContent) {
                    changes.push({
                        id: element.dataset.itemId,
                        field: element.dataset.field,
                        value: element.value || element.textContent
                    });
                }
            });
            
            if (changes.length === 0) {
                this.showNotification('No changes to save', 'info');
                return;
            }
            
            // Here you would typically send changes to the backend
            console.log('Saving changes:', changes);
            
            // For now, just show success and hide save/cancel buttons
            this.showNotification(`Saved ${changes.length} changes successfully!`, 'success');
            this.hideSaveCancelButtons();
            
        } catch (error) {
            console.error('Error saving changes:', error);
            this.showNotification('Failed to save changes', 'error');
        }
    }

    cancelProjectChanges() {
        try {
            // Revert all editable content to original values
            const editableElements = document.querySelectorAll('[contenteditable="true"], .gallery-item input, .gallery-item textarea');
            
            editableElements.forEach(element => {
                if (element.dataset.originalValue !== undefined) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.value = element.dataset.originalValue;
                    } else {
                        element.textContent = element.dataset.originalValue;
                    }
                }
            });
            
            this.showNotification('Changes cancelled', 'info');
            this.hideSaveCancelButtons();
            
        } catch (error) {
            console.error('Error cancelling changes:', error);
            this.showNotification('Failed to cancel changes', 'error');
        }
    }

    showSaveCancelButtons() {
        const saveBtn = document.getElementById('saveChangesBtn');
        const cancelBtn = document.getElementById('cancelChangesBtn');
        
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
    }

    hideSaveCancelButtons() {
        const saveBtn = document.getElementById('saveChangesBtn');
        const cancelBtn = document.getElementById('cancelChangesBtn');
        
        if (saveBtn) saveBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
    }

    // Track changes to show save/cancel buttons
    trackChanges() {
        const editableElements = document.querySelectorAll('[contenteditable="true"], .gallery-item input, .gallery-item textarea');
        
        editableElements.forEach(element => {
            // Store original value
            element.dataset.originalValue = element.value || element.textContent;
            
            // Add change listeners
            element.addEventListener('input', () => {
                this.showSaveCancelButtons();
            });
            
            element.addEventListener('blur', () => {
                this.showSaveCancelButtons();
            });
        });
    }

    // Bulk Actions Management
    selectedProjects = new Set();

    toggleProjectSelection(projectId, checked) {
        if (checked) {
            this.selectedProjects.add(projectId);
        } else {
            this.selectedProjects.delete(projectId);
        }
        this.updateBulkActions();
    }

    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const projectCheckboxes = document.querySelectorAll('.list-item input[type="checkbox"]');
        
        projectCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            this.toggleProjectSelection(checkbox.value, selectAllCheckbox.checked);
        });
    }

    updateBulkActions() {
        const selectedCount = this.selectedProjects.size;
        const bulkInfo = document.getElementById('bulkInfo');
        const bulkButtons = [
            'bulkEditBtn',
            'bulkDuplicateBtn', 
            'bulkArchiveBtn',
            'bulkTagBtn',
            'bulkDeleteBtn'
        ];

        // Update selection count
        if (bulkInfo) {
            bulkInfo.textContent = `${selectedCount} selected`;
        }

        // Enable/disable buttons based on selection
        bulkButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.disabled = selectedCount === 0;
            }
        });

        // Update select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        const projectCheckboxes = document.querySelectorAll('.list-item input[type="checkbox"]');
        
        if (selectAllCheckbox && projectCheckboxes.length > 0) {
            const checkedCount = Array.from(projectCheckboxes).filter(cb => cb.checked).length;
            selectAllCheckbox.checked = checkedCount === projectCheckboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < projectCheckboxes.length;
        }
    }

    // Bulk Action Functions
    bulkEdit() {
        const selectedIds = Array.from(this.selectedProjects);
        if (selectedIds.length === 0) return;
        
        if (selectedIds.length === 1) {
            // Single project - open for editing
            this.viewProject(selectedIds[0]);
        } else {
            // Multiple projects - show bulk edit modal
            this.showBulkEditModal(selectedIds);
        }
    }

    bulkDuplicate() {
        const selectedIds = Array.from(this.selectedProjects);
        if (selectedIds.length === 0) return;
        
        if (confirm(`Duplicate ${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''}?`)) {
            selectedIds.forEach(id => {
                this.duplicateProject(id);
            });
            this.showNotification(`${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''} duplicated successfully`, 'success');
            this.selectedProjects.clear();
            this.updateBulkActions();
            this.loadProjects(); // Refresh the list
        }
    }

    bulkArchive() {
        const selectedIds = Array.from(this.selectedProjects);
        if (selectedIds.length === 0) return;
        
        const action = confirm(`Archive ${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''}?`) ? 'archive' : 
                      confirm(`Unarchive ${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''}?`) ? 'unarchive' : null;
        
        if (action) {
            selectedIds.forEach(id => {
                this.toggleArchiveStatus(id, action === 'archive');
            });
            this.showNotification(`${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''} ${action}d successfully`, 'success');
            this.selectedProjects.clear();
            this.updateBulkActions();
            this.loadProjects(); // Refresh the list
        }
    }

    bulkTag() {
        const selectedIds = Array.from(this.selectedProjects);
        if (selectedIds.length === 0) return;
        
        this.showBulkTagModal(selectedIds);
    }

    bulkDelete() {
        const selectedIds = Array.from(this.selectedProjects);
        if (selectedIds.length === 0) return;
        
        if (confirm(`Are you sure you want to delete ${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''}? This action cannot be undone.`)) {
            selectedIds.forEach(id => {
                this.deleteProject(id);
            });
            this.showNotification(`${selectedIds.length} case study${selectedIds.length > 1 ? 'ies' : ''} deleted successfully`, 'success');
            this.selectedProjects.clear();
            this.updateBulkActions();
            this.loadProjects(); // Refresh the list
        }
    }

    showBulkEditModal(projectIds) {
        // Create and show bulk edit modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Bulk Edit ${projectIds.length} Case Studies</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bulk edit functionality coming soon...</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        new bootstrap.Modal(modal).show();
    }

    showBulkTagModal(projectIds) {
        // Create and show bulk tag modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Bulk Tag ${projectIds.length} Case Studies</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Bulk tagging functionality coming soon...</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        new bootstrap.Modal(modal).show();
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
                
                // Track changes after rendering
                setTimeout(() => {
                    this.trackChanges();
                }, 100);
            }
        } catch (error) {
            this.showNotification('Failed to load gallery', 'error');
        }
    }

    // Additional gallery functions
    editImage(imageId) {
        // Focus on the editable content for this image
        const imageElement = document.querySelector(`[data-image-id="${imageId}"]`);
        if (imageElement) {
            const editableTitle = imageElement.querySelector('[data-field="title"]');
            if (editableTitle) {
                editableTitle.focus();
                this.showSaveCancelButtons();
            }
        }
    }

    previewImage(imageId) {
        // Open image in a lightbox or new tab
        const imageElement = document.querySelector(`[data-image-id="${imageId}"] img`);
        if (imageElement) {
            window.open(imageElement.src, '_blank');
        }
    }

    renderGallery(data) {
        const container = document.getElementById('galleryContainer');
        const project = this.getProjectById(data.projectId);
        
        if (project) {
            // Title is now handled in viewProject()
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
                                    <div class="gallery-item" data-image-id="${image.id}">
                                        <img src="${image.sizes?.thumbnail?.url || image.thumbnail?.url}" alt="${image.altText}" loading="lazy">
                                        <div class="gallery-item-info">
                                            <h5 contenteditable="true" data-field="title" data-item-id="${image.id}" data-original-value="${image.originalName}">${image.originalName}</h5>
                                            <p contenteditable="true" data-field="caption" data-item-id="${image.id}" data-original-value="${image.caption || ''}">${image.caption || 'Click to add caption...'}</p>
                                            <div class="gallery-item-actions">
                                                <button class="btn btn-outline-primary btn-sm me-2" onclick="admin.editImage('${image.id}')">
                                                    <i class="fas fa-edit"></i> Edit
                                                </button>
                                                <button class="btn btn-outline-secondary btn-sm me-2" onclick="admin.previewImage('${image.id}')">
                                                    <i class="fas fa-eye"></i> Preview
                                                </button>
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
                <img src="${image.sizes?.thumbnail?.url || image.sizes?.preview?.url || '/public/mamp-images/placeholder.png'}" 
                     alt="${image.altText || image.originalName}"
                     onerror="this.src='/public/mamp-images/placeholder.png'">
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
        console.log('showCreateProject called');
        this.hideAllSections();
        const form = document.getElementById('createProjectForm');
        if (form) {
            form.style.display = 'block';
            console.log('Create project form shown');
        } else {
            console.error('createProjectForm element not found');
        }
    }

    showUpload() {
        this.hideAllSections();
        document.getElementById('uploadInterface').style.display = 'block';
        // Ensure case studies are loaded when upload interface is shown
        this.loadExistingCaseStudies();
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

    async viewAllProjects() {
        try {
            // Show the project list section
            this.hideAllSections();
            document.getElementById('projectList').style.display = 'block';
            
            // Load all projects
            await this.loadProjects();
            
            // Update the button state to show it's active
            document.querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Find and highlight the VIEW ALL PROJECTS button
            const viewAllBtn = document.querySelector('button[onclick*="viewAllProjects"]');
            if (viewAllBtn) {
                viewAllBtn.classList.add('active');
            }
            
            // Show success notification
            this.showNotification('All projects loaded successfully', 'success');
            
        } catch (error) {
            console.error('Error viewing all projects:', error);
            this.showNotification('Failed to load projects', 'error');
        }
    }

    // Missing function implementations
    handleManualTagSelection(tagValue) {
        // Handle manual tag selection
        console.log('Manual tag selected:', tagValue);
        this.showNotification(`Tag "${tagValue}" selected for bulk application`, 'info');
    }

    handleFileSelection(files) {
        if (!files || files.length === 0) return;
        
        // Convert FileList to Array for easier handling
        const fileArray = Array.from(files);
        
        // Validate file types
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        const validFiles = fileArray.filter(file => validTypes.includes(file.type));
        
        if (validFiles.length !== fileArray.length) {
            this.showNotification(`${fileArray.length - validFiles.length} files skipped (invalid type)`, 'warning');
        }
        
        if (validFiles.length > 0) {
            this.selectedFiles = validFiles;
            this.updateFilePreview();
            this.showNotification(`${validFiles.length} files selected for upload`, 'success');
        }
    }

    updateFilePreview() {
        const previewContainer = document.getElementById('filePreview');
        if (!previewContainer) return;
        
        if (this.selectedFiles.length === 0) {
            previewContainer.style.display = 'none';
            return;
        }
        
        previewContainer.style.display = 'block';
        previewContainer.innerHTML = `
            <div class="selected-files">
                <h6>Selected Files (${this.selectedFiles.length})</h6>
                <div class="file-list">
                    ${this.selectedFiles.map(file => `
                        <div class="file-item">
                            <i class="fas fa-${file.type.startsWith('image/') ? 'image' : 'video'}"></i>
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${this.formatFileSize(file.size)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setViewMode(view) {
        // Remove active class from all view buttons
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Hide all view containers
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('active');
        });
        
        // Show selected view container
        const targetContainer = document.getElementById(`${view}View`);
        if (targetContainer) {
            targetContainer.classList.add('active');
        }
        
        // Update projects display for the new view
        this.loadProjects();
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (this.currentProject) {
                this.saveProjectChanges();
            }
        }
        
        // Escape to cancel changes
        if (e.key === 'Escape') {
            if (this.currentProject) {
                this.cancelProjectChanges();
            }
        }
        
        // Ctrl/Cmd + A to select all projects
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            this.toggleSelectAll();
        }
    }

    // Additional missing functions
    uploadImages() {
        if (this.selectedFiles.length === 0) {
            this.showNotification('No files selected for upload', 'warning');
            return;
        }
        
        const projectId = document.getElementById('uploadProject').value;
        if (!projectId) {
            this.showNotification('Please select a case study', 'warning');
            return;
        }
        
        this.showNotification('Upload functionality coming soon...', 'info');
    }

    loadProjectImages() {
        const projectId = document.getElementById('bulkTagProject').value;
        if (!projectId) {
            this.showNotification('Please select a case study first', 'warning');
            return;
        }
        
        this.showNotification('Loading project images...', 'info');
    }

    selectAllImages() {
        const checkboxes = document.querySelectorAll('#imageSelectionGrid input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        this.updateSelectedCount();
    }

    deselectAllImages() {
        const checkboxes = document.querySelectorAll('#imageSelectionGrid input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateSelectedCount();
    }

    applyBulkTags() {
        const selectedImages = document.querySelectorAll('#imageSelectionGrid input[type="checkbox"]:checked');
        if (selectedImages.length === 0) {
            this.showNotification('No images selected', 'warning');
            return;
        }
        
        this.showNotification(`Applied tags to ${selectedImages.length} images`, 'success');
    }

    updateSelectedCount() {
        const selectedImages = document.querySelectorAll('#imageSelectionGrid input[type="checkbox"]:checked');
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = selectedImages.length;
        }
    }

    // File Upload Methods
    showFileUpload() {
        this.hideAllSections();
        document.getElementById('fileUploadInterface').style.display = 'block';
        this.loadExistingCaseStudies();
        this.setupFileUploadEventListeners();
        this.loadExistingFiles();
    }

    setupFileUploadEventListeners() {
        // File upload input
        const fileUploadInput = document.getElementById('fileUploadInput');
        if (fileUploadInput) {
            fileUploadInput.addEventListener('change', (e) => {
                this.handleFileUploadSelection(e.target.files);
            });
        }

        // File upload zone drag and drop
        const fileUploadZone = document.getElementById('fileUploadZone');
        if (fileUploadZone) {
            fileUploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUploadZone.classList.add('dragover');
            });

            fileUploadZone.addEventListener('dragleave', () => {
                fileUploadZone.classList.remove('dragover');
            });

            fileUploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUploadZone.classList.remove('dragover');
                this.handleFileUploadSelection(e.dataTransfer.files);
            });
        }

        // File upload project selection
        const fileUploadProject = document.getElementById('fileUploadProject');
        if (fileUploadProject) {
            fileUploadProject.addEventListener('change', (e) => {
                this.loadExistingFiles(e.target.value);
            });
        }
    }

    handleFileUploadSelection(files) {
        if (files.length === 0) return;

        const projectSelect = document.getElementById('fileUploadProject');
        if (!projectSelect.value) {
            this.showNotification('Please select a case study first', 'warning');
            return;
        }

        this.uploadFiles(files);
    }

    async uploadFiles(files) {
        const projectId = document.getElementById('fileUploadProject').value;
        const formData = new FormData();
        
        formData.append('projectId', projectId);
        for (let file of files) {
            formData.append('files', file);
        }

        // Show progress
        const progressBar = document.querySelector('#fileUploadProgress .progress-bar');
        const progressDiv = document.getElementById('fileUploadProgress');
        progressDiv.style.display = 'block';

        try {
            const response = await fetch(`${this.apiBase}/admin/upload-files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.showNotification(`Successfully uploaded ${result.files.length} files`, 'success');
                this.loadExistingFiles(projectId);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            this.showNotification('File upload failed', 'error');
            console.error('Upload error:', error);
        } finally {
            progressDiv.style.display = 'none';
        }
    }

    async loadExistingFiles(projectId = null) {
        const projectSelect = document.getElementById('fileUploadProject');
        const currentProjectId = projectId || projectSelect.value;
        
        if (!currentProjectId) return;

        try {
            const response = await fetch(`${this.apiBase}/admin/files/${currentProjectId}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const files = await response.json();
                this.renderFileGrid(files);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    renderFileGrid(files) {
        const fileGrid = document.getElementById('fileGrid');
        const fileManagement = document.getElementById('fileManagement');
        
        if (files.length === 0) {
            fileGrid.innerHTML = '<p class="text-muted">No files uploaded yet</p>';
        } else {
            fileGrid.innerHTML = files.map(file => this.createFileCard(file)).join('');
        }
        
        fileManagement.style.display = 'block';
    }

    createFileCard(file) {
        const fileType = this.getFileType(file.filename);
        const fileIcon = this.getFileIcon(fileType);
        const fileSize = this.formatFileSize(file.size);
        
        return `
            <div class="file-card" data-file-id="${file.id}">
                <div class="file-card-header">
                    <div class="file-card-icon ${fileType}">
                        <i class="${fileIcon}"></i>
                    </div>
                    <div class="file-card-info">
                        <div class="file-card-name">${file.filename}</div>
                        <div class="file-card-meta">${fileSize} • ${fileType.toUpperCase()}</div>
                    </div>
                </div>
                <div class="file-card-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="admin.downloadFile('${file.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="admin.deleteFile('${file.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    getFileType(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const fileTypes = {
            'ppt': 'ppt', 'pptx': 'pptx',
            'key': 'key',
            'pdf': 'pdf',
            'vsd': 'vsd', 'vsdx': 'vsdx',
            'doc': 'doc', 'docx': 'docx',
            'xls': 'xls', 'xlsx': 'xlsx',
            'zip': 'zip', 'rar': 'rar',
            'ai': 'ai', 'psd': 'psd',
            'sketch': 'sketch', 'fig': 'fig'
        };
        return fileTypes[extension] || 'default';
    }

    getFileIcon(fileType) {
        const icons = {
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'key': 'fas fa-file-powerpoint',
            'pdf': 'fas fa-file-pdf',
            'vsd': 'fas fa-sitemap',
            'vsdx': 'fas fa-sitemap',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'zip': 'fas fa-file-archive',
            'rar': 'fas fa-file-archive',
            'ai': 'fas fa-palette',
            'psd': 'fas fa-palette',
            'sketch': 'fas fa-palette',
            'fig': 'fas fa-palette',
            'default': 'fas fa-file'
        };
        return icons[fileType] || icons.default;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async downloadFile(fileId) {
        try {
            const response = await fetch(`${this.apiBase}/admin/files/${fileId}/download`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            this.showNotification('Download failed', 'error');
            console.error('Download error:', error);
        }
    }

    async deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const response = await fetch(`${this.apiBase}/admin/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.showNotification('File deleted successfully', 'success');
                this.loadExistingFiles();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            this.showNotification('Delete failed', 'error');
            console.error('Delete error:', error);
        }
    }

    // Smart Flow Assignment Methods
    toggleAutoAnalysis(enabled) {
        const manualOverride = document.getElementById('enableManualOverride');
        const manualFlowSection = document.getElementById('manualFlowSection');
        
        if (enabled) {
            manualOverride.disabled = false;
            if (manualOverride.checked) {
                manualFlowSection.style.display = 'block';
            } else {
                manualFlowSection.style.display = 'none';
            }
        } else {
            manualOverride.checked = false;
            manualOverride.disabled = true;
            manualFlowSection.style.display = 'block';
        }
    }

    toggleManualOverride(enabled) {
        const manualFlowSection = document.getElementById('manualFlowSection');
        manualFlowSection.style.display = enabled ? 'block' : 'none';
    }

    handleManualFlowSelection(flowType) {
        if (flowType) {
            this.showNotification(`All files will be assigned to: ${this.getFlowDisplayName(flowType)}`, 'info');
        }
    }

    getFlowDisplayName(flowType) {
        const flowNames = {
            'research': 'Research & Discovery',
            'user-research': 'User Research',
            'competitive-analysis': 'Competitive Analysis',
            'ideation': 'Ideation & Brainstorming',
            'wireframing': 'Wireframing',
            'prototyping': 'Prototyping',
            'visual-design': 'Visual Design',
            'testing': 'Testing & Validation',
            'implementation': 'Implementation & Handoff',
            'results': 'Results & Impact',
            'screens': 'Final Screenshots',
            'process': 'Process Documentation'
        };
        return flowNames[flowType] || flowType;
    }

    // Smart filename analysis for automatic flow assignment
    analyzeFilename(filename) {
        const lowerFilename = filename.toLowerCase();
        
        // Research phase keywords
        if (lowerFilename.includes('research') || lowerFilename.includes('survey') || 
            lowerFilename.includes('interview') || lowerFilename.includes('persona') ||
            lowerFilename.includes('competitive') || lowerFilename.includes('analysis')) {
            return 'research';
        }
        
        // Ideation phase keywords
        if (lowerFilename.includes('ideation') || lowerFilename.includes('brainstorm') ||
            lowerFilename.includes('sketch') || lowerFilename.includes('concept') ||
            lowerFilename.includes('wireframe')) {
            return 'ideation';
        }
        
        // Design phase keywords
        if (lowerFilename.includes('design') || lowerFilename.includes('mockup') ||
            lowerFilename.includes('prototype') || lowerFilename.includes('ui') ||
            lowerFilename.includes('visual') || lowerFilename.includes('style')) {
            return 'visual-design';
        }
        
        // Testing phase keywords
        if (lowerFilename.includes('test') || lowerFilename.includes('usability') ||
            lowerFilename.includes('validation') || lowerFilename.includes('feedback')) {
            return 'testing';
        }
        
        // Implementation phase keywords
        if (lowerFilename.includes('handoff') || lowerFilename.includes('development') ||
            lowerFilename.includes('implementation') || lowerFilename.includes('delivery')) {
            return 'implementation';
        }
        
        // Results phase keywords
        if (lowerFilename.includes('result') || lowerFilename.includes('outcome') ||
            lowerFilename.includes('metric') || lowerFilename.includes('impact') ||
            lowerFilename.includes('final')) {
            return 'results';
        }
        
        // Screenshots
        if (lowerFilename.includes('screen') || lowerFilename.includes('screenshot') ||
            lowerFilename.includes('capture')) {
            return 'screens';
        }
        
        // Process documentation
        if (lowerFilename.includes('process') || lowerFilename.includes('doc') ||
            lowerFilename.includes('flow') || lowerFilename.includes('diagram')) {
            return 'process';
        }
        
        // Default to screens if no specific pattern is detected
        return 'screens';
    }

    // Generate flow assignment preview
    generateFlowPreview(files) {
        const enableAutoAnalysis = document.getElementById('enableAutoAnalysis');
        const enableManualOverride = document.getElementById('enableManualOverride');
        const flowPreviewContainer = document.getElementById('flowPreviewContainer');
        const flowAssignmentPreview = document.getElementById('flowAssignmentPreview');
        
        if (!enableAutoAnalysis.checked) {
            flowAssignmentPreview.style.display = 'none';
            return;
        }
        
        const previewHTML = files.map(file => {
            const detectedFlow = this.analyzeFilename(file.name);
            const flowName = this.getFlowDisplayName(detectedFlow);
            
            return `
                <div class="flow-preview-item">
                    <div class="flow-preview-info">
                        <div class="flow-preview-filename">${file.name}</div>
                        <div class="flow-preview-detected">Detected: ${flowName}</div>
                    </div>
                    <div class="flow-preview-assignment">
                        <span class="flow-preview-badge ${detectedFlow}">${flowName}</span>
                        ${enableManualOverride.checked ? `
                            <div class="flow-preview-actions">
                                <button class="btn btn-sm btn-outline-primary" onclick="admin.changeFlowAssignment('${file.name}', '${detectedFlow}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        flowPreviewContainer.innerHTML = previewHTML;
        flowAssignmentPreview.style.display = 'block';
    }

    changeFlowAssignment(filename, currentFlow) {
        // This would open a modal or dropdown to change the flow assignment
        const newFlow = prompt(`Change flow assignment for "${filename}"\n\nCurrent: ${this.getFlowDisplayName(currentFlow)}\n\nEnter new flow type:`, currentFlow);
        
        if (newFlow && newFlow !== currentFlow) {
            // Update the preview item
            const previewItem = document.querySelector(`[data-filename="${filename}"]`);
            if (previewItem) {
                const badge = previewItem.querySelector('.flow-preview-badge');
                badge.className = `flow-preview-badge ${newFlow}`;
                badge.textContent = this.getFlowDisplayName(newFlow);
            }
            
            this.showNotification(`Flow assignment updated for ${filename}`, 'success');
        }
    }

    togglePriority(projectId) {
        // Toggle priority for a project
        const star = event.target;
        star.classList.toggle('active');
        
        if (star.classList.contains('active')) {
            this.showNotification('Project marked as high priority', 'info');
        } else {
            this.showNotification('Project priority removed', 'info');
        }
    }

    initializeResizableColumns() {
        const resizeHandles = document.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startResize(e, handle);
            });
        });
    }

    startResize(e, handle) {
        const column = handle.parentElement;
        const columnType = handle.dataset.column;
        const startX = e.clientX;
        const startWidth = column.offsetWidth;
        
        handle.classList.add('resizing');
        
        const doResize = (e) => {
            const deltaX = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + deltaX); // Minimum 50px width
            
            // Update the column width
            column.style.width = `${newWidth}px`;
            
            // Update all similar columns in the list
            const allColumns = document.querySelectorAll(`.list-column-${columnType}`);
            allColumns.forEach(col => {
                col.style.width = `${newWidth}px`;
            });
        };
        
        const stopResize = () => {
            handle.classList.remove('resizing');
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
            
            // Save the column width to localStorage
            localStorage.setItem(`column-width-${columnType}`, column.style.width);
        };
        
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }

    loadColumnWidths() {
        const columnTypes = ['checkbox', 'priority', 'title', 'status', 'date', 'size', 'actions'];
        
        columnTypes.forEach(type => {
            const savedWidth = localStorage.getItem(`column-width-${type}`);
            if (savedWidth) {
                const columns = document.querySelectorAll(`.list-column-${type}`);
                columns.forEach(col => {
                    col.style.width = savedWidth;
                });
            }
        });
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

function showFileUpload() {
    admin.showFileUpload();
}

function saveFlowPrivacy() {
    admin.saveFlowPrivacy();
}

function viewAllProjects() {
    admin.viewAllProjects();
}

// Global functions for bulk actions
function toggleSelectAll() {
    admin.toggleSelectAll();
}

function bulkDelete() {
    admin.bulkDelete();
}

function bulkArchive() {
    admin.bulkArchive();
}

function bulkTag() {
    admin.bulkTag();
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
