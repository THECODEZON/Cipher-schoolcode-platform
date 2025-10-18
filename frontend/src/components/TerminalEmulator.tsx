'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Minimize2 } from 'lucide-react';

interface TerminalEmulatorProps {
  isVisible: boolean;
  onToggle: () => void;
  onMinimize: () => void;
}

interface Command {
  input: string;
  output: string;
  timestamp: Date;
}

const TerminalEmulator: React.FC<TerminalEmulatorProps> = ({ 
  isVisible, 
  onToggle, 
  onMinimize 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [currentDir, setCurrentDir] = useState('/project');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string): string => {
    const [command, ...args] = cmd.trim().split(' ');
    
    switch (command.toLowerCase()) {
      case 'ls':
        return 'App.jsx\nindex.js\npackage.json\nREADME.md\nnode_modules/\nsrc/';
      
      case 'pwd':
        return currentDir;
      
      case 'cd':
        if (args[0] === '..') {
          setCurrentDir('/');
          return '';
        }
        if (args[0] === 'src') {
          setCurrentDir('/project/src');
          return '';
        }
        return `cd: ${args[0]}: No such file or directory`;
      
      case 'cat':
        if (args[0] === 'package.json') {
          return JSON.stringify({
            name: 'my-react-app',
            version: '1.0.0',
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0'
            }
          }, null, 2);
        }
        return `cat: ${args[0]}: No such file or directory`;
      
      case 'npm':
        if (args[0] === 'run' && args[1] === 'build') {
          return 'Build completed successfully!\n✓ Compiled successfully';
        }
        if (args[0] === 'install') {
          return 'Installing packages...\n✓ All packages installed successfully';
        }
        return 'npm command executed';
      
      case 'echo':
        return args.join(' ');
      
      case 'help':
        return `Available commands:
ls - List directory contents
pwd - Print working directory
cd <dir> - Change directory
cat <file> - Display file contents
npm <command> - Run npm commands
echo <text> - Print text
help - Show this help message
clear - Clear terminal`;
      
      case 'clear':
        setHistory([]);
        return '';
      
      default:
        return `Command not found: ${command}. Type 'help' for available commands.`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const output = executeCommand(input);
    const newCommand: Command = {
      input: input.trim(),
      output,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, newCommand]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Could implement command history here
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Open terminal"
      >
        <Terminal className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white rounded-lg shadow-lg z-50 w-96 h-64 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="p-1 text-gray-400 hover:text-white"
            title="Minimize"
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-white"
            title="Close"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-xs"
      >
        {history.length === 0 && (
          <div className="text-gray-400 mb-2">
            Welcome to CipherStudio Terminal! Type 'help' for available commands.
          </div>
        )}
        
        {history.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="text-green-400">
              {currentDir}$ {cmd.input}
            </div>
            {cmd.output && (
              <div className="text-gray-300 mt-1 whitespace-pre-wrap">
                {cmd.output}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
        <div className="flex items-center">
          <span className="text-green-400 mr-2">{currentDir}$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default TerminalEmulator;
