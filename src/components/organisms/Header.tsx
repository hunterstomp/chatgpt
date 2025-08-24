import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import NavigationItem from '../molecules/NavigationItem';
import ThemeToggle from '../atoms/ThemeToggle';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/case-studies', label: 'Portfolio', icon: '💼' },
    { to: '/about', label: 'About', icon: '👤' },
    { to: '/contact', label: 'Contact', icon: '📧' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-soft border-b border-neutral-200/50 dark:border-neutral-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            aria-label="Go to homepage"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl group-hover:scale-105 transition-transform duration-200">
              Q
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              Quentin Little
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.to)}
              />
            ))}
            
            {/* Resume Download CTA */}
            <Link
              to="/resume"
              className="btn-primary btn-sm ml-4"
              aria-label="Download resume"
            >
              📄 Resume
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav
              className="py-4 border-t border-neutral-200 dark:border-neutral-800"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      isActive(item.to)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Resume CTA */}
                <Link
                  to="/resume"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📄</span>
                  <span className="font-medium">Download Resume</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
