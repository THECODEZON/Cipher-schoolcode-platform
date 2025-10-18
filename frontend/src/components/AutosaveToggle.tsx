'use client';

import React from 'react';
import { Save, Clock } from 'lucide-react';

interface AutosaveToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  interval?: number;
}

const AutosaveToggle: React.FC<AutosaveToggleProps> = ({ 
  isEnabled, 
  onToggle, 
  interval = 30 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggle}
        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
          isEnabled 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
        title={isEnabled ? 'Disable autosave' : 'Enable autosave'}
      >
        {isEnabled ? (
          <Save className="h-4 w-4 mr-1" />
        ) : (
          <Clock className="h-4 w-4 mr-1" />
        )}
        {isEnabled ? `Auto (${interval}s)` : 'Manual'}
      </button>
    </div>
  );
};

export default AutosaveToggle;
