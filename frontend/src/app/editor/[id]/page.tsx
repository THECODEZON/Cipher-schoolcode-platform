'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Sandpack } from '@codesandbox/sandpack-react';
import { sandpackDark } from '@codesandbox/sandpack-themes';
import { 
  Save, 
  FolderPlus, 
  FileText, 
  Trash2, 
  Edit3, 
  Play,
  ArrowLeft,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import FileRename from '@/components/FileRename';
import AutosaveToggle from '@/components/AutosaveToggle';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import TerminalEmulator from '@/components/TerminalEmulator';
import ComponentTree from '@/components/ComponentTree';
import MockAPIServer from '@/components/MockAPIServer';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import Footer from '@/components/Footer';
import { useTheme } from '@/contexts/ThemeContext';

interface ProjectFile {
  name: string;
  content: string;
  type: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
}

export default function Editor() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState<string>('');
  const [files, setFiles] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('jsx');
  const [isOnline, setIsOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const filesRef = useRef<Record<string, string>>({});
  const { theme } = useTheme();
  
  // New feature states
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [autosaveInterval, setAutosaveInterval] = useState(30);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showComponentTree, setShowComponentTree] = useState(false);
  const [showMockAPI, setShowMockAPI] = useState(false);

  // Memoize the saveToLocalStorage function to prevent infinite loops
  const saveToLocalStorage = useCallback(() => {
    if (!project) return;
    
    const projectFiles: ProjectFile[] = Object.entries(filesRef.current).map(([path, content]) => {
      const fileName = path.substring(1);
      const fileType = fileName.split('.').pop() || 'js';
      return {
        name: fileName,
        content,
        type: fileType
      };
    });

    const updatedProject = {
      ...project,
      files: projectFiles,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(`project_${projectId}`, JSON.stringify(updatedProject));
    setLastSaved(new Date());
  }, [project, projectId]);

  // Initial project fetch
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Online status and auto-save setup
  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Auto-save every N seconds (if enabled)
    const autoSaveInterval = setInterval(() => {
      if (autosaveEnabled && project && Object.keys(filesRef.current).length > 0) {
        saveToLocalStorage();
      }
    }, autosaveInterval * 1000);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [project, saveToLocalStorage, autosaveEnabled, autosaveInterval]);

  const fetchProject = async () => {
    try {
      // Try to load from localStorage first
      const localData = localStorage.getItem(`project_${projectId}`);
      if (localData) {
        const localProject = JSON.parse(localData);
        setProject(localProject);
        
        const filesObj: Record<string, string> = {};
        localProject.files.forEach((file: ProjectFile) => {
          filesObj[`/${file.name}`] = file.content;
        });
        setFiles(filesObj);
        filesRef.current = filesObj;
        
        if (localProject.files.length > 0) {
          setActiveFile(`/${localProject.files[0].name}`);
        }
        setLoading(false);
      }

      // Then try to fetch from server
      if (isOnline) {
        const response = await fetch(`http://localhost:5001/api/projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
          
          const filesObj: Record<string, string> = {};
          data.files.forEach((file: ProjectFile) => {
            filesObj[`/${file.name}`] = file.content;
          });
          setFiles(filesObj);
          filesRef.current = filesObj;
          
          if (data.files.length > 0) {
            setActiveFile(`/${data.files[0].name}`);
          }
          
          // Save to localStorage
          localStorage.setItem(`project_${projectId}`, JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };


  const saveProject = async () => {
    if (!project) return;
    
    setIsSaving(true);
    
    // Always save to localStorage first
    saveToLocalStorage();
    
    // Then try to save to server if online
    if (isOnline) {
      try {
        const projectFiles: ProjectFile[] = Object.entries(filesRef.current).map(([path, content]) => {
          const fileName = path.substring(1);
          const fileType = fileName.split('.').pop() || 'js';
          return {
            name: fileName,
            content,
            type: fileType
          };
        });

        const response = await fetch(`http://localhost:5001/api/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...project,
            files: projectFiles,
          }),
        });

        if (response.ok) {
          const updatedProject = await response.json();
          setProject(updatedProject);
          setLastSaved(new Date());
        }
      } catch (error) {
        console.error('Error saving project to server:', error);
      }
    }
    
    setIsSaving(false);
  };

  const addNewFile = () => {
    if (!newFileName.trim()) return;
    
    const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${newFileType}`;
    const filePath = `/${fileName}`;
    
    const defaultContent = getDefaultContent(fileName, newFileType);
    
    setFiles(prev => {
      const newFiles = {
        ...prev,
        [filePath]: defaultContent
      };
      filesRef.current = newFiles;
      return newFiles;
    });
    
    setActiveFile(filePath);
    setShowNewFileModal(false);
    setNewFileName('');
  };

  const getDefaultContent = (fileName: string, type: string): string => {
    switch (type) {
      case 'jsx':
        return `import React from 'react';

function ${fileName.split('.')[0]}() {
  return (
    <div>
      <h2>${fileName}</h2>
      <p>This is a new React component.</p>
    </div>
  );
}

export default ${fileName.split('.')[0]};`;
      case 'js':
        return `// ${fileName}
console.log('Hello from ${fileName}');`;
      case 'css':
        return `/* ${fileName} */
.container {
  padding: 20px;
}`;
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
</head>
<body>
  <h1>${fileName}</h1>
</body>
</html>`;
      default:
        return `// ${fileName}`;
    }
  };

  const renameFile = (oldName: string, newName: string) => {
    const oldPath = `/${oldName}`;
    const newPath = `/${newName}`;
    
    if (filesRef.current[oldPath]) {
      const content = filesRef.current[oldPath];
      delete filesRef.current[oldPath];
      filesRef.current[newPath] = content;
      
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[oldPath];
        newFiles[newPath] = content;
        return newFiles;
      });
      
      if (activeFile === oldPath) {
        setActiveFile(newPath);
      }
    }
    
    setRenamingFile(null);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Project not found</h2>
          <Link href="/" className="text-orange-500 hover:text-orange-400">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} shadow-sm border-b`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className={`flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mr-4`}>
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back
                </Link>
                <Logo size="sm" showText={false} />
                <div className="ml-4">
                  <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.name}</h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{project.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 header-buttons">
                <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {isOnline ? (
                    <Wifi className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 mr-1 text-red-500" />
                  )}
                  {isOnline ? 'Online' : 'Offline'}
                </div>
                {lastSaved && (
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                )}
                <AutosaveToggle 
                  isEnabled={autosaveEnabled}
                  onToggle={() => setAutosaveEnabled(!autosaveEnabled)}
                  interval={autosaveInterval}
                />
                <ThemeToggle />
                <button
                  onClick={() => setShowNewFileModal(true)}
                  className={`flex items-center px-3 py-2 text-sm ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors`}
                >
                  <FolderPlus className="h-4 w-4 mr-1" />
                  New File
                </button>
                <button
                  onClick={saveProject}
                  disabled={isSaving}
                  className="flex items-center px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Editor */}
        <div className="flex-1 editor-container">
          <div className="editor-panel">
            <Sandpack
              template="react"
              theme={sandpackDark}
              files={files}
              options={{
                showNavigator: false,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: '100%',
                editorWidthPercentage: 50,
              }}
              customSetup={{
                dependencies: {
                  'react': '^18.0.0',
                  'react-dom': '^18.0.0',
                }
              }}
            />
          </div>
        </div>

        {/* New Feature Components */}
        <div className="floating-panels">
          <PerformanceMetrics 
            isVisible={showPerformanceMetrics}
            onToggle={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
          />
          
          <TerminalEmulator 
            isVisible={showTerminal}
            onToggle={() => setShowTerminal(!showTerminal)}
            onMinimize={() => setShowTerminal(false)}
          />
          
          <ComponentTree 
            isVisible={showComponentTree}
            onToggle={() => setShowComponentTree(!showComponentTree)}
            files={files}
          />
          
          <MockAPIServer 
            isVisible={showMockAPI}
            onToggle={() => setShowMockAPI(!showMockAPI)}
          />
        </div>
      {showNewFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg p-6 w-96 border`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Create New File</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className={`w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  placeholder="e.g., MyComponent.jsx"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  className={`w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                >
                  <option value="jsx">JSX</option>
                  <option value="js">JavaScript</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowNewFileModal(false)}
                className={`px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Cancel
              </button>
              <button
                onClick={addNewFile}
                className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Footer */}
      <Footer />
    </ResponsiveLayout>
  );
}