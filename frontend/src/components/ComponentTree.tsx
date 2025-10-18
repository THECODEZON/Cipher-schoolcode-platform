'use client';

import React, { useState, useEffect } from 'react';
import { TreePine, ChevronRight, ChevronDown, FileText, Component } from 'lucide-react';

interface ComponentNode {
  id: string;
  name: string;
  type: 'component' | 'file';
  children?: ComponentNode[];
  props?: string[];
}

interface ComponentTreeProps {
  isVisible: boolean;
  onToggle: () => void;
  files: Record<string, string>;
}

const ComponentTree: React.FC<ComponentTreeProps> = ({ 
  isVisible, 
  onToggle, 
  files 
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [componentTree, setComponentTree] = useState<ComponentNode[]>([]);

  useEffect(() => {
    const parseComponents = (): ComponentNode[] => {
      const components: ComponentNode[] = [];
      
      Object.entries(files).forEach(([path, content]) => {
        if (path.endsWith('.jsx') || path.endsWith('.js')) {
          const fileName = path.split('/').pop() || '';
          
          // Extract component names from the file
          const componentMatches = content.match(/(?:function|const|class)\s+(\w+)/g);
          const componentNames = componentMatches?.map(match => {
            const name = match.replace(/(?:function|const|class)\s+/, '');
            return name;
          }) || [];
          
          // Extract imports
          const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
          const imports = importMatches?.map(match => {
            const path = match.match(/['"]([^'"]+)['"]/)?.[1];
            return path;
          }).filter(Boolean) || [];
          
          if (componentNames.length > 0) {
            components.push({
              id: fileName,
              name: fileName,
              type: 'file',
              children: componentNames.map(name => ({
                id: `${fileName}-${name}`,
                name,
                type: 'component',
                props: extractProps(content, name)
              }))
            });
          }
        }
      });
      
      return components;
    };

    const extractProps = (content: string, componentName: string): string[] => {
      const props: string[] = [];
      
      // Look for props destructuring
      const destructuringMatch = content.match(new RegExp(`${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>`, 'i'));
      if (destructuringMatch) {
        const propsMatch = destructuringMatch[0].match(/\{([^}]+)\}/);
        if (propsMatch) {
          props.push(...propsMatch[1].split(',').map(p => p.trim()));
        }
      }
      
      return props;
    };

    setComponentTree(parseComponents());
  }, [files]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: ComponentNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <div className="mr-1">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )}
            </div>
          )}
          
          <div className="mr-2">
            {node.type === 'file' ? (
              <FileText className="h-3 w-3 text-blue-400" />
            ) : (
              <Component className="h-3 w-3 text-green-400" />
            )}
          </div>
          
          <span className="text-sm text-gray-300">{node.name}</span>
          
          {node.props && node.props.length > 0 && (
            <span className="ml-2 text-xs text-gray-500">
              ({node.props.join(', ')})
            </span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Show component tree"
      >
        <TreePine className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 bg-gray-900 text-white rounded-lg shadow-lg z-50 w-80 h-96 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center">
          <TreePine className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Component Tree</span>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
          title="Close"
        >
          ×
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {componentTree.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No components found. Create some React components to see the tree.
          </div>
        ) : (
          <div>
            {componentTree.map(node => renderNode(node))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentTree;
