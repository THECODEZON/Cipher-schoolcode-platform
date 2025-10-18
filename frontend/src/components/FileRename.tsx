'use client';

import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface FileRenameProps {
  fileName: string;
  onRename: (oldName: string, newName: string) => void;
  onCancel: () => void;
}

const FileRename: React.FC<FileRenameProps> = ({ fileName, onRename, onCancel }) => {
  const [newName, setNewName] = useState(fileName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== fileName) {
      onRename(fileName, newName.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-orange-500"
        autoFocus
      />
      <button
        type="submit"
        className="p-1 text-green-500 hover:text-green-400"
        title="Confirm rename"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-1 text-red-500 hover:text-red-400"
        title="Cancel rename"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
};

export default FileRename;
