import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import Breadcrumbs from '../molecules/Breadcrumbs';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Navigation */}
      <Header />
      
      {/* Breadcrumbs for subpages */}
      {location.pathname !== '/' && (
        <div className="container-wide">
          <Breadcrumbs />
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
