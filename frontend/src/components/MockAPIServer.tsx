'use client';

import React, { useState, useEffect } from 'react';
import { Server, Play, Square, Plus, Trash2 } from 'lucide-react';

interface MockEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  response: any;
  status: number;
}

interface MockAPIServerProps {
  isVisible: boolean;
  onToggle: () => void;
}

const MockAPIServer: React.FC<MockAPIServerProps> = ({ 
  isVisible, 
  onToggle 
}) => {
  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([
    {
      id: '1',
      method: 'GET',
      path: '/api/users',
      response: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ],
      status: 200
    },
    {
      id: '2',
      method: 'POST',
      path: '/api/users',
      response: { id: 3, name: 'New User', email: 'new@example.com' },
      status: 201
    }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [newEndpoint, setNewEndpoint] = useState<Partial<MockEndpoint>>({
    method: 'GET',
    path: '/api/example',
    response: { message: 'Hello World' },
    status: 200
  });

  const addEndpoint = () => {
    if (newEndpoint.method && newEndpoint.path && newEndpoint.response) {
      const endpoint: MockEndpoint = {
        id: Date.now().toString(),
        method: newEndpoint.method as any,
        path: newEndpoint.path,
        response: newEndpoint.response,
        status: newEndpoint.status || 200
      };
      setEndpoints(prev => [...prev, endpoint]);
      setNewEndpoint({
        method: 'GET',
        path: '/api/example',
        response: { message: 'Hello World' },
        status: 200
      });
    }
  };

  const deleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(ep => ep.id !== id));
  };

  const updateEndpoint = (id: string, updates: Partial<MockEndpoint>) => {
    setEndpoints(prev => prev.map(ep => 
      ep.id === id ? { ...ep, ...updates } : ep
    ));
  };

  const testEndpoint = async (endpoint: MockEndpoint) => {
    try {
      const response = await fetch(`http://localhost:3001/api/mock${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: endpoint.method !== 'GET' ? JSON.stringify(endpoint.response) : undefined
      });
      
      const data = await response.json();
      console.log('Mock API Response:', data);
    } catch (error) {
      console.error('Mock API Error:', error);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-32 right-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Open Mock API Server"
      >
        <Server className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-32 right-4 bg-gray-900 text-white rounded-lg shadow-lg z-50 w-96 h-96 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <Server className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Mock API Server</span>
          <div className={`ml-2 w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1 rounded ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            title={isRunning ? 'Stop server' : 'Start server'}
          >
            {isRunning ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {/* Add new endpoint form */}
          <div className="bg-gray-800 p-3 rounded">
            <h4 className="text-sm font-medium mb-2">Add Endpoint</h4>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <select
                  value={newEndpoint.method}
                  onChange={(e) => setNewEndpoint(prev => ({ ...prev, method: e.target.value as any }))}
                  className="px-2 py-1 bg-gray-700 text-white rounded text-xs"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={newEndpoint.path}
                  onChange={(e) => setNewEndpoint(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/api/endpoint"
                  className="flex-1 px-2 py-1 bg-gray-700 text-white rounded text-xs"
                />
                <button
                  onClick={addEndpoint}
                  className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <textarea
                value={typeof newEndpoint.response === 'string' ? newEndpoint.response : JSON.stringify(newEndpoint.response, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNewEndpoint(prev => ({ ...prev, response: parsed }));
                  } catch {
                    setNewEndpoint(prev => ({ ...prev, response: e.target.value }));
                  }
                }}
                placeholder="Response JSON"
                className="w-full px-2 py-1 bg-gray-700 text-white rounded text-xs h-16 resize-none"
              />
            </div>
          </div>
          
          {/* Endpoints list */}
          {endpoints.map(endpoint => (
            <div key={endpoint.id} className="bg-gray-800 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    endpoint.method === 'GET' ? 'bg-green-600' :
                    endpoint.method === 'POST' ? 'bg-blue-600' :
                    endpoint.method === 'PUT' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="text-sm font-mono">{endpoint.path}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => testEndpoint(endpoint)}
                    className="p-1 text-green-400 hover:text-green-300"
                    title="Test endpoint"
                  >
                    <Play className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteEndpoint(endpoint.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Delete endpoint"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Status: {endpoint.status} | Response: {JSON.stringify(endpoint.response).substring(0, 50)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MockAPIServer;
