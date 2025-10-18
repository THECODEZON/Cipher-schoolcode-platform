'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, Cpu } from 'lucide-react';

interface PerformanceMetricsProps {
  isVisible: boolean;
  onToggle: () => void;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  isVisible, 
  onToggle 
}) => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    renderTime: 16,
    memoryUsage: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    if (!isVisible) return;

    const updateMetrics = () => {
      // Simulate performance metrics
      const now = Date.now();
      const fps = Math.floor(Math.random() * 20) + 50; // 50-70 FPS
      const renderTime = Math.floor(Math.random() * 10) + 10; // 10-20ms
      
      // Get memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }

      setMetrics({
        fps,
        renderTime,
        memoryUsage,
        timestamp: now
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Show performance metrics"
      >
        <Activity className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50 min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center">
          <Activity className="h-4 w-4 mr-1" />
          Performance
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
          title="Hide metrics"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="h-3 w-3 mr-1 text-yellow-500" />
            FPS
          </div>
          <span className={`font-mono ${
            metrics.fps >= 60 ? 'text-green-400' : 
            metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {metrics.fps}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Cpu className="h-3 w-3 mr-1 text-blue-500" />
            Render
          </div>
          <span className={`font-mono ${
            metrics.renderTime <= 16 ? 'text-green-400' : 
            metrics.renderTime <= 33 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {metrics.renderTime}ms
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-3 w-3 mr-1 text-purple-500" />
            Memory
          </div>
          <span className="font-mono text-gray-300">
            {metrics.memoryUsage}MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
