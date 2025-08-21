# 🚀 Q10UX Portfolio - Cliff Notes

## Quick Start
```bash
# Start everything
./scripts/start.sh

# Or manually:
npm install
node backend/admin-server.js &  # Backend (port 3001)
python3 -m http.server 8001    # Frontend (port 8001)
```

## 🔑 Admin Access
- **URL**: http://localhost:8001/src/admin/
- **Login**: Set in environment variables (see .env.example)
- **Token**: Stored in localStorage as `adminToken`

## 📁 Main Interfaces

### 1. **Admin Panel** (`/src/admin/`)
- Create case studies
- Bulk upload images
- NDA management
- Project management

### 2. **Serial Upload** (`/src/serial-upload/`)
- Drag & drop image series
- Add descriptions
- Lightbox carousel
- Publish to case studies

### 3. **Instant Upload** (`/src/instant-upload/`)
- Quick file upload
- Auto-detection
- Terminator HUD preview

## 🎯 Key Workflows

### Create & Publish Case Study
1. **Admin Panel** → Create New Case Study
2. **Serial Upload** → Upload images + descriptions
3. **Publish** → Select case study → Done!

### Quick Upload
1. **Admin Panel** → Quick Upload
2. **Select case study** → Choose files
3. **Upload** → Auto-processed

## 🔧 Backend API
- **Port**: 3001
- **Auth**: JWT Bearer token
- **Data**: `backend/data/projects.json`
- **Uploads**: `backend/uploads/`

## 📊 File Structure
```
src/
├── admin/           # Admin dashboard
├── serial-upload/   # Series management
├── instant-upload/  # Quick upload
├── case-studies/    # Portfolio pages
└── styles/          # CSS files

backend/
├── admin-server.js  # Main API server
├── data/           # JSON storage
└── uploads/        # Processed images
```

## 🚨 Common Issues
- **Port conflicts**: `killall -9 node python3`
- **Auth issues**: Clear localStorage, re-login
- **Upload fails**: Check file permissions

## 💡 Pro Tips
- Use **Serial Upload** for curated series
- Use **Quick Upload** for bulk images
- **NDA codes**: NDA2024, CONFIDENTIAL, INTERNAL
- **Auto-save**: Series state saved to localStorage

## 🔒 Security Notes
- **Change default credentials** before production use
- **Set environment variables** for admin access
- **Never commit .env files** to Git
- **Use strong passwords** and JWT secrets

---
*Need more details? See README.md*
