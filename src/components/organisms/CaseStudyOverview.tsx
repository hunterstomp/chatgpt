import React from 'react';
import { Project } from '../../types/ProjectTypes';

interface CaseStudyOverviewProps {
  project: Project;
}

const CaseStudyOverview: React.FC<CaseStudyOverviewProps> = ({ project }) => {
  return (
    <div className="case-study-overview">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Project Overview
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-neutral-700 dark:text-neutral-300 mb-8">
              {project.description}
            </p>
          </div>
          
          {/* Technologies Used */}
          {project.technologies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Technologies & Tools</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-semibold">Project Details</h3>
              </div>
              
              <div className="card-body space-y-4">
                {/* Client */}
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Client</dt>
                  <dd className="text-lg font-semibold">{project.client}</dd>
                </div>
                
                {/* Duration */}
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Duration</dt>
                  <dd className="text-lg">{project.duration}</dd>
                </div>
                
                {/* Role */}
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Role</dt>
                  <dd className="text-lg">{project.role}</dd>
                </div>
                
                {/* Year */}
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Year</dt>
                  <dd className="text-lg">{project.year}</dd>
                </div>
                
                {/* Category */}
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Category</dt>
                  <dd className="text-lg capitalize">
                    {project.category.replace('_', ' ').toLowerCase()}
                  </dd>
                </div>
              </div>
              
              {/* External Link */}
              {project.url && (
                <div className="card-footer">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary btn-md w-full"
                  >
                    View Live Project
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyOverview;
