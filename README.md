# 🎨 Q10UX Portfolio - Professional UX Case Study Management System

A comprehensive, branded portfolio system for managing and presenting UX case studies with advanced image processing, NDA protection, and automated workflows.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.7+
- Git

### Installation & Launch
```bash
# Clone and setup
git clone <your-repo>
cd chatgpt

# One-command startup
./scripts/start.sh

# Or manual setup:
npm install
node backend/admin-server.js &  # Backend (port 3001)
python3 -m http.server 8001    # Frontend (port 8001)
```

### Access Points
- **Portfolio**: http://localhost:8001/
- **Admin Panel**: http://localhost:8001/src/admin/
- **Serial Upload**: http://localhost:8001/src/serial-upload/
- **Instant Upload**: http://localhost:8001/src/instant-upload/

## 🏗️ System Architecture

### Frontend Components
```
src/
├── admin/                 # Admin dashboard interface
├── serial-upload/         # Professional series management
├── instant-upload/        # Quick bulk upload system
├── case-studies/          # Individual case study pages
├── components/            # Reusable UI components
├── styles/               # Global CSS and design system
└── partials/             # Header/footer templates
```

### Backend Services
```
backend/
├── admin-server.js       # Main API server (Express.js)
├── data/                # JSON-based data storage
│   ├── projects.json    # Case study metadata
│   ├── images.json      # Image metadata
│   └── nda-sessions.json # NDA access tracking
└── uploads/             # Processed image storage
    ├── thumbnails/      # Optimized thumbnails
    ├── full/           # High-res versions
    └── webp/           # WebP conversions
```

## 🎯 Core Features

### 1. **Admin Dashboard** (`/src/admin/`)
**Purpose**: Central management hub for case studies and content

**Key Features**:
- **Case Study Creation**: Create new projects with metadata
- **Bulk Image Upload**: Drag & drop multiple images with auto-processing
- **NDA Management**: Protect sensitive content with access codes
- **Project Management**: View, edit, and organize case studies
- **Bulk Tagging**: Apply UX phase tags to multiple images
- **Flow Privacy**: Control access to specific process phases

**Authentication**:
- Username: `admin`
- Password: `password`
- JWT-based session management

### 2. **Serial Upload System** (`/src/serial-upload/`)
**Purpose**: Professional image series management with descriptions

**Key Features**:
- **Drag & Drop Interface**: Intuitive file selection
- **Lightbox Carousel**: Full-screen image viewing with navigation
- **Description Management**: Add/edit descriptions for each image
- **AI Description Suggestions**: Automated caption generation
- **Linear & Non-Linear Navigation**: Smart suggestions and project grouping
- **Publishing Integration**: Direct publishing to case studies
- **State Persistence**: Auto-save progress to localStorage

**Navigation Modes**:
- **Linear**: Sequential navigation (first to last)
- **Smart**: AI-powered suggestions based on image properties
- **Project**: Grouped navigation by project criteria

### 3. **Instant Upload System** (`/src/instant-upload/`)
**Purpose**: Quick bulk upload with automated processing

**Key Features**:
- **Terminator HUD**: Dynamic file analysis overlay
- **Auto-Detection**: Project and tag detection from filenames
- **Performance Optimization**: Multiple image sizes and formats
- **Progress Tracking**: Real-time upload progress
- **File Size Preview**: Pre-upload size estimation
- **Cancellable Uploads**: Abort uploads mid-process

### 4. **Portfolio Presentation**
**Purpose**: Public-facing case study display

**Key Features**:
- **Responsive Design**: Mobile-optimized layouts
- **NDA Protection**: Access control for sensitive content
- **Optimized Galleries**: Performance-optimized image loading
- **Interactive Tours**: Guided feature walkthroughs
- **Accessibility**: WCAG 2.1 AA compliant

## 🔧 Technical Implementation

### Backend API Endpoints

#### Authentication
- `POST /api/admin/login` - Admin authentication
- `POST /api/validate-nda` - NDA code validation

#### Project Management
- `GET /api/admin/projects` - List all projects
- `POST /api/admin/projects` - Create new project
- `GET /api/projects` - Public project list (NDA-filtered)

#### Image Management
- `POST /api/admin/projects/:id/images` - Upload images to project
- `POST /api/admin/projects/:id/bulk-tag` - Apply bulk tags
- `POST /api/admin/publish-series` - Publish image series

#### NDA Management
- `GET /api/admin/nda-stats` - NDA usage statistics
- `POST /api/admin/flow-privacy` - Update flow privacy settings

### Data Storage
**File-based JSON storage** (easily upgradable to database):
- `projects.json`: Case study metadata and structure
- `images.json`: Image metadata and processing info
- `nda-sessions.json`: NDA access tracking

