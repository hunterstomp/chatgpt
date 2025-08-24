import React from 'react';
import { Project } from '../../types/ProjectTypes';

interface CaseStudyOutcomesProps {
  project: Project;
}

const CaseStudyOutcomes: React.FC<CaseStudyOutcomesProps> = ({ project }) => {
  return (
    <div className="case-study-outcomes">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Results & Impact
        </h2>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Measurable outcomes and positive impact achieved through this project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Results */}
        {project.results.map((result, index) => (
          <div key={index} className="card text-center">
            <div className="card-body">
              <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                {result}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Challenges & Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Challenges */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-6 flex items-center">
            <span className="text-warning-500 mr-3">⚠️</span>
            Challenges Faced
          </h3>
          <ul className="space-y-4">
            {project.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-warning-500 rounded-full mt-2" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {challenge}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Solutions */}
        <div>
          <h3 className="text-2xl font-display font-bold mb-6 flex items-center">
            <span className="text-success-500 mr-3">💡</span>
            Solutions Implemented
          </h3>
          <ul className="space-y-4">
            {project.solutions.map((solution, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-2 h-2 bg-success-500 rounded-full mt-2" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {solution}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Key Takeaways */}
      <div className="mt-16">
        <div className="card">
          <div className="card-header">
            <h3 className="text-2xl font-display font-bold flex items-center">
              <span className="text-primary-500 mr-3">🎯</span>
              Key Takeaways
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary-600 dark:text-primary-400">
                  What I Learned
                </h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li>• User research is crucial for understanding complex workflows</li>
                  <li>• Iterative design leads to better user experiences</li>
                  <li>• Collaboration with stakeholders improves project outcomes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-primary-600 dark:text-primary-400">
                  Impact on Future Projects
                </h4>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  <li>• Established design system for consistency</li>
                  <li>• Improved user testing methodologies</li>
                  <li>• Enhanced stakeholder communication processes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyOutcomes;
