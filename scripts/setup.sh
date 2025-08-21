#!/bin/bash

# Q10UX Smart Upload System Setup
# This script sets up the complete system with all dependencies

echo "🎨 Q10UX Smart Upload System Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Check for system dependencies
echo "🔍 Checking system dependencies..."

# Check for ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ffmpeg
        else
            echo "❌ Homebrew not found. Please install Homebrew first:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get update && sudo apt-get install -y ffmpeg
    else
        echo "❌ Unsupported OS. Please install ffmpeg manually."
        exit 1
    fi
else
    echo "✅ ffmpeg found: $(ffmpeg -version | head -n1)"
fi

# Check for ImageMagick
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install imagemagick
        else
            echo "❌ Homebrew not found. Please install Homebrew first."
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo apt-get install -y imagemagick
    else
        echo "❌ Unsupported OS. Please install ImageMagick manually."
        exit 1
    fi
else
    echo "✅ ImageMagick found: $(convert --version | head -n1)"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads processed temp logs backend/uploads

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOF
# Q10UX Smart Upload System Environment Variables

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-west-2
AWS_S3_BUCKET=your-s3-bucket-name

# Sanity Configuration (optional)
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_TOKEN=your-sanity-token

# Server Configuration
PORT=3001
NODE_ENV=development
EOF
    echo "✅ Created .env file with default values"
    echo "⚠️  Please update .env with your actual credentials"
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/smart-upload.js
chmod +x scripts/setup.sh

# Create symlink for global access
echo "🔗 Creating global symlink..."
npm link

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 Quick Start:"
echo "   1. Start the admin server: npm run admin"
echo "   2. Start the frontend: npm run serve"
echo "   3. Access Smart Upload: http://localhost:8001/src/smart-upload/"
echo "   4. Access Admin Panel: http://localhost:8001/src/admin/"
echo ""
echo "📋 Available Commands:"
echo "   npm run admin          - Start admin server"
echo "   npm run serve          - Start frontend server"
echo "   npm run smart-upload   - Run CLI smart upload"
echo "   q10ux-smart-upload     - Run smart upload (global)"
echo ""
echo "📚 Documentation:"
echo "   - README.md for complete guide"
echo "   - Smart Upload Help: Click 'Help' button in interface"
echo ""
echo "🔧 Configuration:"
echo "   - Edit .env for cloud credentials"
echo "   - Edit settings in Smart Upload interface"
echo ""
echo "Happy uploading! 🎨✨"