### Image Processing Pipeline
1. **Upload**: Multer handles file uploads
2. **Validation**: File type and size checks
3. **Processing**: Sharp generates multiple sizes
4. **Optimization**: WebP conversion and compression
5. **Metadata**: Extraction and storage
6. **Thumbnails**: Auto-generated for galleries

## 🎨 Design System

### Typography
- **Primary**: Roboto Condensed (all caps, optical kerning)
- **Secondary**: Barlow Condensed
- **Display**: Orbitron (headers)
- **Body**: Inter

### Color Palette
```css
--serial-primary: #007bff;    /* Blue accent */
--serial-surface: #1a1f2e;    /* Dark surface */
--serial-bg: #0a0e1a;         /* Background */
--serial-text: #ffffff;       /* Text */
--serial-muted: #a0aec0;      /* Muted text */
```

### Components
- **Buttons**: Capsule-shaped with consistent padding
- **Cards**: Subtle shadows with hover effects
- **Modals**: Backdrop blur with smooth animations
- **Forms**: Clean, accessible input styling

## 🔐 Security & Privacy

### NDA Protection System
**Access Codes**:
- `NDA2024`: 2024 NDA Access (expires 2025-12-31)
- `CONFIDENTIAL`: Confidential Access (expires 2025-06-30)
- `INTERNAL`: Internal Use Only (expires 2025-12-31)

**Implementation**:
- Project-level NDA requirements
- Flow-level privacy controls
- Session-based access tracking
- Automatic expiration handling

### Authentication
- JWT-based admin authentication
- Secure token storage in localStorage
- Automatic token validation
- Session timeout handling

## 📊 Performance Optimization

### Image Processing
- **Multiple Sizes**: Full, large, medium, thumbnail, preview
- **Format Conversion**: WebP for modern browsers
- **Lazy Loading**: Progressive image loading
- **Compression**: Optimized file sizes

### Frontend Optimization
- **CSS Variables**: Consistent theming
- **Minified Assets**: Production-ready builds
- **Efficient DOM**: Minimal reflows and repaints
- **Caching**: Browser and localStorage caching

## 🚨 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Kill existing processes
killall -9 node python3

# Restart servers
./scripts/start.sh
```

#### Authentication Issues
```javascript
// Clear localStorage and re-login
localStorage.clear();
// Navigate to /src/admin/ and login again
```

#### Upload Failures
- Check file permissions on `backend/uploads/`
- Verify Node.js dependencies: `npm install`
- Check console for specific error messages

#### Image Processing Errors
- Ensure Sharp is installed: `npm install sharp`
- Check available disk space
- Verify image file integrity

### Debug Mode
```bash
# Enable debug logging
export TASKMASTER_LOG_LEVEL=debug
node backend/admin-server.js
```

## 🔄 Development Workflow

### Adding New Features
1. **Frontend**: Add UI components in `src/`
2. **Backend**: Add API endpoints in `backend/admin-server.js`
3. **Styling**: Update CSS in `src/styles/`
4. **Testing**: Test in browser and verify functionality
5. **Commit**: Use descriptive commit messages

### File Organization
- **Components**: Reusable UI elements in `src/components/`
- **Styles**: Global styles in `src/styles/`
- **Scripts**: Utility scripts in `scripts/`
- **Data**: JSON storage in `backend/data/`

## 📈 Future Enhancements

### Planned Features
- **Database Integration**: PostgreSQL/MongoDB migration
- **Cloud Storage**: AWS S3/Cloudinary integration
- **AI Enhancement**: Advanced caption generation
- **Analytics**: Usage tracking and insights
- **Export**: PDF/PPT case study generation

### Scalability Considerations
- **Microservices**: Separate image processing service
- **CDN**: Global content delivery
- **Caching**: Redis for session management
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

### Code Standards
- **ES6+**: Modern JavaScript features
- **Semantic HTML**: Accessible markup
- **CSS Variables**: Consistent theming
- **Error Handling**: Comprehensive error management
- **Documentation**: Inline code comments

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

## 📄 License

This project is proprietary to Q10UX. All rights reserved.

---

## 🎯 Quick Reference

### Essential Commands
```bash
./scripts/start.sh          # Start everything
npm install                 # Install dependencies
git add . && git commit     # Save changes
```

### Key URLs
- **Portfolio**: http://localhost:8001/
- **Admin**: http://localhost:8001/src/admin/
- **Serial Upload**: http://localhost:8001/src/serial-upload/

### Default Credentials
- **Admin**: `admin` / `password`
- **NDA Codes**: `NDA2024`, `CONFIDENTIAL`, `INTERNAL`

---

*For quick reference, see [CLIFF_NOTES.md](CLIFF_NOTES.md)*
