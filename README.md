# Q10UX Professional Portfolio System

A comprehensive UX portfolio platform with NDA firewall protection, bulk tagging, and **intelligent Smart Upload System** for effortless media management.

## 🚀 Features

### Core Portfolio
- **High-contrast, accessible design** following WCAG 2.1 AA standards
- **Responsive layout** optimized for all devices
- **SEO optimized** with structured data and meta tags
- **Professional case study showcase** with detailed UX process documentation

### 🎯 Smart Upload System (NEW!)
- **Toddler-friendly drag & drop** interface - so simple anyone can use it!
- **Intelligent automation** - automatically detects projects and tags from filenames
- **Real-time progress tracking** with beautiful animations
- **Multiple processing modes**: Quick Upload, Watch Folder, Batch Processing
- **Cloud integration** with AWS S3 and Sanity CMS
- **Video processing** with automatic thumbnail generation
- **Smart file organization** into 8 UX workflow phases

### NDA Firewall System
- **Project-level NDA protection** - entire case studies can be protected
- **Flow-level privacy controls** - specific UX phases can be NDA-protected
- **Multiple NDA codes** with expiration dates
- **Public/private content filtering** based on access permissions

### Admin System
- **Secure admin interface** with JWT authentication
- **Bulk image upload** with automatic processing
- **UX deliverable tagging** - 17 professional categories
- **Performance optimization** - multiple image sizes (full, large, medium, thumbnail, preview)
- **WebP format** for optimal compression and loading

### Bulk Tagging & Organization
- **17 UX deliverable categories** including:
  - Research: User Research, Competitive Analysis, User Personas
  - Ideation: Information Architecture, User Flows, Wireframes
  - Design: Visual Design, Prototypes, Design Systems
  - Testing: Usability Testing, Accessibility Testing, Performance Testing
  - Implementation: Design Handoff, Development Support
  - Results: Analytics & Metrics, User Feedback
- **Automatic flow detection** from filenames
- **Bulk tagging interface** for efficient organization
- **Custom tag support** for project-specific categorization

## 📁 Project Structure

```
q10ux-portfolio/
├── src/                          # Frontend portfolio files
│   ├── index.html               # Main portfolio homepage
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── case-studies/            # Individual case study pages
│   ├── admin/                   # Admin interface
│   ├── smart-upload/            # 🆕 Smart Upload Interface
│   │   ├── index.html          # Drag & drop interface
│   │   ├── smart-upload.css    # Beautiful UI styles
│   │   └── smart-upload.js     # Intelligent automation
│   ├── partials/               # Reusable components
│   ├── styles/                 # CSS files
│   └── scripts/                # JavaScript files
├── backend/                     # Server-side code
│   └── admin-server.js         # Main admin server
├── scripts/                     # 🆕 Automation scripts
│   ├── smart-upload.js         # CLI automation tool
│   └── setup.sh                # One-click setup script
├── uploads/                     # 🆕 Upload directory (auto-created)
├── processed/                   # 🆕 Processed files (auto-created)
├── archive/                     # Archived development files
└── package.json               # Project configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- Python 3+ (for local development server)
- MAMP (for image assets)

### 🚀 One-Click Setup (Recommended)

```bash
# Clone and setup everything automatically
git clone https://github.com/quentstyle/q10ux-portfolio.git
cd q10ux-portfolio
./scripts/setup.sh
```

This will:
- ✅ Install all Node.js dependencies
- ✅ Install system dependencies (ffmpeg, ImageMagick)
- ✅ Create necessary directories
- ✅ Set up environment variables
- ✅ Make scripts executable
- ✅ Create global symlinks

### Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/quentstyle/q10ux-portfolio.git
   cd q10ux-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install system dependencies**
   ```bash
   # macOS
   brew install ffmpeg imagemagick
   
   # Linux
   sudo apt-get update && sudo apt-get install -y ffmpeg imagemagick
   ```

4. **Set up image assets**
   ```bash
   mkdir -p public
   ln -s "/Applications/MAMP/htdocs/Q10UXPortfolio/assets/images" "public/mamp-images"
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

6. **Start the system**
   ```bash
   npm run admin    # Start admin server
   npm run serve    # Start frontend server
   ```

