import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PortfolioProvider } from './contexts/PortfolioContext';

// Layout components
import Layout from './components/templates/Layout';

// Page components
import HomePage from './pages/HomePage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

// Import global styles
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Router>
          <div className="App min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="case-studies" element={<CaseStudiesPage />} />
                <Route path="case-studies/:id" element={<CaseStudyDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
