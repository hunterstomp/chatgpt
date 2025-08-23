# 🎯 Q10UX Smart Upload System - Complete Guide

## Overview

The Q10UX Smart Upload System is designed to be **incredibly intuitive and automation-friendly** - like having a personal assistant for your UX portfolio! It handles all the heavy lifting of media processing, organization, and cloud integration.

## 🚀 Quick Start

### 1. One-Click Setup
```bash
git clone https://github.com/quentstyle/q10ux-portfolio.git
cd q10ux-portfolio
./scripts/setup.sh
```

### 2. Start the System
```bash
npm run admin    # Start backend server
npm run serve    # Start frontend server
```

### 3. Access Smart Upload
Open http://localhost:8001/src/smart-upload/ in your browser

## 🎨 Interface Walkthrough

### Main Upload Zone
- **Drag & Drop**: Simply drag files or folders onto the upload area
- **Click to Browse**: Click "Choose Files" to select files manually
- **Visual Feedback**: Beautiful animations show when files are being processed

### Smart Detection
The system automatically detects:
- **Project**: Which case study the files belong to
- **Tags**: What type of UX work the files represent
- **Processing**: How to optimize and organize the files

### Progress Tracking
Real-time progress bars show:
- **Image Processing**: Converting to multiple sizes
- **Video Processing**: Generating thumbnails and optimizing
- **Cloud Upload**: Syncing to AWS S3 or Sanity

## 📁 Upload Modes

### Mode 1: Quick Upload (Web Interface)
**Best for**: Small batches, immediate feedback
```bash
1. Open http://localhost:8001/src/smart-upload/
2. Drag files onto the upload zone
3. Review auto-detected settings
4. Click "Start Processing"
5. Watch real-time progress
```

### Mode 2: Watch Folder (Auto-processing)
**Best for**: Continuous workflow, bulk uploads
```bash
1. Drop files in the uploads/ folder
2. Files are processed automatically
3. No manual intervention needed
4. Perfect for ongoing projects
```

### Mode 3: Batch Processing (CLI)
**Best for**: Large folders, automation
```bash
npm run smart-upload
# Select "Batch Process Existing Files"
# Choose folder to process
# Set processing options
# Let it run in background
```

### Mode 4: CLI Automation (Advanced)
**Best for**: Scripts, automation, power users
```bash
q10ux-smart-upload
# Interactive menu with all options
# Perfect for automation scripts
```

## 🧠 Smart Features

### Automatic Project Detection
The system reads your filenames and automatically assigns them to the right project:

| Filename Pattern | Detected Project | Example |
|------------------|------------------|---------|
| `atmosfx-*` | AtmosFX Media Player | `atmosfx-wireframes-v2.png` |
| `tmobile-*` | T-Mobile How to Switch | `tmobile-user-research.jpg` |
| `office-*` | Office Live Workspaces | `office-prototype-mobile.fig` |
| `microsoft-*` | Microsoft Office 365 | `microsoft-design-system.pdf` |
| `bmgf-*` | Bill & Melinda Gates Foundation | `bmgf-usability-testing.mp4` |
| `att-*` | AT&T International Roaming | `att-wireframe-homepage.png` |

### Automatic Tag Detection
Files are automatically tagged based on their content:

| Filename Pattern | Detected Tag | UX Phase |
|------------------|--------------|----------|
| `*research*` | User Research | Research |
| `*interview*` | User Research | Research |
| `*survey*` | User Research | Research |
| `*wireframe*` | Wireframes | Ideation |
| `*prototype*` | Prototypes | Design |
| `*design*` | Visual Design | Design |
| `*usability*` | Usability Testing | Testing |
| `*testing*` | Usability Testing | Testing |
| `*accessibility*` | Accessibility Testing | Testing |
| `*a11y*` | Accessibility Testing | Testing |

### Intelligent File Processing
Each file is automatically processed into multiple optimized versions:

#### Image Processing
```
Original: user-research-interview.jpg (2.5MB)
├── user-research-interview-full.webp (1.2MB)
├── user-research-interview-large.webp (800KB)
├── user-research-interview-medium.webp (400KB)
├── user-research-interview-thumb.webp (100KB)
└── user-research-interview-preview.webp (50KB)
```

#### Video Processing
```
Original: usability-testing-session.mp4 (50MB)
├── usability-testing-session-optimized.mp4 (15MB)
├── usability-testing-session-thumb.jpg (50KB)
└── usability-testing-session-metadata.json
```

## ☁️ Cloud Integration

### AWS S3 Setup
1. **Create S3 Bucket**
   ```bash
   # In AWS Console or CLI
   aws s3 mb s3://q10ux-portfolio-assets
   ```

2. **Configure Environment**
   ```bash
   # Add to .env file
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-west-2
   AWS_S3_BUCKET=q10ux-portfolio-assets
   ```

3. **Automatic Upload**
   - Files are automatically uploaded to S3
   - Organized by project and date
   - CDN-ready URLs generated

### Sanity CMS Setup
1. **Create Sanity Project**
   ```bash
   npm create sanity@latest -- --template clean --create-project "Q10UX Portfolio"
   ```

2. **Configure Environment**
   ```bash
   # Add to .env file
   SANITY_PROJECT_ID=your-project-id
   SANITY_DATASET=production
   SANITY_TOKEN=your-token
   ```

