#!/bin/bash

# Q10UX One-Command Startup
# Just run this script and everything works!

echo "🎨 Q10UX Portfolio - One-Command Startup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the q10ux-portfolio directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "🔍 Checking dependencies..."

if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js 16+ first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 not found. Please install Python 3+ first."
    exit 1
fi

echo "✅ Dependencies found"

# Install npm packages if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm packages..."
    npm install
else
    echo "✅ npm packages already installed"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads processed temp logs backend/uploads public

# Create symlink for MAMP images if it doesn't exist
if [ ! -L "public/mamp-images" ]; then
    echo "🔗 Creating MAMP images symlink..."
    if [ -d "/Applications/MAMP/htdocs/Q10UXPortfolio/assets/images" ]; then
        ln -sf "/Applications/MAMP/htdocs/Q10UXPortfolio/assets/images" "public/mamp-images"
        echo "✅ MAMP images symlink created"
    else
        echo "⚠️  MAMP images directory not found. You may need to set up your images manually."
    fi
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Q10UX Portfolio Environment Variables

# JWT Secret (change this in production!)
JWT_SECRET=q10ux-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# Optional: Cloud Integration (uncomment and configure as needed)
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_REGION=us-west-2
# AWS_S3_BUCKET=your-s3-bucket-name

# SANITY_PROJECT_ID=your-sanity-project-id
# SANITY_DATASET=production
# SANITY_TOKEN=your-sanity-token
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh scripts/*.js

# Start the system
echo ""
echo "🚀 Starting Q10UX Portfolio System..."
echo ""

# Start backend server in background
echo "🔧 Starting admin server..."
npm run admin &
ADMIN_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server..."
npm run serve &
SERVE_PID=$!

# Wait a moment for frontend to start
sleep 2

echo ""
echo "🎉 Q10UX Portfolio is now running!"
echo "=================================="
echo ""
echo "📱 Access URLs:"
echo "   • Portfolio:      http://localhost:8001/src/"
echo "   • Instant Upload: http://localhost:8001/src/instant-upload/"
echo "   • Smart Upload:   http://localhost:8001/src/smart-upload/"
echo "   • Admin Panel:    http://localhost:8001/src/admin/"
echo "   • Admin API:      http://localhost:3001/"
echo ""
echo "🔑 Admin Login:"
echo "   • Username: admin"
echo "   • Password: password"
echo ""
echo "📁 Upload Methods:"
echo "   • Instant Upload: Just drop files and go!"
echo "   • Smart Upload:   Advanced options and configuration"
echo "   • Watch Folder:   Drop files in uploads/ folder"
echo ""
echo "🛑 To stop the servers, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $ADMIN_PID 2>/dev/null
    kill $SERVE_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running
wait
