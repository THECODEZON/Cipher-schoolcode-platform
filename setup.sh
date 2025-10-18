#!/bin/bash

# CipherStudio Deployment Script

echo "🚀 Starting CipherStudio deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ All dependencies installed successfully!"

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is available"
else
    echo "⚠️  MongoDB not found. Make sure MongoDB is running or use MongoDB Atlas."
fi

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo ""
echo "To start both frontend and backend:"
echo "  npm run dev"
echo ""
echo "Or start them separately:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo ""
echo "Don't forget to:"
echo "1. Copy backend/env.example to backend/.env"
echo "2. Update MongoDB connection string in backend/.env"
echo "3. Start MongoDB if running locally"
