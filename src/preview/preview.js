/**
 * Q10UX Portfolio - Live Preview System
 * Provides real-time preview of case studies while editing
 */

class LivePreview {
    constructor() {
        this.projectId = this.getProjectIdFromUrl();
        this.autoRefreshInterval = null;
        this.lastData = null;
        this.isAutoRefreshEnabled = true;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPreview();
        this.startAutoRefresh();
    }

    getProjectIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('project') || this.extractProjectIdFromPath();
    }

    extractProjectIdFromPath() {
        const path = window.location.pathname;
        const match = path.match(/\/preview\/([^\/]+)/);
        return match ? match[1] : null;
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadPreview(true);
        });

        // Edit button
        document.getElementById('editBtn').addEventListener('click', () => {
            this.openEditor();
        });

        // Publish button
        document.getElementById('publishBtn').addEventListener('click', () => {
            this.publishProject();
        });

        // Toggle preview button
        document.getElementById('togglePreviewBtn').addEventListener('click', () => {
            this.toggleAutoRefresh();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.loadPreview(true);
                        break;
                    case 'e':
                        e.preventDefault();
                        this.openEditor();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.publishProject();
                        break;
                }
            }
        });
    }

    async loadPreview(forceRefresh = false) {
        if (!this.projectId) {
            this.showError('No project ID found in URL');
            return;
        }

        try {
            this.showLoading();

            const response = await fetch(`/api/preview/${this.projectId}`, {
                headers: {
                    'Cache-Control': forceRefresh ? 'no-cache' : 'default'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Check if data has changed
            if (!forceRefresh && this.lastData && JSON.stringify(this.lastData) === JSON.stringify(data)) {
                return; // No changes
            }

            this.lastData = data;
            this.renderPreview(data);
            this.updateLastUpdated();
            this.showAutoRefreshIndicator();

        } catch (error) {
            console.error('Error loading preview:', error);
            this.showError(error.message);
        }
    }

    renderPreview(data) {
        const { project, flows } = data;

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('errorState').style.display = 'none';
        document.getElementById('previewContent').style.display = 'block';

        // Render project info
        this.renderProjectInfo(project);

        // Render flow sections
        this.renderFlowSections(flows, data.flowManager);

        // Show/hide empty state
        const hasContent = Object.keys(flows).length > 0;
        document.getElementById('emptyState').style.display = hasContent ? 'none' : 'block';
    }

    renderProjectInfo(project) {
        document.getElementById('projectTitle').textContent = project.title || 'Untitled Project';
        document.getElementById('projectDescription').textContent = project.description || 'No description available';
        document.getElementById('projectStatus').textContent = project.status || 'draft';
        document.getElementById('projectStatus').className = `badge status-badge ${project.status || 'draft'}`;
        document.getElementById('projectClient').textContent = project.client || 'Not specified';
        document.getElementById('projectCreated').textContent = this.formatDate(project.createdAt);
        document.getElementById('projectUpdated').textContent = this.formatDate(project.updatedAt);

        // Render tags
        const tagsContainer = document.getElementById('projectTags');
        tagsContainer.innerHTML = '';
        if (project.tags && project.tags.length > 0) {
            project.tags.forEach(tag => {
                const badge = document.createElement('span');
                badge.className = 'badge bg-secondary me-2';
                badge.textContent = tag;
                tagsContainer.appendChild(badge);
            });
        }
    }

    renderFlowSections(flows, flowManager) {
        const container = document.getElementById('flowSections');
        container.innerHTML = '';

        // Get ordered flow types
        const flowTypes = Object.keys(flows).sort((a, b) => {
            const orderA = this.getFlowOrder(a, flowManager);
            const orderB = this.getFlowOrder(b, flowManager);
            return orderA - orderB;
        });

        flowTypes.forEach(flowType => {
            const series = flows[flowType];
            if (series && series.length > 0) {
                const section = this.createFlowSection(flowType, series, flowManager);
                container.appendChild(section);
            }
        });
    }

    createFlowSection(flowType, series, flowManager) {
        const section = document.createElement('div');
        section.className = 'flow-section';

        const flowInfo = this.getFlowInfo(flowType, flowManager);
        
        section.innerHTML = `
            <div class="flow-header">
                <div class="d-flex align-items-center">
                    <i class="${flowInfo.icon} flow-icon"></i>
                    <h3>${flowInfo.title}</h3>
                </div>
                <span class="flow-badge ${flowInfo.color}">
                    <i class="${flowInfo.icon}"></i>
                    ${series.length} series
                </span>
            </div>
            <div class="flow-content">
                <p class="flow-description">${flowInfo.description}</p>
                <div class="series-grid">
                    ${series.map(s => this.createSeriesCard(s)).join('')}
                </div>
            </div>
        `;

        return section;
    }

    createSeriesCard(series) {
        const imageCount = series.images ? series.images.length : 0;
        const firstImage = series.images && series.images.length > 0 ? series.images[0] : null;
        
        return `
            <div class="series-card">
                <div class="series-title">${series.title}</div>
                <div class="series-description">${series.description || 'No description'}</div>
                
                ${firstImage ? `
                    <div class="image-preview">
                        <div class="image-thumb">
                            <img src="/uploads/processed/${firstImage.name}" alt="${firstImage.description || firstImage.name}">
                            <div class="image-overlay">
                                ${imageCount} images
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="series-meta">
                    <span>${this.formatDate(series.createdAt)}</span>
                    <span class="series-image-count">${imageCount} images</span>
                </div>
            </div>
        `;
    }

    getFlowInfo(flowType, flowManager) {
        // Try to find flow info from flowManager
        const availableFlows = flowManager.availableFlows || [];
        let flowInfo = availableFlows.find(f => f.id === flowType);
        
        if (!flowInfo) {
            // Fallback to basic info
            flowInfo = {
                title: this.capitalizeFirst(flowType),
                description: `Content for ${flowType} stage`,
                icon: 'fas fa-folder',
                color: 'secondary'
            };
        }

        return flowInfo;
    }

    getFlowOrder(flowType, flowManager) {
        const availableFlows = flowManager.availableFlows || [];
        const flow = availableFlows.find(f => f.id === flowType);
        return flow ? (flow.order || 999) : 999;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('errorState').style.display = 'none';
        document.getElementById('previewContent').style.display = 'none';
    }

    showError(message) {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('previewContent').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    showAutoRefreshIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-refresh';
        indicator.innerHTML = '<i class="fas fa-sync-alt"></i> Updated';
        document.body.appendChild(indicator);

        // Show indicator
        setTimeout(() => indicator.classList.add('show'), 100);

        // Remove indicator after 3 seconds
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => indicator.remove(), 300);
        }, 3000);
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
    }

    startAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        this.autoRefreshInterval = setInterval(() => {
            if (this.isAutoRefreshEnabled) {
                this.loadPreview();
            }
        }, 5000); // Refresh every 5 seconds
    }

    toggleAutoRefresh() {
        this.isAutoRefreshEnabled = !this.isAutoRefreshEnabled;
        const btn = document.getElementById('togglePreviewBtn');
        
        if (this.isAutoRefreshEnabled) {
            btn.innerHTML = '<i class="fas fa-desktop"></i> Auto-refresh ON';
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-success');
        } else {
            btn.innerHTML = '<i class="fas fa-desktop"></i> Auto-refresh OFF';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-secondary');
        }
    }

    openEditor() {
        // Open serial upload with this project
        window.open(`/src/serial-upload/?project=${this.projectId}`, '_blank');
    }

    async publishProject() {
        if (!this.projectId) {
            alert('No project ID found');
            return;
        }

        try {
            const response = await fetch(`/api/admin/publish-project/${this.projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                alert('Project published successfully!');
                this.loadPreview(true);
            } else {
                const error = await response.json();
                alert(`Publish failed: ${error.error}`);
            }
        } catch (error) {
            console.error('Publish error:', error);
            alert('Failed to publish project');
        }
    }
}

// Initialize preview when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LivePreview();
});

// Export for global access
window.LivePreview = LivePreview;
