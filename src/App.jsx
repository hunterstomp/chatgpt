import Header from './components/Header';
import Hero from './components/Hero';
import CreatorsSection from './components/CreatorsSection';
import ToolsIntegration from './components/ToolsIntegration';
import PartnersShowcase from './components/PartnersShowcase';
import ProjectGallery from './components/ProjectGallery';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CaseStudy from './components/CaseStudy';

function App() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <Header />
      <Hero />
      <CreatorsSection />
      <ToolsIntegration />
      <PartnersShowcase />
      <ProjectGallery />
      <CaseStudy />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
