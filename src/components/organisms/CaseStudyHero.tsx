import React from 'react';
import { Project } from '../../types/ProjectTypes';
import { formatYear } from '../../utils/formatDate';

interface CaseStudyHeroProps {
  project: Project;
}

const CaseStudyHero: React.FC<CaseStudyHeroProps> = ({ project }) => {
  const heroImage = project.images.find(img => img.category === 'hero') || project.images[0];

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage.url}
            alt={heroImage.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/40" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 container-narrow text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Client Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm font-medium">{project.client}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            {project.title}
          </h1>
          
          {/* Summary */}
          <p className="text-xl md:text-2xl text-neutral-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {project.summary}
          </p>
          
          {/* Project Metadata */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-300">📅</span>
              <span>{formatYear(project.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-neutral-300">⏱️</span>
              <span>{project.duration}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-neutral-300">👤</span>
              <span>{project.role}</span>
            </div>
          </div>
          
          {/* Skills */}
          {project.skills.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-2">
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-soft">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHero;
