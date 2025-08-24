import React from 'react';
import { Project } from '../../types/ProjectTypes';

interface CaseStudyDeliverablesProps {
  project: Project;
}

const CaseStudyDeliverables: React.FC<CaseStudyDeliverablesProps> = ({ project }) => {
  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'presentation':
        return '📊';
      case 'prototype':
        return '🎨';
      case 'report':
        return '📋';
      case 'design-file':
        return '🎯';
      default:
        return '📎';
    }
  };

  return (
    <div className="case-study-deliverables">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Project Deliverables
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Key outputs and assets created during this project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.deliverables.map((deliverable) => (
          <div key={deliverable.id} className="card group hover:shadow-large transition-all duration-300">
            <div className="card-body">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-2xl">
                    {getDeliverableIcon(deliverable.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {deliverable.name}
                  </h3>
                  
                  {deliverable.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      {deliverable.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {deliverable.size}
                    </span>
                    
                    <a
                      href={deliverable.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline btn-sm"
                      aria-label={`Download ${deliverable.name}`}
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-full">
          <span className="text-primary-600 dark:text-primary-400">📦</span>
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {project.deliverables.length} deliverable{project.deliverables.length !== 1 ? 's' : ''} created
          </span>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDeliverables;
