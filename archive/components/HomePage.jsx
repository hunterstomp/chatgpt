import React from 'react';
import ImageGallery from './ImageGallery';
import Q10UXLogo from './Q10UXLogo';

const HomePage = () => {
  return (
    <section id="home" className="min-vh-100 d-flex align-items-center">
      <div className="container-fluid">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-3">
                Welcome to <span className="text-primary">Q10UX</span>
              </h1>
              <p className="lead mb-4">
                Exploring the intersection of design, technology, and user experience
              </p>
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <Q10UXLogo size="large" />
                <div className="text-start">
                  <h5 className="mb-1">Portfolio Showcase</h5>
                  <p className="text-muted mb-0">Interactive image gallery with advanced controls</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">
                  <i className="fas fa-images me-2"></i>
                  Interactive Image Gallery
                </h3>
                <p className="mb-0 mt-2 opacity-75">
                  Experience our Bootstrap-powered gallery with lightbox and serial flow control
                </p>
              </div>
              <div className="card-body p-0">
                <ImageGallery autoPlay={true} autoPlayInterval={4000} />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3>Gallery Features</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <i className="fas fa-mobile-alt fa-2x text-primary mb-2"></i>
                      <h5>Responsive Design</h5>
                      <p className="text-muted">Works perfectly on all devices with Bootstrap grid system</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <i className="fas fa-keyboard fa-2x text-success mb-2"></i>
                      <h5>Keyboard Navigation</h5>
                      <p className="text-muted">Arrow keys, spacebar, and escape for full control</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <i className="fas fa-random fa-2x text-warning mb-2"></i>
                      <h5>Serial Flow Control</h5>
                      <p className="text-muted">Auto-play, shuffle, and custom navigation controls</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
