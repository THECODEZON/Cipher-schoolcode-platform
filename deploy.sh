#!/bin/bash

# CipherStudio Deployment Script
# This script helps deploy CipherStudio to various platforms

set -e

echo "🚀 CipherStudio Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Build frontend
    cd frontend
    npm run build
    cd ..
    
    print_success "Application built successfully"
}

# Deploy to Vercel (Frontend)
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd frontend
    vercel --prod
    cd ..
    
    print_success "Frontend deployed to Vercel"
}

# Deploy to Render (Backend)
deploy_render() {
    print_status "Deploying backend to Render..."
    
    print_warning "Please follow these steps to deploy to Render:"
    echo "1. Go to https://render.com"
    echo "2. Create a new Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Set the following configuration:"
    echo "   - Build Command: cd backend && npm install"
    echo "   - Start Command: cd backend && npm start"
    echo "   - Environment: Node"
    echo "   - Port: 5001"
    echo "5. Add environment variables if needed"
    
    print_success "Render deployment instructions provided"
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    docker-compose up --build -d
    
    print_success "Application deployed with Docker"
}

# Local development setup
setup_local() {
    print_status "Setting up local development environment..."
    
    # Create .env files if they don't exist
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_warning "Created backend/.env from template. Please update with your values."
    fi
    
    # Start development servers
    print_status "Starting development servers..."
    
    # Start backend in background
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Development servers started"
    print_status "Backend: http://localhost:5001"
    print_status "Frontend: http://localhost:3000"
    
    # Wait for user to stop
    echo "Press Ctrl+C to stop the servers"
    trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
    wait
}

# Main menu
show_menu() {
    echo ""
    echo "Select deployment option:"
    echo "1) Local Development Setup"
    echo "2) Build Application"
    echo "3) Deploy to Vercel (Frontend)"
    echo "4) Deploy to Render (Backend)"
    echo "5) Deploy with Docker"
    echo "6) Full Deployment (Vercel + Render)"
    echo "7) Exit"
    echo ""
}

# Main execution
main() {
    check_dependencies
    
    while true; do
        show_menu
        read -p "Enter your choice (1-7): " choice
        
        case $choice in
            1)
                install_dependencies
                setup_local
                ;;
            2)
                install_dependencies
                build_app
                ;;
            3)
                install_dependencies
                build_app
                deploy_vercel
                ;;
            4)
                deploy_render
                ;;
            5)
                deploy_docker
                ;;
            6)
                install_dependencies
                build_app
                deploy_vercel
                deploy_render
                ;;
            7)
                print_success "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
