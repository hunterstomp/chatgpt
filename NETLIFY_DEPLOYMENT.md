# 🚀 Netlify Deployment Guide for Q10UX Portfolio

This guide will help you deploy your Q10UX portfolio to Netlify.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Netlify CLI** (optional): For command-line deployment

## 🎯 Quick Deployment Options

### Option 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com) and sign in
2. Drag and drop your `src` folder to the Netlify dashboard
3. Your site will be live instantly!

### Option 2: Git Integration (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Set build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `src`
4. Deploy!

### Option 3: Command Line
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=src
```

## ⚙️ Configuration Files

### netlify.toml
This file is already configured with:
- ✅ Publish directory set to `src`
- ✅ Redirect rules for clean URLs
- ✅ Security headers
- ✅ Cache optimization

### _redirects
Created automatically by the deployment script:
```
/case-studies /case-studies/
/about /about/
/* /index.html 200
```

## 🔧 Build Settings

**Publish directory**: `src`
**Build command**: (none needed - static site)

## 🌐 Custom Domain Setup

1. In your Netlify dashboard, go to **Domain settings**
2. Click **Add custom domain**
3. Enter your domain (e.g., `portfolio.q10ux.com`)
4. Follow the DNS configuration instructions

## 📱 Environment Variables

No environment variables needed for this static site.

## 🔄 Continuous Deployment

To enable automatic deployments:

1. **Connect Git Repository**:
   - Go to Netlify dashboard
   - Click **New site from Git**
   - Choose your repository
   - Set build settings as above

2. **Automatic Deployments**:
   - Every push to `main` branch will trigger a deployment
   - Preview deployments for pull requests

## 🚨 Troubleshooting

### Common Issues:

1. **404 Errors on Case Studies**:
   - Ensure `_redirects` file is in the `src` directory
   - Check that case study files exist in `src/case-studies/`

2. **Images Not Loading**:
   - Verify image paths are relative to `src` directory
   - Check that images exist in `public/mamp-images/`

3. **CSS/JS Not Loading**:
   - Ensure all asset paths are relative to `src`
   - Check browser console for 404 errors

### Debug Steps:
1. Check Netlify build logs
2. Verify file structure matches `src` directory
3. Test locally with `python -m http.server 8000` in `src` directory

## 📊 Performance Optimization

The site is already optimized with:
- ✅ Compressed images (WebP format)
- ✅ Minified CSS and JS
- ✅ Proper cache headers
- ✅ Security headers

## 🔒 Security

Security headers are configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 📞 Support

If you encounter issues:
1. Check Netlify documentation
2. Review build logs in Netlify dashboard
3. Test locally first
4. Verify all file paths are correct

---

**Happy Deploying! 🎉**
