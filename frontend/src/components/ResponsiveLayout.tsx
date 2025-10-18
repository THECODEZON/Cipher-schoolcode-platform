'use client';

import React from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`responsive-layout ${className}`}>
      <style jsx global>{`
        .responsive-layout {
          /* Desktop styles */
          @media (min-width: 1024px) {
            .editor-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
              height: calc(100vh - 64px);
            }
            
            .editor-panel {
              border-right: 1px solid #374151;
            }
            
            .preview-panel {
              overflow: auto;
            }
            
            .floating-panels {
              position: fixed;
              z-index: 40;
            }
          }
          
          /* Tablet styles */
          @media (min-width: 768px) and (max-width: 1023px) {
            .editor-container {
              display: flex;
              flex-direction: column;
              height: calc(100vh - 64px);
            }
            
            .editor-panel {
              flex: 1;
              min-height: 50vh;
              border-bottom: 1px solid #374151;
            }
            
            .preview-panel {
              flex: 1;
              min-height: 50vh;
              overflow: auto;
            }
            
            .floating-panels {
              position: fixed;
              z-index: 40;
              max-width: calc(100vw - 2rem);
            }
            
            .terminal-panel {
              bottom: 1rem;
              left: 1rem;
              right: 1rem;
              width: auto;
            }
            
            .metrics-panel {
              bottom: 1rem;
              right: 1rem;
            }
            
            .component-tree-panel {
              top: 5rem;
              right: 1rem;
              max-height: calc(100vh - 6rem);
            }
            
            .mock-api-panel {
              top: 20rem;
              right: 1rem;
              max-height: calc(100vh - 22rem);
            }
          }
          
          /* Mobile styles */
          @media (max-width: 767px) {
            .editor-container {
              display: flex;
              flex-direction: column;
              height: calc(100vh - 64px);
            }
            
            .editor-panel {
              flex: 1;
              min-height: 40vh;
            }
            
            .preview-panel {
              flex: 1;
              min-height: 60vh;
            }
            
            .floating-panels {
              position: fixed;
              z-index: 40;
              max-width: calc(100vw - 1rem);
            }
            
            .terminal-panel {
              bottom: 0.5rem;
              left: 0.5rem;
              right: 0.5rem;
              width: auto;
              height: 50vh;
            }
            
            .metrics-panel {
              bottom: 0.5rem;
              right: 0.5rem;
              width: calc(100vw - 1rem);
            }
            
            .component-tree-panel {
              top: 4rem;
              left: 0.5rem;
              right: 0.5rem;
              width: auto;
              height: 60vh;
            }
            
            .mock-api-panel {
              top: 15rem;
              left: 0.5rem;
              right: 0.5rem;
              width: auto;
              height: 50vh;
            }
            
            .header-buttons {
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            
            .header-buttons button {
              font-size: 0.75rem;
              padding: 0.5rem;
            }
          }
          
          /* Touch-friendly adjustments */
          @media (hover: none) and (pointer: coarse) {
            .floating-panels button {
              min-height: 44px;
              min-width: 44px;
            }
            
            .terminal-input {
              font-size: 16px; /* Prevents zoom on iOS */
            }
          }
        }
      `}</style>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
