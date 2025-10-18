# CipherStudio - Advanced Browser-Based React IDE

CipherStudio is a modern, feature-rich browser-based React IDE that provides a complete development environment for React projects. Built with Next.js, Monaco Editor, and Sandpack, it offers professional-grade features for coding, testing, and deployment.

## 🚀 Core Features

- 🚀 **Real-time React Preview**: Live preview of your React code using Sandpack
- 📝 **Rich Code Editor**: Monaco Editor with syntax highlighting and IntelliSense
- 📁 **File Management**: Create, edit, delete, rename, and organize multiple files
- 💾 **Project Persistence**: Save projects locally and sync with backend
- 🌐 **Offline Support**: Continue working even without internet connection
- 🎨 **Modern UI**: Clean, intuitive interface with light/dark themes
- ⚡ **Fast Performance**: Optimized for smooth editing experience

## 🎯 Advanced Features

### 🔧 Development Tools
- **File Rename**: Right-click to rename files and folders
- **Autosave Toggle**: Enable/disable automatic saving with configurable intervals
- **Performance Metrics**: Real-time FPS, render time, and memory usage overlay
- **Component Tree Visualizer**: Interactive component hierarchy display
- **Virtual Terminal**: Simulated command-line interface with common commands

### 🌐 API & Testing
- **Mock API Server**: Built-in API mocking for testing and development
- **API Endpoint Management**: Create, test, and manage mock endpoints
- **Request/Response Testing**: Test API calls directly from the IDE

### 🎨 User Experience
- **Responsive Layout**: Adaptive UI for desktop, tablet, and mobile devices
- **Touch-Friendly**: Optimized for touch devices and tablets
- **Theme Switching**: Beautiful light and dark themes with orange accents
- **Theme Persistence**: Remembers your theme preference
- **Keyboard Shortcuts**: Efficient keyboard navigation

### 🔐 Authentication & Deployment
- **User Authentication**: Login/Register system (ready for implementation)
- **Project Sharing**: Share projects with other users
- **Cloud Sync**: Synchronize projects across devices
- **Deployment Ready**: One-click deployment to Vercel, Render, and Docker

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Monaco Editor** - VS Code editor in the browser
- **Sandpack** - Code execution and live preview
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database for project storage
- **AWS S3** - Optional cloud storage (configurable)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CipherStudio
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp env.example .env
   
   # Edit .env with your MongoDB connection string
   # MONGODB_URI=mongodb://localhost:27017/cipherstudio
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start both frontend and backend simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```

   Or start them separately:

2. **Start the backend**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3001 (or 3000 if available)
   - Backend API: http://localhost:5001

## Usage

### Creating a New Project

1. Click the "New Project" button on the homepage
2. A new React project will be created with default files:
   - `App.jsx` - Main React component
   - `index.js` - Entry point

### Editing Code

1. Select a project from the homepage
2. The editor will open with Monaco Editor and Sandpack preview
3. Edit your code in the left panel
4. See live preview in the right panel
5. Changes are automatically saved to localStorage

### File Management

- **Create new files**: Click "New File" button
- **Switch between files**: Use the tabs in the editor
- **Rename files**: Right-click on file tabs to rename
- **Save project**: Click "Save" button to sync with backend

### Advanced Features Usage

#### Autosave Toggle
- Click the autosave button in the header to enable/disable automatic saving
- Configure autosave interval (default: 30 seconds)
- Manual save always available with the "Save" button

#### Performance Metrics
- Click the performance icon (bottom-right) to show/hide metrics
- Monitor FPS, render time, and memory usage in real-time
- Useful for optimizing React component performance

#### Virtual Terminal
- Click the terminal icon (bottom-left) to open the virtual terminal
- Supports common commands: `ls`, `cd`, `npm`, `cat`, `echo`, `help`
- Simulates a real development environment

#### Component Tree Visualizer
- Click the tree icon (top-right) to view component hierarchy
- Shows file structure and React component relationships
- Displays component props and dependencies

#### Mock API Server
- Click the server icon (top-right) to open the API mock server
- Create, test, and manage mock API endpoints
- Supports GET, POST, PUT, DELETE methods
- Test API calls directly from the IDE

#### Theme Switching
- Click the sun/moon icon in the header to toggle themes
- Choose between light and dark modes
- Theme preference is automatically saved

### Offline Support

- Projects are automatically saved to localStorage
- Continue working offline
- Changes sync when connection is restored

## Project Structure

```
CipherStudio/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Homepage
│   │   │   └── editor/
│   │   │       └── [id]/
│   │   │           └── page.tsx  # Editor page
│   │   └── components/       # Reusable components
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Express.js backend
│   ├── index.js            # Main server file
│   ├── package.json
│   └── env.example         # Environment variables template
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Health Check

- `GET /api/health` - Server health status

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/cipherstudio
PORT=5000

# Optional: AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name
```

## Deployment

### Quick Deployment

Use the included deployment script for easy setup:

```bash
./deploy.sh
```

This script provides options for:
- Local development setup
- Building the application
- Deploying to Vercel (Frontend)
- Deploying to Render (Backend)
- Docker deployment
- Full deployment pipeline

### Manual Deployment

#### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
5. Deploy

#### Backend (Render/Railway/Cyclic)

1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables:
   - `PORT=5001`
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_connection_string`
5. Deploy

#### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Or build individual services
docker build -t cipherstudio-frontend ./frontend
docker build -t cipherstudio-backend ./backend
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/cipherstudio
PORT=5001
NODE_ENV=production

# Optional: AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ using React, Next.js, and modern web technologies.
