#!/bin/bash

# Netlify Deployment Script for Q10UX Portfolio
echo "🚀 Preparing Q10UX Portfolio for Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "src/index.html" ]; then
    echo "❌ Error: src/index.html not found. Please run this script from the project root."
    exit 1
fi

# Create a _redirects file for Netlify (alternative to netlify.toml)
echo "📝 Creating _redirects file..."
cat > src/_redirects << EOF
# Redirects for clean URLs
/case-studies /case-studies/
/about /about/

# Handle client-side routing
/* /index.html 200
EOF

echo "✅ _redirects file created"

# Check if we're already logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please log in to Netlify..."
    netlify login
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=src

echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "   1. Your site is now live on Netlify"
echo "   2. You can set up a custom domain in the Netlify dashboard"
echo "   3. Enable automatic deployments by connecting your Git repository"
