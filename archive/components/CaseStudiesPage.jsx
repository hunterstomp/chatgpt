import React from 'react';
import Q10UXLogo from './Q10UXLogo';

const CaseStudiesPage = () => {
  const caseStudies = [
    {
      id: 1,
      title: "E-Commerce Mobile App Redesign",
      subtitle: "Improving conversion rates through better UX",
      description: "A comprehensive redesign of a mobile e-commerce application that increased conversion rates by 35% and improved user engagement metrics.",
      image: "https://picsum.photos/400/250?random=20",
      tags: ["Mobile Design", "E-Commerce", "User Research"],
      metrics: ["35% increase in conversion", "40% faster checkout", "25% higher engagement"]
    },
    {
      id: 2,
      title: "Healthcare Dashboard Interface",
      subtitle: "Simplifying complex medical data visualization",
      description: "Designed an intuitive dashboard for healthcare professionals to monitor patient data and make informed decisions quickly.",
      image: "https://picsum.photos/400/250?random=21",
      tags: ["Healthcare", "Dashboard", "Data Visualization"],
      metrics: ["60% faster data access", "90% user satisfaction", "Reduced errors by 45%"]
    },
    {
      id: 3,
      title: "Educational Platform UX",
      subtitle: "Enhancing learning experience for students",
      description: "Redesigned an online learning platform to improve student engagement and course completion rates through better user experience.",
      image: "https://picsum.photos/400/250?random=22",
      tags: ["Education", "Learning Platform", "Student Experience"],
      metrics: ["50% higher completion rates", "30% more time spent learning", "85% positive feedback"]
    }
  ];

  return (
    <section id="case-studies" className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
              <Q10UXLogo size="large" />
              <div className="text-start">
                <h1 className="display-5 fw-bold mb-2">Case Studies</h1>
                <p className="lead text-muted">Real-world UX projects and their impact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="row g-4">
          {caseStudies.map((study) => (
            <div key={study.id} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm hover-card">
                <img 
                  src={study.image} 
                  className="card-img-top" 
                  alt={study.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{study.title}</h5>
                  <h6 className="card-subtitle mb-2 text-primary">{study.subtitle}</h6>
                  <p className="card-text text-muted">{study.description}</p>
                  
                  {/* Tags */}
                  <div className="mb-3">
                    {study.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="badge bg-light text-dark me-1 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="mb-3">
                    <h6 className="fw-bold text-success mb-2">Key Results:</h6>
                    <ul className="list-unstyled small">
                      {study.metrics.map((metric, index) => (
                        <li key={index} className="mb-1">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-eye me-1"></i>
                    View Full Case Study
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card bg-primary text-white text-center">
              <div className="card-body py-5">
                <h3 className="mb-3">Ready to Start Your Project?</h3>
                <p className="lead mb-4">
                  Let's work together to create exceptional user experiences that drive results.
                </p>
                <button className="btn btn-light btn-lg">
                  <i className="fas fa-paper-plane me-2"></i>
                  Get In Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesPage;
