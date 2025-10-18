'use client';

import { useState, useEffect } from 'react';
import { Plus, FolderOpen, Code, Play } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

interface Project {
  _id: string;
  name: string;
  description: string;
  files: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `New Project ${projects.length + 1}`,
          description: 'A new React project',
          files: [
            {
              name: 'App.jsx',
              content: `import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>Hello, CipherStudio!</h1>
      <p>Start coding your React app here.</p>
    </div>
  );
}

export default App;`,
              type: 'jsx'
            },
            {
              name: 'index.js',
              content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
              type: 'js'
            }
          ]
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([newProject, ...projects]);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo size="lg" showText={true} />
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={createNewProject}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Your Projects</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Create, edit, and manage your React projects</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No projects yet</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Get started by creating a new project.</p>
            <div className="mt-6">
              <button
                onClick={createNewProject}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/editor/${project._id}`}
                className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'} rounded-lg shadow-sm border p-6 hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                    {project.name}
                  </h3>
                  <Play className="h-4 w-4 text-orange-500" />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
                  {project.description || 'No description'}
                </p>
                <div className={`flex items-center justify-between text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span>{project.files.length} files</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
