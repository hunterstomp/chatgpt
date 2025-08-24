import React from 'react';
import { Project } from '../../types/ProjectTypes';

interface CaseStudyProcessProps {
  project: Project;
}

const CaseStudyProcess: React.FC<CaseStudyProcessProps> = ({ project }) => {
  return (
    <div className="case-study-process">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Design Process
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          A systematic approach to solving complex user experience challenges
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {project.process.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Step Number */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              {step.order}
            </div>
            
            {/* Step Content */}
            <div className="card h-full pt-8">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {step.description}
                </p>
                
                {/* Step Images */}
                {step.images && step.images.length > 0 && (
                  <div className="space-y-3">
                    {step.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {image.caption && (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 px-2">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Process Flow Visualization */}
      <div className="mt-16">
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 transform -translate-y-1/2" />
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {project.process.slice(0, 3).map((step, index) => (
              <div key={step.id} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full font-bold text-xl mb-4 shadow-lg">
                  {step.order}
                </div>
                <h4 className="font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {step.description.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyProcess;