### Access URLs
- **Portfolio**: http://localhost:8001/src/
- **Smart Upload**: http://localhost:8001/src/smart-upload/ 🆕
- **Admin**: http://localhost:8001/src/admin/
- **Admin API**: http://localhost:3001/

## 🎯 Smart Upload System Guide

### 🎨 Interface Overview

The Smart Upload System is designed to be **incredibly intuitive** - like using a modern photo app!

#### Main Features:
- **Drag & Drop Zone**: Simply drag files or folders onto the upload area
- **Smart Detection**: Automatically detects projects and tags from filenames
- **Real-time Preview**: See your files before processing
- **Progress Tracking**: Beautiful progress bars with live updates
- **Cloud Integration**: Automatic upload to AWS S3 or Sanity

### 📁 Upload Modes

#### 1. Quick Upload (Drag & Drop)
```bash
# Just drag files onto the interface!
# Or click "Choose Files" to browse
```

#### 2. Watch Folder (Auto-processing)
```bash
# Drop files in the uploads/ folder
# They'll be processed automatically!
```

#### 3. Batch Processing
```bash
# Process entire folders at once
npm run smart-upload
# Then select "Batch Process Existing Files"
```

#### 4. CLI Automation
```bash
# Run the CLI tool directly
q10ux-smart-upload
```

### 🧠 Smart Features

#### Automatic Project Detection
The system automatically detects which project your files belong to:

| Filename Contains | Detected Project |
|------------------|------------------|
| `atmosfx-` | AtmosFX Media Player |
| `tmobile-` | T-Mobile How to Switch |
| `office-` | Office Live Workspaces |
| `microsoft-` | Microsoft Office 365 |
| `bmgf-` | Bill & Melinda Gates Foundation |
| `att-` | AT&T International Roaming |

#### Automatic Tag Detection
Files are automatically tagged based on their names:

| Filename Contains | Detected Tag |
|------------------|--------------|
| `user-research-` | User Research |
| `wireframe-` | Wireframes |
| `prototype-` | Prototypes |
| `usability-` | Usability Testing |
| `accessibility-` | Accessibility Testing |
| `design-` | Visual Design |

#### File Processing
Each file is automatically processed into multiple sizes:

- **Full**: 1920x1080 (for high-res display)
- **Large**: 1200x800 (for desktop)
- **Medium**: 800x600 (for tablet)
- **Thumbnail**: 400x300 (for galleries)
- **Preview**: 200x150 (for lists)

All images are converted to WebP for optimal performance!

### 🎬 Video Processing

Videos are automatically processed with:
- **Thumbnail generation** (first frame)
- **Optimized compression** (H.264, AAC)
- **Metadata extraction** (duration, resolution, etc.)

### ☁️ Cloud Integration

#### AWS S3 Setup
```bash
# Add to .env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=your-bucket-name
```

#### Sanity CMS Setup
```bash
# Add to .env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_TOKEN=your-token
```

### 🔧 Configuration

#### Settings Panel
Access settings via the gear icon:
- **Default Project**: Set your most-used project
- **Auto Cloud Upload**: Enable/disable automatic cloud sync
- **Image Quality**: Choose between high/medium/low quality
- **Processing Priority**: Speed vs. quality trade-offs

#### Environment Variables
```bash
# Required
JWT_SECRET=your-secret-key

# Optional (for cloud features)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
SANITY_PROJECT_ID=your-sanity-project
SANITY_TOKEN=your-sanity-token
```

## 🔐 Admin System

### Login Credentials
- **Username**: `admin`
- **Password**: `password`

### Key Features

#### NDA Management
- **NDA Codes Available**:
  - `NDA2024` - 2024 NDA Access (Expires: Dec 31, 2025)
  - `CONFIDENTIAL` - Confidential Access (Expires: Jun 30, 2025)
  - `INTERNAL` - Internal Use Only (Expires: Dec 31, 2025)

#### Bulk Tagging Categories
- **Research Phase**: User Research, Competitive Analysis, User Personas
- **Ideation Phase**: Information Architecture, User Flows, Wireframes
- **Design Phase**: Visual Design, Prototypes, Design Systems
- **Testing Phase**: Usability Testing, Accessibility Testing, Performance Testing
- **Implementation Phase**: Design Handoff, Development Support
- **Results Phase**: Analytics & Metrics, User Feedback
- **Additional**: Screenshots, Process Documentation