3. **Automatic Sync**
   - Files are automatically synced to Sanity
   - Metadata preserved
   - Ready for content management

## 🔧 Configuration

### Settings Panel
Access via the gear icon (⚙️) in the Smart Upload interface:

#### Processing Options
- **Image Quality**: High (85%), Medium (75%), Low (60%)
- **Processing Priority**: Speed, Quality, or Balanced
- **Auto Cloud Upload**: Enable/disable automatic cloud sync
- **Default Project**: Set your most-used project

#### Advanced Options
- **Batch Size**: Number of files to process simultaneously
- **Retry Attempts**: How many times to retry failed uploads
- **File Size Limits**: Maximum file size for processing
- **Supported Formats**: Which file types to process

### Environment Variables
```bash
# Required
JWT_SECRET=your-super-secret-jwt-key

# Optional (for cloud features)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=your-s3-bucket-name

SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_TOKEN=your-sanity-token

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📋 File Guidelines

### Naming Conventions
For best automatic detection, use descriptive filenames:

#### Good Examples
```
user-research-interview-notes-2024-01-15.jpg
wireframe-homepage-v2-desktop.png
prototype-mobile-user-flow.fig
usability-testing-feedback-summary.pdf
accessibility-audit-results.docx
```

#### Avoid
```
IMG_001.jpg
screenshot.png
file.pdf
```

### Supported Formats
- **Images**: JPG, JPEG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MOV, AVI
- **Documents**: PDF, DOC, DOCX (for process documentation)
- **Design Files**: FIG, SKETCH, XD (thumbnails generated)

### File Size Limits
- **Individual Files**: Up to 50MB
- **Batch Upload**: Up to 100 files at once
- **Total Batch Size**: Up to 2GB per batch

## 🎬 Video Processing

### Automatic Features
- **Thumbnail Generation**: First frame extracted as JPG
- **Optimization**: H.264 video, AAC audio
- **Metadata Extraction**: Duration, resolution, codec info
- **Multiple Qualities**: High, medium, low quality versions

### Video Settings
```bash
# High Quality (default)
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k output.mp4

# Medium Quality
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# Low Quality (fast processing)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k output.mp4
```

## 🔒 Security & Privacy

### NDA Protection
- **Project-level**: Entire case studies can be NDA-protected
- **Flow-level**: Specific UX phases can be NDA-protected
- **Access Codes**: Multiple NDA codes with expiration dates
- **Public Filtering**: Automatic filtering based on access permissions

### File Security
- **Upload Validation**: File type and size validation
- **Virus Scanning**: Optional virus scanning for uploaded files
- **Access Control**: JWT-based authentication for admin access
- **Rate Limiting**: Protection against abuse

## 🚀 Performance Optimization

### Image Optimization
- **WebP Conversion**: Automatic conversion for better compression
- **Multiple Sizes**: Responsive images for different devices
- **Lazy Loading**: Images load only when needed
- **CDN Ready**: Optimized for content delivery networks

### Processing Speed
- **Parallel Processing**: Multiple files processed simultaneously
- **Background Processing**: Non-blocking file operations
- **Progress Tracking**: Real-time feedback on processing status
- **Resume Capability**: Can resume interrupted uploads

## 📊 Monitoring & Analytics

### Processing Statistics
- **Files Processed**: Total number of files processed
- **Processing Time**: Average time per file
- **Success Rate**: Percentage of successful uploads
- **Storage Used**: Total storage space used

### Error Tracking
- **Failed Uploads**: List of files that failed to upload
- **Error Messages**: Detailed error information
- **Retry Logic**: Automatic retry for failed uploads
- **Manual Recovery**: Options to manually retry failed files

## 🔧 Troubleshooting

### Common Issues

#### Files Not Uploading
```bash
# Check file size limits
# Verify supported formats
# Check network connection
# Review error logs
```

#### Processing Slow
```bash
# Reduce batch size
# Lower image quality settings
# Check system resources
# Use faster processing priority
```

#### Cloud Upload Fails
```bash
# Verify credentials in .env
# Check network connectivity
# Verify bucket permissions
# Review cloud provider status
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run admin

# Check logs
tail -f logs/upload.log
```

## 🎯 Best Practices

### File Organization
1. **Use Descriptive Names**: Include project, type, and date
2. **Consistent Formatting**: Use hyphens, not spaces or underscores
3. **Version Control**: Include version numbers in filenames
4. **Date Stamps**: Include dates for chronological organization

### Workflow Optimization
1. **Batch Similar Files**: Group related files together
2. **Use Watch Folder**: For ongoing projects
3. **Set Default Project**: For frequently used projects
4. **Enable Cloud Sync**: For backup and sharing

### Performance Tips
1. **Optimize Before Upload**: Compress large files first
2. **Use WebP**: For better compression
3. **Batch Process**: Upload multiple files at once
4. **Monitor Storage**: Keep track of space usage

## 📞 Support

### Getting Help
- **Documentation**: This guide and README.md
- **Interface Help**: Click the "Help" button in Smart Upload
- **Error Messages**: Check console and logs for details
- **Community**: GitHub issues for bug reports

### Feature Requests
- **GitHub Issues**: Submit feature requests
- **Pull Requests**: Contribute improvements
- **Documentation**: Help improve guides

---

**Q10UX Smart Upload System** - Making media management as easy as drag and drop! 🎨✨
