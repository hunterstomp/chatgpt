import React, { useState, useEffect } from 'react';
import Q10UXLogo from './Q10UXLogo';

const Navigation = ({ activePage = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'case-studies', label: 'Case Studies', href: '#case-studies' },
    { id: 'profile', label: 'About Me', href: '#profile' }
  ];

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="#home">
          <Q10UXLogo size="medium" />
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.id}>
                <a
                  className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
