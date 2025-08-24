import React from 'react';
import { Project } from '../../types/ProjectTypes';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyOverview from './CaseStudyOverview';
import CaseStudyProcess from './CaseStudyProcess';
import CaseStudyOutcomes from './CaseStudyOutcomes';
import CaseStudyGallery from './CaseStudyGallery';
import CaseStudyDeliverables from './CaseStudyDeliverables';

interface CaseStudyProps {
  project: Project;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ project }) => {
  return (
    <article className="case-study">
      {/* Hero Section */}
      <CaseStudyHero project={project} />
      
      {/* Overview Section */}
      <section className="section">
        <div className="container-narrow">
          <CaseStudyOverview project={project} />
        </div>
      </section>
      
      {/* Process Section */}
      {project.process.length > 0 && (
        <section className="section bg-neutral-50 dark:bg-neutral-900">
          <div className="container-narrow">
            <CaseStudyProcess project={project} />
          </div>
        </section>
      )}
      
      {/* Gallery Section */}
      {project.images.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <CaseStudyGallery project={project} />
          </div>
        </section>
      )}
      
      {/* Outcomes Section */}
      <section className="section bg-primary-50 dark:bg-primary-950">
        <div className="container-narrow">
          <CaseStudyOutcomes project={project} />
        </div>
      </section>
      
      {/* Deliverables Section */}
      {project.deliverables.length > 0 && (
        <section className="section">
          <div className="container-narrow">
            <CaseStudyDeliverables project={project} />
          </div>
        </section>
      )}
    </article>
  );
};

export default CaseStudy;
