import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import CaseStudiesPage from './components/CaseStudiesPage';
import ProfilePage from './components/ProfilePage';
import Q10UXLogo from './components/Q10UXLogo';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActivePage(hash);
      } else {
        setActivePage('home');
      }
    };

    // Set initial page
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'case-studies':
        return <CaseStudiesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation activePage={activePage} />
      
      {/* Main Content with top padding for fixed navbar */}
      <main style={{ paddingTop: '80px' }}>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <Q10UXLogo size="small" showText={true} />
                <span className="text-muted">© 2024 Q10UX. All rights reserved.</span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3">
                <a href="#" className="text-white text-decoration-none social-icon">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-white text-decoration-none social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white text-decoration-none social-icon">
                  <i className="fab fa-dribbble"></i>
                </a>
                <a href="#" className="text-white text-decoration-none social-icon">
                  <i className="fab fa-behance"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