#### Image Processing
- **Automatic sizing**: Full (1920x1080), Large (1200x800), Medium (800x600), Thumbnail (400x300), Preview (200x150)
- **WebP optimization**: Automatic conversion with quality settings
- **Metadata preservation**: Original image information stored
- **Responsive support**: Multiple sizes for different use cases

## 🎨 Design System

### Typography
- **Primary**: Inter (400, 600, 800)
- **Secondary**: Roboto Condensed (400, 700)
- **Accent**: Barlow Condensed (400, 600)
- **Display**: Permanent Marker

### Color Palette
- **Background**: #0a0a0a (Dark)
- **Surface**: #1a1a1a (Medium Dark)
- **Primary**: #00d4ff (Cyan)
- **Success**: #00ff88 (Green)
- **Warning**: #ffaa00 (Orange)
- **Danger**: #ff4444 (Red)
- **Text**: #ffffff (White)
- **Muted**: #888888 (Gray)

### Accessibility
- **WCAG 2.1 AA compliance**
- **High contrast design**
- **Keyboard navigation support**
- **Screen reader optimization**
- **Reduced motion support**

## 📱 Case Study Structure

Each case study includes:
- **Hero section** with project overview
- **UX process phases** with tagged images
- **Design gallery** with lightbox functionality
- **Results and impact** documentation
- **NDA protection** (if applicable)

### Image Organization
Images are automatically organized into 8 flow categories:
1. **Research & Discovery**
2. **Ideation & Concepts**
3. **Design & Prototyping**
4. **Testing & Validation**
5. **Implementation & Handoff**
6. **Results & Impact**
7. **Additional Screenshots**
8. **Process Documentation**

## 🔧 Development

### Adding New Case Studies
1. Create a new folder in `src/case-studies/[project-name]/`
2. Add `index.html` with case study content
3. Use the Smart Upload system to upload and tag images
4. Set NDA protection if needed

### Customizing the Design
- **Main styles**: Edit `src/styles/q10ux.css`
- **Admin styles**: Edit `src/admin/admin.css`
- **Smart Upload styles**: Edit `src/smart-upload/smart-upload.css`
- **Components**: Modify `src/partials/` files

### API Endpoints

#### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create/update project
- `POST /api/admin/projects/:id/images` - Upload images
- `POST /api/admin/projects/:id/bulk-tag` - Bulk tag images
- `DELETE /api/admin/images/:id` - Delete image

#### Public Endpoints
- `GET /api/gallery/:slug` - Get project gallery (NDA-protected)
- `GET /api/projects` - List public projects
- `POST /api/validate-nda` - Validate NDA code

## 🚀 Deployment

### SFTP Upload
1. **Clean the project** (remove archive/, node_modules/, etc.)
2. **Upload to web server** via SFTP
3. **Set up environment variables** for production
4. **Configure server** to run Node.js backend

### Production Setup
```bash
# Install production dependencies
npm install --production

# Set environment variables
export JWT_SECRET="your-secure-jwt-secret"
export PORT=3001

# Start the server
npm start
```

### Environment Variables
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)

## 📋 File Guidelines

### Image Naming Convention
For automatic tagging, use descriptive filenames:
- `user-research-interview-notes.jpg`
- `wireframe-homepage-v2.png`
- `prototype-user-flow-mobile.fig`
- `usability-testing-feedback-summary.pdf`

### Supported Formats
- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MOV, AVI
- **Documents**: PDF (for process documentation)
- **Max file size**: 50MB per file
- **Batch upload**: Up to 100 files at once

## 🔒 Security Features

- **JWT authentication** for admin access
- **NDA code validation** with expiration dates
- **File upload validation** and sanitization
- **CORS protection** for API endpoints
- **Rate limiting** on sensitive endpoints

## 📞 Support

For technical support or questions about the portfolio system:
- **Email**: [Your email]
- **Documentation**: See `Q10UX_Playbook.md` for design guidelines
- **Image Guidelines**: See `IMAGE_GUIDELINES.md` for asset requirements

## 📄 License

MIT License - see LICENSE file for details.

---

**Q10UX Portfolio System** - Professional UX showcase with enterprise-grade security, intelligent automation, and toddler-friendly interfaces! 🎨✨
