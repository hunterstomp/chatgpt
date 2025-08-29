# Netlify Image Setup Guide

## 🖼️ **How to Get Netlify to Hook Up Images**

### **✅ Problem Solved!**

Your images are already in the correct location: `public/assets/case-studies/`. The issue was that your case study markdown files were referencing them from the wrong path.

### **🔧 What I Fixed:**

**Before (404 errors):**
```yaml
discoveryImages:
  - src: /case-studies/t-mobile-how-to-switch/image.jpg
```

**After (working):**
```yaml
discoveryImages:
  - src: /assets/case-studies/t-mobile-how-to-switch/image.jpg
```

## 📁 **Correct Image Structure for Netlify**

### **Your Current Structure (✅ Correct):**
```
public/
├── assets/
│   └── case-studies/
│       ├── t-mobile-how-to-switch/
│       │   ├── discovery-1.jpg
│       │   ├── research-1.jpg
│       │   └── wireframes.jpg
│       ├── atmos-fx-e-commerce-redesign/
│       │   ├── discovery-1.jpg
│       │   └── research-1.jpg
│       └── microsoft-office-live/
│           ├── discovery-1.jpg
│           └── research-1.jpg
```

### **How Netlify Serves Images:**

- **Public Directory**: Everything in `public/` gets served at the root URL
- **Assets Path**: `public/assets/` becomes `/assets/` in the browser
- **Case Studies**: `public/assets/case-studies/` becomes `/assets/case-studies/`

## 🚀 **Netlify Deployment Best Practices**

### **1. Image Optimization**
```bash
# Before deploying, optimize your images
# Use tools like:
# - ImageOptim (Mac)
# - TinyPNG (Web)
# - Squoosh (Google)
```

### **2. File Naming**
```bash
# ✅ Good naming
discovery-user-interviews.jpg
research-survey-results.png
wireframe-main-flow.webp

# ❌ Avoid spaces and special characters
discovery user interviews.jpg
research-survey-results (1).png
```

### **3. Image Formats**
- **WebP**: Best for web (smaller, faster)
- **PNG**: For images with transparency
- **JPG**: For photos (larger file sizes)

## 📝 **How to Update Other Case Studies**

### **Step 1: Check Your Case Study Folders**
```bash
ls public/assets/case-studies/
# You should see:
# - t-mobile-how-to-switch/
# - atmos-fx-e-commerce-redesign/
# - microsoft-office-live/
# - etc.
```

### **Step 2: Update Image Paths**
In each case study markdown file, change:
```yaml
# ❌ Old (404 errors)
src: /case-studies/[project-name]/image.jpg

# ✅ New (working)
src: /assets/case-studies/[project-name]/image.jpg
```

### **Step 3: Test Locally**
```bash
npm run dev
# Visit: http://localhost:4322/case-studies/[project-name]
```

## 🔍 **Troubleshooting**

### **If Images Still Don't Load:**

1. **Check File Names**: Ensure exact case sensitivity
2. **Check File Extensions**: `.jpg` vs `.jpeg` vs `.png`
3. **Check Paths**: Verify the folder structure matches
4. **Clear Cache**: Hard refresh (Ctrl+F5 / Cmd+Shift+R)

### **Common Issues:**

```bash
# ❌ Wrong path
src: /case-studies/t-mobile-how-to-switch/image.jpg

# ✅ Correct path
src: /assets/case-studies/t-mobile-how-to-switch/image.jpg
```

## 🎯 **Quick Fix Script**

If you have many case studies to update, you can use this pattern:

```bash
# Find all case study markdown files
find src/pages/case-studies -name "*.md" -type f

# Replace paths in all files
sed -i 's|/case-studies/|/assets/case-studies/|g' src/pages/case-studies/*.md
```

## 📊 **Image Performance Tips**

### **1. Lazy Loading**
Your images already have `loading="lazy"` - great!

### **2. Responsive Images**
```html
<img 
  src="/assets/case-studies/project/image.jpg"
  srcset="/assets/case-studies/project/image-800.jpg 800w,
          /assets/case-studies/project/image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Description"
/>
```

### **3. Image Compression**
- **WebP**: 25-35% smaller than JPG
- **PNG**: Use for graphics with transparency
- **JPG**: Use for photos only

## 🚀 **Deploy to Netlify**

### **1. Build Your Site**
```bash
npm run build
```

### **2. Deploy**
```bash
# If using Netlify CLI
netlify deploy --prod

# Or push to GitHub and let Netlify auto-deploy
git add .
git commit -m "Fix image paths for Netlify"
git push
```

### **3. Verify**
- Check your Netlify dashboard
- Visit your live site
- Verify images load correctly

## ✅ **Summary**

Your images are already in the right place! The issue was just the path references in your markdown files. I've fixed the T-Mobile case study, and you can apply the same pattern to your other case studies:

**Change from:**
```yaml
src: /case-studies/[project]/image.jpg
```

**To:**
```yaml
src: /assets/case-studies/[project]/image.jpg
```

This will work perfectly with Netlify deployment! 🎉
