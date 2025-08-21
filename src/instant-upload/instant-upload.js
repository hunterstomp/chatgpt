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
            console.log('File input change event triggered');
            console.log('Files selected:', e.target.files);
            
            if (e.target.files && e.target.files.length > 0) {
                this.handleFiles(e.target.files);
            } else {
                console.log('No files selected or files array is empty');
                this.showNotification('No files were selected. Please try again.', 'warning');
            }
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
        const browseButton = uploadZone.querySelector('button');
        if (browseButton) {
            browseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Browse button clicked');
                fileInput.click();
            });
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

        // Keyboard support for dynamic buttons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                
                if (target.id === 'startUploadBtn' || target.closest('#startUploadBtn')) {
                    e.preventDefault();
                    if (this.startProcessing) {
                        this.startProcessing();
                    }
                }
                
                if (target.id === 'cancelUploadBtn' || target.closest('#cancelUploadBtn')) {
                    e.preventDefault();
                    this.cancelUpload();
                }
            }
        });
    }

    handleFiles(fileList) {
        if (fileList.length === 0) return;

        // Enhanced file processing with folder support
        this.files = this.processFileList(Array.from(fileList));

        if (this.files.length === 0) {
            this.showNotification('No valid files found. Please choose images, videos, or design files.', 'warning');
            return;
        }

        // Calculate and display file size information
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const sizeInfo = this.formatFileSize(totalSize);
        
        // Show Terminator HUD overlay
        this.showTerminatorHUD(totalSize, this.files.length);
        
        this.showFilePreview();
        this.showNotification(`Found ${this.files.length} files (${sizeInfo}) ready to upload`, 'info');
    }

    processFileList(fileList) {
        console.log('Processing file list:', fileList.length, 'files');
        
        const processedFiles = [];
        const projectStructure = {};
        const folderAnalysis = {};

        // Enhanced file type filters for UX case studies
        const validTypes = [
            // Images
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'image/tiff', 'image/bmp', 'image/heic', 'image/heif',
            // Videos
            'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm', 'video/quicktime',
            // Documents (for case study context)
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // Design files
            'application/x-photoshop', 'application/x-illustrator', 'application/x-indesign',
            'application/x-figma', 'application/x-sketch'
        ];

        // File extensions for additional validation
        const validExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.tiff', '.bmp', '.heic', '.heif',
            '.mp4', '.mov', '.avi', '.mkv', '.webm', '.qt',
            '.pdf', '.doc', '.docx',
            '.psd', '.ai', '.indd', '.fig', '.sketch'
        ];

        // First pass: Analyze folder structure and detect projects
        fileList.forEach(file => {
            const isValidType = validTypes.includes(file.type);
            const hasValidExtension = validExtensions.some(ext => 
                file.name.toLowerCase().endsWith(ext)
            );

            if (isValidType || hasValidExtension) {
                // Extract complete folder structure
                const fullPath = file.webkitRelativePath || file.name;
                const pathParts = fullPath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                const folderPath = pathParts.slice(0, -1).join('/');

                // Analyze folder structure for project detection
                this.analyzeFolderStructure(folderPath, fileName, folderAnalysis);
            }
        });

        // Second pass: Process files with intelligent sorting
        fileList.forEach(file => {
            const isValidType = validTypes.includes(file.type);
            const hasValidExtension = validExtensions.some(ext => 
                file.name.toLowerCase().endsWith(ext)
            );

            if (isValidType || hasValidExtension) {
                const fullPath = file.webkitRelativePath || file.name;
                const pathParts = fullPath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                const folderPath = pathParts.slice(0, -1).join('/');

                // Enhanced project and phase detection
                const projectInfo = this.detectProjectFromPath(folderPath, fileName, folderAnalysis);
                const sortInfo = this.generateSortInfo(file, folderPath, fileName, projectInfo);
                
                // Add comprehensive metadata
                file.projectInfo = projectInfo;
                file.folderPath = folderPath;
                file.fullPath = fullPath;
                file.sortInfo = sortInfo;
                file.processedMetadata = this.generateFileMetadata(file, projectInfo);
                
                processedFiles.push(file);
            }
        });

        // Sort files intelligently
        const sortedFiles = this.intelligentSort(processedFiles);
        
        console.log('Processed files:', sortedFiles.length);
        console.log('Project structure:', projectStructure);
        
        return sortedFiles;
    }

    analyzeFolderStructure(folderPath, fileName, folderAnalysis) {
        if (!folderPath) return;

        const pathParts = folderPath.split('/');
        
        // Analyze each level of the folder structure
        pathParts.forEach((folder, index) => {
            const folderKey = pathParts.slice(0, index + 1).join('/');
            
            if (!folderAnalysis[folderKey]) {
                folderAnalysis[folderKey] = {
                    name: folder,
                    level: index,
                    files: [],
                    subfolders: [],
                    projectKeywords: [],
                    phaseKeywords: []
                };
            }
            
            // Detect project and phase keywords in folder names
            const lowerFolder = folder.toLowerCase();
            const projectKeywords = ['project', 'case', 'study', 'client', 'brand', 'app', 'website', 'mobile', 'web'];
            const phaseKeywords = ['research', 'ideation', 'design', 'prototype', 'test', 'final', 'production', 'launch'];
            
            projectKeywords.forEach(keyword => {
                if (lowerFolder.includes(keyword)) {
                    folderAnalysis[folderKey].projectKeywords.push(keyword);
                }
            });
            
            phaseKeywords.forEach(keyword => {
                if (lowerFolder.includes(keyword)) {
                    folderAnalysis[folderKey].phaseKeywords.push(keyword);
                }
            });
        });
    }

    detectProjectFromPath(folderPath, fileName, folderAnalysis) {
        const pathParts = folderPath.split('/');
        let projectName = 'Unknown Project';
        let phase = 'General';
        let priority = 0;

        // Try to detect project from folder structure
        for (let i = pathParts.length - 1; i >= 0; i--) {
            const folder = pathParts[i];
            const folderKey = pathParts.slice(0, i + 1).join('/');
            
            if (folderAnalysis[folderKey] && folderAnalysis[folderKey].projectKeywords.length > 0) {
                projectName = this.cleanProjectName(folder);
                priority = i; // Higher level folders get higher priority
                break;
            }
        }

        // If no project detected, try to infer from file patterns
        if (projectName === 'Unknown Project') {
            projectName = this.inferProjectFromFiles(fileName, folderPath);
        }

        // Detect phase from folder structure
        for (let i = pathParts.length - 1; i >= 0; i--) {
            const folder = pathParts[i];
            const folderKey = pathParts.slice(0, i + 1).join('/');
            
            if (folderAnalysis[folderKey] && folderAnalysis[folderKey].phaseKeywords.length > 0) {
                phase = this.detectPhaseFromFilename(folder);
                break;
            }
        }

        // Fallback phase detection from filename
        if (phase === 'General') {
            phase = this.detectPhaseFromFilename(fileName);
        }

        return {
            name: projectName,
            phase: phase,
            priority: priority,
            confidence: this.calculateDetectionConfidence(folderPath, fileName, projectName, phase)
        };
    }

    generateSortInfo(file, folderPath, fileName, projectInfo) {
        const sortPriority = {
            'Research': 1,
            'Ideation': 2,
            'Design': 3,
            'Prototype': 4,
            'Testing': 5,
            'Final': 6,
            'Production': 7,
            'Launch': 8,
            'General': 9
        };

        return {
            projectPriority: projectInfo.priority,
            phaseOrder: sortPriority[projectInfo.phase] || 9,
            fileName: fileName.toLowerCase(),
            fileSize: file.size,
            isImage: file.type.startsWith('image/'),
            isVideo: file.type.startsWith('video/'),
            timestamp: Date.now()
        };
    }

    intelligentSort(files) {
        return files.sort((a, b) => {
            const sortA = a.sortInfo;
            const sortB = b.sortInfo;

            // First: Sort by project priority (higher level folders first)
            if (sortA.projectPriority !== sortB.projectPriority) {
                return sortB.projectPriority - sortA.projectPriority;
            }

            // Second: Sort by UX phase order
            if (sortA.phaseOrder !== sortB.phaseOrder) {
                return sortA.phaseOrder - sortB.phaseOrder;
            }

            // Third: Sort by file type (images first, then videos, then documents)
            const typeOrderA = sortA.isImage ? 1 : sortA.isVideo ? 2 : 3;
            const typeOrderB = sortB.isImage ? 1 : sortB.isVideo ? 2 : 3;
            if (typeOrderA !== typeOrderB) {
                return typeOrderA - typeOrderB;
            }

            // Fourth: Sort by filename alphabetically
            return sortA.fileName.localeCompare(sortB.fileName);
        });
    }

    generateFileMetadata(file, projectInfo) {
        return {
            project: projectInfo.name,
            phase: projectInfo.phase,
            confidence: projectInfo.confidence,
            fileType: this.getFileTypeCategory(file.type),
            estimatedProcessingTime: this.estimateProcessingTime(file.size, file.type),
            optimizationPotential: this.calculateOptimizationPotential(file.size, file.type),
            tags: this.generateAutoTags(file, projectInfo)
        };
    }

    calculateDetectionConfidence(folderPath, fileName, projectName, phase) {
        let confidence = 0.5; // Base confidence

        // Increase confidence based on folder structure
        if (folderPath && folderPath.length > 0) confidence += 0.2;
        if (projectName !== 'Unknown Project') confidence += 0.2;
        if (phase !== 'General') confidence += 0.1;

        // Increase confidence based on filename patterns
        const lowerFileName = fileName.toLowerCase();
        if (lowerFileName.includes('final') || lowerFileName.includes('production')) confidence += 0.1;
        if (lowerFileName.includes('mockup') || lowerFileName.includes('wireframe')) confidence += 0.1;

                return Math.min(confidence, 1.0);
    }

    getFileTypeCategory(fileType) {
        if (fileType.startsWith('image/')) return 'image';
        if (fileType.startsWith('video/')) return 'video';
        if (fileType.includes('pdf') || fileType.includes('word')) return 'document';
        if (fileType.includes('photoshop') || fileType.includes('illustrator') || fileType.includes('figma')) return 'design';
        return 'other';
    }

    estimateProcessingTime(fileSize, fileType) {
        const sizeInMB = fileSize / (1024 * 1024);
        
        if (fileType.startsWith('image/')) {
            if (sizeInMB < 5) return '< 10s';
            if (sizeInMB < 20) return '10-30s';
            return '30s+';
        }
        
        if (fileType.startsWith('video/')) {
            if (sizeInMB < 50) return '1-2min';
            if (sizeInMB < 200) return '2-5min';
            return '5min+';
        }
        
        return '< 5s';
    }

    calculateOptimizationPotential(fileSize, fileType) {
        const sizeInMB = fileSize / (1024 * 1024);
        
        if (fileType.startsWith('image/') && sizeInMB > 5) return 'high';
        if (fileType.startsWith('video/') && sizeInMB > 50) return 'high';
        if (sizeInMB > 20) return 'medium';
        return 'low';
    }

    generateAutoTags(file, projectInfo) {
        const tags = [];
        
        // Project-based tags
        if (projectInfo.name !== 'Unknown Project') {
            tags.push(projectInfo.name);
        }
        
        // Phase-based tags
        if (projectInfo.phase !== 'General') {
            tags.push(projectInfo.phase);
        }
        
        // File type tags
        if (file.type.startsWith('image/')) tags.push('visual');
        if (file.type.startsWith('video/')) tags.push('video');
        if (file.type.includes('pdf')) tags.push('document');
        if (file.type.includes('photoshop')) tags.push('design');
        
        // Size-based tags
        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > 10) tags.push('large');
        if (sizeInMB > 50) tags.push('heavy');
        
        return tags;
    }

    inferProjectFromFiles(fileName, folderPath) {
        // Try to infer project name from filename patterns
        const lowerFileName = fileName.toLowerCase();
        
        if (lowerFileName.includes('mobile') || lowerFileName.includes('app')) return 'Mobile App';
        if (lowerFileName.includes('web') || lowerFileName.includes('site')) return 'Website';
        if (lowerFileName.includes('brand') || lowerFileName.includes('logo')) return 'Branding';
        if (lowerFileName.includes('ui') || lowerFileName.includes('ux')) return 'UI/UX Design';
        
        // Try to extract from folder path
        if (folderPath) {
            const folderParts = folderPath.split('/');
            for (const part of folderParts) {
                if (part.length > 3 && !part.includes('.')) {
                    return this.cleanProjectName(part);
                }
            }
        }
        
        return 'Unknown Project';
    }

                processedFiles.push(file);

                // Build project structure
                if (!projectStructure[projectInfo.project]) {
                    projectStructure[projectInfo.project] = {
                        phases: {},
                        totalFiles: 0
                    };
                }
                if (!projectStructure[projectInfo.project].phases[projectInfo.phase]) {
                    projectStructure[projectInfo.project].phases[projectInfo.phase] = [];
                }
                projectStructure[projectInfo.project].phases[projectInfo.phase].push(file);
                projectStructure[projectInfo.project].totalFiles++;
            }
        });

        this.projectStructure = projectStructure;
        return processedFiles;
    }

    detectProjectFromPath(folderPath, fileName) {
        // Default values
        let project = 'Case Study';
        let phase = 'General';
        let tags = [];

        // Extract project name from folder structure
        const pathParts = folderPath.split('/').filter(part => part.trim());
        
        if (pathParts.length > 0) {
            // First folder is usually the project name
            project = this.cleanProjectName(pathParts[0]);
            
            // Second folder might be the phase
            if (pathParts.length > 1) {
                phase = this.detectPhase(pathParts[1]);
            }
        }

        // Detect phase from filename if not found in folder
        if (phase === 'General') {
            phase = this.detectPhaseFromFilename(fileName);
        }

        // Extract tags from filename
        tags = this.extractTagsFromFilename(fileName);

        return {
            project,
            phase,
            tags,
            folderPath
        };
    }

    cleanProjectName(name) {
        // Clean up project names
        return name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    detectPhase(folderName) {
        const phaseKeywords = {
            'research': ['research', 'user research', 'interviews', 'surveys', 'personas', 'journey'],
            'ideation': ['ideation', 'brainstorming', 'concepts', 'sketches', 'wireframes'],
            'design': ['design', 'mockups', 'prototypes', 'ui', 'ux', 'visual'],
            'testing': ['testing', 'usability', 'user testing', 'feedback', 'validation'],
            'implementation': ['implementation', 'development', 'build', 'production'],
            'results': ['results', 'analytics', 'metrics', 'outcomes', 'launch']
        };

        const lowerName = folderName.toLowerCase();
        
        for (const [phase, keywords] of Object.entries(phaseKeywords)) {
            if (keywords.some(keyword => lowerName.includes(keyword))) {
                return phase.charAt(0).toUpperCase() + phase.slice(1);
            }
        }

        return 'General';
    }

    detectPhaseFromFilename(filename) {
        const lowerName = filename.toLowerCase();
        
        if (lowerName.includes('research') || lowerName.includes('interview') || lowerName.includes('persona')) {
            return 'Research';
        }
        if (lowerName.includes('wireframe') || lowerName.includes('sketch') || lowerName.includes('concept')) {
            return 'Ideation';
        }
        if (lowerName.includes('mockup') || lowerName.includes('design') || lowerName.includes('prototype')) {
            return 'Design';
        }
        if (lowerName.includes('test') || lowerName.includes('usability') || lowerName.includes('feedback')) {
            return 'Testing';
        }
        if (lowerName.includes('final') || lowerName.includes('production') || lowerName.includes('build')) {
            return 'Implementation';
        }
        if (lowerName.includes('result') || lowerName.includes('analytics') || lowerName.includes('metric')) {
            return 'Results';
        }

        return 'General';
    }

    extractTagsFromFilename(filename) {
        const tags = [];
        const lowerName = filename.toLowerCase();

        // Common UX deliverables
        const tagKeywords = [
            'user flow', 'journey map', 'persona', 'wireframe', 'mockup', 'prototype',
            'user testing', 'feedback', 'analytics', 'metrics', 'dashboard', 'mobile',
            'desktop', 'responsive', 'accessibility', 'usability', 'interaction'
        ];

        tagKeywords.forEach(keyword => {
            if (lowerName.includes(keyword.replace(' ', '')) || lowerName.includes(keyword)) {
                tags.push(keyword);
            }
        });

        return tags;
    }

    async startProcessing() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.isCancelled = false;
        this.showStatus('Analyzing files...');
        
        try {
            // Create a default project for instant upload
            const projectId = await this.createDefaultProject();
            
            // Check if cancelled before starting uploads
            if (this.isCancelled) {
                this.updateStatus('Upload cancelled');
                this.resetUpload();
                return;
            }
            
            // Upload files to the project
            await this.uploadFiles(projectId);
            
            if (!this.isCancelled) {
                this.showResults();
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (!this.isCancelled) {
                this.showNotification('Upload failed. Please try again.', 'error');
            }
            this.resetUpload();
        }
    }

    async createDefaultProject() {
        this.updateStatus('Creating project...');
        
        const response = await fetch('http://localhost:3001/api/admin/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Instant Upload Project',
                description: 'Auto-generated project from instant upload',
                slug: 'instant-upload-' + Date.now(),
                ndaRequired: false
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create project');
        }

        const project = await response.json();
        return project.id;
    }

    async uploadFiles(projectId) {
        this.updateStatus('Uploading files...');
        
        const totalFiles = this.files.length;
        let completedFiles = 0;
        let failedFiles = [];
        
        // Create progress bar
        this.createProgressBar();
        
        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            const currentFile = i + 1;
            
            try {
                this.updateStatus(`Uploading ${currentFile}/${totalFiles}: ${file.name}`);
                this.updateProgressBar((currentFile / totalFiles) * 100);
                
                const formData = new FormData();
                formData.append('image', file);
                formData.append('ndaRequired', 'false');
                
                const response = await fetch(`http://localhost:3001/api/admin/projects/${projectId}/images`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                completedFiles++;
                this.showFileStatus(file.name, 'success');
                
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                failedFiles.push({ name: file.name, error: error.message });
                this.showFileStatus(file.name, 'error');
            }
        }
        
        // Final status update
        if (failedFiles.length === 0) {
            this.updateStatus(`✅ Successfully uploaded all ${completedFiles} files!`);
            this.showNotification(`All ${completedFiles} files uploaded successfully!`, 'success');
        } else {
            this.updateStatus(`⚠️ Uploaded ${completedFiles}/${totalFiles} files. ${failedFiles.length} failed.`);
            this.showNotification(`${completedFiles} files uploaded, ${failedFiles.length} failed.`, 'warning');
        }
        
        this.hideProgressBar();
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

    createProgressBar() {
        const statusSection = document.getElementById('statusSection');
        
        // Remove existing progress bar if any
        const existingProgress = statusSection.querySelector('.upload-progress');
        if (existingProgress) {
            existingProgress.remove();
        }
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'upload-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0%</div>
        `;
        
        statusSection.appendChild(progressContainer);
    }

    updateProgressBar(percentage) {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${Math.round(percentage)}%`;
        }
    }

    hideProgressBar() {
        const progressBar = document.querySelector('.upload-progress');
        if (progressBar) {
            progressBar.remove();
        }
    }

    showFileStatus(filename, status) {
        const statusSection = document.getElementById('statusSection');
        
        // Create or update file status list
        let fileStatusList = statusSection.querySelector('.file-status-list');
        if (!fileStatusList) {
            fileStatusList = document.createElement('div');
            fileStatusList.className = 'file-status-list';
            statusSection.appendChild(fileStatusList);
        }
        
        const statusItem = document.createElement('div');
        statusItem.className = `file-status-item ${status}`;
        statusItem.innerHTML = `
            <span class="file-name">${filename}</span>
            <span class="file-status">
                ${status === 'success' ? '✅' : '❌'}
            </span>
        `;
        
        fileStatusList.appendChild(statusItem);
    }

    showFilePreview() {
        const uploadZone = document.getElementById('uploadZone');
        const statusSection = document.getElementById('statusSection');
        
        // Hide upload zone and show preview
        uploadZone.style.display = 'none';
        statusSection.style.display = 'block';
        
        // Calculate stats
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        const imageFiles = this.files.filter(f => f.type.startsWith('image/')).length;
        const videoFiles = this.files.filter(f => f.type.startsWith('video/')).length;
        const documentFiles = this.files.filter(f => f.type.includes('pdf') || f.type.includes('word')).length;
        const designFiles = this.files.filter(f => f.type.includes('photoshop') || f.type.includes('illustrator') || f.type.includes('figma')).length;
        
        // Create preview content
        const previewHTML = `
            <div class="upload-preview">
                <h3>📁 Upload Preview</h3>
                <div class="preview-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Files:</span>
                        <span class="stat-value">${this.files.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Total Size:</span>
                        <span class="stat-value">${this.formatFileSize(totalSize)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Images:</span>
                        <span class="stat-value">${imageFiles}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Videos:</span>
                        <span class="stat-value">${videoFiles}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Documents:</span>
                        <span class="stat-value">${documentFiles}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Design Files:</span>
                        <span class="stat-value">${designFiles}</span>
                    </div>
                </div>
                
                <div class="file-list">
                    <h4>Selected Files:</h4>
                    <div class="file-preview-list">
                        ${this.files.map(file => `
                            <div class="file-preview-item">
                                <span class="file-icon">${this.getFileIcon(file.type)}</span>
                                <span class="file-name">${file.name}</span>
                                <span class="file-size">${this.formatFileSize(file.size)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="preview-actions">
                    <button class="btn btn-primary" id="startUploadBtn">
                        <i class="fas fa-upload"></i> Start Upload
                    </button>
                    <button class="btn btn-outline-primary" id="cancelUploadBtn">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        
        statusSection.innerHTML = previewHTML;
    }

    getFileIcon(fileType) {
        const lowerType = fileType.toLowerCase();
        const fileName = fileType.split('/').pop() || '';
        
        // Images
        if (lowerType.startsWith('image/')) {
            if (lowerType.includes('jpeg') || lowerType.includes('jpg')) return 'fa-file-image';
            if (lowerType.includes('png')) return 'fa-file-image';
            if (lowerType.includes('gif')) return 'fa-file-image';
            if (lowerType.includes('svg')) return 'fa-file-image';
            if (lowerType.includes('webp')) return 'fa-file-image';
            return 'fa-file-image';
        }
        
        // Videos
        if (lowerType.startsWith('video/')) {
            if (lowerType.includes('mp4')) return 'fa-file-video';
            if (lowerType.includes('mov')) return 'fa-file-video';
            if (lowerType.includes('avi')) return 'fa-file-video';
            if (lowerType.includes('webm')) return 'fa-file-video';
            return 'fa-file-video';
        }
        
        // Documents
        if (lowerType.includes('pdf')) return 'fa-file-pdf';
        if (lowerType.includes('word') || lowerType.includes('doc')) return 'fa-file-word';
        if (lowerType.includes('excel') || lowerType.includes('xls')) return 'fa-file-excel';
        if (lowerType.includes('powerpoint') || lowerType.includes('ppt')) return 'fa-file-powerpoint';
        if (lowerType.includes('text') || lowerType.includes('txt')) return 'fa-file-text';
        
        // Design Files
        if (lowerType.includes('photoshop') || lowerType.includes('psd')) return 'fa-file-image';
        if (lowerType.includes('illustrator') || lowerType.includes('ai')) return 'fa-file-image';
        if (lowerType.includes('indesign') || lowerType.includes('indd')) return 'fa-file-image';
        if (lowerType.includes('figma') || lowerType.includes('fig')) return 'fa-file-image';
        if (lowerType.includes('sketch')) return 'fa-file-image';
        if (lowerType.includes('xd')) return 'fa-file-image';
        
        // Archives
        if (lowerType.includes('zip') || lowerType.includes('rar') || lowerType.includes('7z')) return 'fa-file-archive';
        
        // Code/Development
        if (lowerType.includes('json') || lowerType.includes('xml') || lowerType.includes('html') || lowerType.includes('css') || lowerType.includes('js')) return 'fa-file-code';
        
        // Audio
        if (lowerType.startsWith('audio/')) return 'fa-file-audio';
        
        // Keynote (Apple)
        if (lowerType.includes('keynote') || lowerType.includes('key')) return 'fa-file-powerpoint';
        
        // Numbers (Apple)
        if (lowerType.includes('numbers') || lowerType.includes('numbers')) return 'fa-file-excel';
        
        // Pages (Apple)
        if (lowerType.includes('pages') || lowerType.includes('pages')) return 'fa-file-word';
        
        // Default
        return 'fa-file';
    }

    cancelUpload() {
        this.isCancelled = true;
        this.isProcessing = false;
        
        // Abort current upload if in progress
        if (this.currentUploadController) {
            this.currentUploadController.abort();
        }
        
        this.showNotification('Upload cancelled', 'warning');
        this.resetUpload();
    }

    showTerminatorHUD(totalSize, fileCount) {
        const uploadZone = document.getElementById('uploadZone');
        
        // Remove existing HUD if any
        const existingHUD = uploadZone.querySelector('.terminator-hud');
        if (existingHUD) {
            existingHUD.remove();
        }
        
        // Create Terminator-style HUD overlay
        const hud = document.createElement('div');
        hud.className = 'terminator-hud';
        
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(1);
        const estimatedTime = this.estimateUploadTime(totalSize);
        
        // Generate thumbnail previews
        const thumbnailPreviews = this.generateThumbnailPreviews();
        
        hud.innerHTML = `
            <div class="hud-corner hud-top-left"></div>
            <div class="hud-corner hud-top-right"></div>
            <div class="hud-corner hud-bottom-left"></div>
            <div class="hud-corner hud-bottom-right"></div>
            
            <div class="hud-content">
                <div class="hud-header">
                    <span class="hud-title">UPLOAD ANALYSIS</span>
                    <span class="hud-status">READY</span>
                </div>
                
                <div class="hud-main">
                    <div class="hud-left">
                        <div class="hud-metrics">
                            <div class="hud-metric">
                                <span class="metric-label">FILES DETECTED</span>
                                <span class="metric-value">${fileCount}</span>
                            </div>
                            <div class="hud-metric">
                                <span class="metric-label">TOTAL SIZE</span>
                                <span class="metric-value">${this.formatFileSize(totalSize)}</span>
                            </div>
                            <div class="hud-metric">
                                <span class="metric-label">EST. TIME</span>
                                <span class="metric-value">${estimatedTime}</span>
                            </div>
                            <div class="hud-metric">
                                <span class="metric-label">BANDWIDTH</span>
                                <span class="metric-value">${this.getBandwidthImpact(totalSize)}</span>
                            </div>
                        </div>
                        
                        <div class="hud-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span class="progress-text">AWAITING UPLOAD</span>
                        </div>
                    </div>
                    
                    <div class="hud-right">
                        <div class="thumbnail-scanner">
                            <div class="scanner-header">
                                <span class="scanner-title">FILE PREVIEW</span>
                                <div class="scanline"></div>
                            </div>
                            <div class="thumbnail-grid">
                                ${thumbnailPreviews}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        uploadZone.appendChild(hud);
        
        // Animate HUD appearance
        setTimeout(() => {
            hud.classList.add('active');
            this.startScanlineAnimation();
        }, 100);
    }

    generateThumbnailPreviews() {
        return this.files.slice(0, 6).map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const fileIcon = this.getFileIcon(file.type);
            const insights = this.generateFileInsights(file);
            
            return `
                <div class="thumbnail-item" data-index="${index}">
                    <div class="thumbnail-preview">
                        ${isImage ? `<img src="${URL.createObjectURL(file)}" alt="${file.name}" loading="lazy">` : ''}
                        ${isVideo ? `<video src="${URL.createObjectURL(file)}" muted></video>` : ''}
                        ${!isImage && !isVideo ? `<div class="file-icon"><i class="fas ${fileIcon}"></i></div>` : ''}
                        <div class="scanline-overlay"></div>
                    </div>
                    <div class="thumbnail-info">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <div class="file-insights">
                        ${insights.map(insight => `<span class="insight">${insight}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    generateFileInsights(file) {
        const insights = [];
        const sizeInMB = file.size / (1024 * 1024);
        
        // Size insights
        if (sizeInMB > 10) insights.push('LARGE FILE');
        if (sizeInMB > 50) insights.push('BANDWIDTH HEAVY');
        if (file.type.startsWith('video/')) insights.push('VIDEO CONTENT');
        if (file.type.startsWith('image/')) insights.push('VISUAL ASSET');
        if (file.name.includes('final') || file.name.includes('production')) insights.push('FINAL VERSION');
        if (file.name.includes('mockup') || file.name.includes('wireframe')) insights.push('DESIGN FILE');
        
        return insights.slice(0, 3); // Limit to 3 insights
    }

    startScanlineAnimation() {
        const scanlines = document.querySelectorAll('.scanline-overlay');
        scanlines.forEach((scanline, index) => {
            setTimeout(() => {
                scanline.style.animationDelay = `${index * 0.2}s`;
                scanline.classList.add('scanning');
            }, index * 100);
        });
    }

    estimateUploadTime(totalSize) {
        // Rough estimation based on average upload speeds
        const sizeInMB = totalSize / (1024 * 1024);
        
        if (sizeInMB < 10) return '< 30s';
        if (sizeInMB < 50) return '1-2min';
        if (sizeInMB < 100) return '2-5min';
        if (sizeInMB < 500) return '5-10min';
        return '10+ min';
    }

    getBandwidthImpact(totalSize) {
        const sizeInMB = totalSize / (1024 * 1024);
        
        if (sizeInMB < 10) return 'LOW';
        if (sizeInMB < 50) return 'MED';
        if (sizeInMB < 100) return 'HIGH';
        return 'EXTREME';
    }

    resetUpload() {
        this.isProcessing = false;
        this.files = [];
        document.getElementById('fileInput').value = '';
        document.getElementById('uploadZone').style.display = 'flex';
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
    }
}

// Global functions for HTML event handlers
function selectFiles() {
    document.getElementById('fileInput').click();
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
    instantUpload = new InstantUpload();
});
