import React from 'react';
import Q10UXLogo from './Q10UXLogo';

const ProfilePage = () => {
  const skills = [
    { name: "User Research", level: 95, icon: "fas fa-search" },
    { name: "UI/UX Design", level: 90, icon: "fas fa-palette" },
    { name: "Prototyping", level: 88, icon: "fas fa-cube" },
    { name: "User Testing", level: 85, icon: "fas fa-users" },
    { name: "Design Systems", level: 82, icon: "fas fa-layer-group" },
    { name: "Frontend Development", level: 78, icon: "fas fa-code" }
  ];

  const experiences = [
    {
      year: "2023 - Present",
      title: "Senior UX Designer",
      company: "Tech Innovations Inc.",
      description: "Leading user experience design for enterprise applications"
    },
    {
      year: "2021 - 2023",
      title: "UX Designer",
      company: "Digital Solutions Co.",
      description: "Designed user interfaces for mobile and web applications"
    },
    {
      year: "2019 - 2021",
      title: "UI Designer",
      company: "Creative Agency",
      description: "Created visual designs and brand identities"
    }
  ];

  return (
    <section id="profile" className="py-5">
      <div className="container">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <div className="position-relative">
              <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                <Q10UXLogo size="large" />
                <div className="text-start">
                  <h1 className="display-4 fw-bold mb-2">About Me</h1>
                  <p className="lead text-muted">Passionate UX Designer & Problem Solver</p>
                </div>
              </div>
              
              {/* Profile Image */}
              <div className="position-relative d-inline-block mb-4">
                <img 
                  src="https://picsum.photos/300/300?random=30" 
                  alt="Profile" 
                  className="rounded-circle shadow-lg"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-4 border-primary opacity-25"></div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-center">The Story Behind Q10UX</h2>
                <div className="row">
                  <div className="col-md-6">
                    <p className="lead">
                      I'm a UX designer who believes that great design should be invisible. 
                      When users don't notice the interface, that's when we've succeeded.
                    </p>
                    <p>
                      With over 5 years of experience in user experience design, I've helped 
                      companies create products that users love to use. My approach combines 
                      user research, intuitive design, and technical implementation to deliver 
                      exceptional experiences.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      The "Q10" in Q10UX represents my commitment to quality and the perfect 
                      10/10 user experience. Every project I work on is approached with the 
                      goal of creating something that not only meets user needs but exceeds 
                      their expectations.
                    </p>
                    <p>
                      I specialize in mobile app design, web applications, and design systems 
                      that scale. My work has helped companies increase user engagement, 
                      improve conversion rates, and build stronger brand relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-center fw-bold mb-5">Skills & Expertise</h2>
            <div className="row g-4">
              {skills.map((skill, index) => (
                <div key={index} className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <i className={`${skill.icon} text-primary me-2`}></i>
                          <h6 className="mb-0 fw-bold">{skill.name}</h6>
                        </div>
                        <span className="text-muted small">{skill.level}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-center fw-bold mb-5">Professional Experience</h2>
            <div className="row">
              {experiences.map((exp, index) => (
                <div key={index} className="col-lg-4 mb-4">
                  <div className="card h-100 border-start border-primary border-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-1">{exp.title}</h5>
                        <span className="badge bg-primary">{exp.year}</span>
                      </div>
                      <h6 className="text-muted mb-2">{exp.company}</h6>
                      <p className="text-muted small">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="card-body text-center p-5">
                <h3 className="mb-3">Let's Create Something Amazing Together</h3>
                <p className="lead mb-4">
                  Ready to transform your ideas into exceptional user experiences? 
                  I'd love to hear about your project.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-light btn-lg">
                    <i className="fas fa-envelope me-2"></i>
                    Get In Touch
                  </button>
                  <button className="btn btn-outline-light btn-lg">
                    <i className="fas fa-download me-2"></i>
                    Download Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
