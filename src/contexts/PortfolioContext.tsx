import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types/ProjectTypes';

interface PortfolioContextType {
  projects: Project[];
  featuredProjects: Project[];
  filteredProjects: Project[];
  loading: boolean;
  error: string | null;
  selectedCategory: ProjectCategory | 'all';
  searchQuery: string;
  setSelectedCategory: (category: ProjectCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  getProjectById: (id: string) => Project | undefined;
  refreshProjects: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: React.ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects based on category and search query
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured);

  // Get project by ID
  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  // Load projects from API or local storage
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use mock data. In production, this would be an API call
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Microsoft Office Live Redesign',
          client: 'Microsoft',
          description: 'Complete redesign of Microsoft Office Live platform focusing on user experience and modern design principles.',
          summary: 'A comprehensive UX/UI redesign that improved user engagement by 40% and reduced task completion time by 25%.',
          year: 2024,
          duration: '6 months',
          role: 'Lead UX Designer',
          skills: ['UX Design', 'UI Design', 'User Research', 'Prototyping'],
          category: ProjectCategory.UX_DESIGN,
          images: [],
          deliverables: [],
          process: [],
          results: [
            '40% increase in user engagement',
            '25% reduction in task completion time',
            '95% user satisfaction score'
          ],
          challenges: [
            'Complex legacy system integration',
            'Diverse user base requirements',
            'Strict accessibility standards'
          ],
          solutions: [
            'Comprehensive user research and testing',
            'Iterative design process with stakeholder feedback',
            'Accessibility-first design approach'
          ],
          technologies: ['Figma', 'Sketch', 'InVision', 'UserTesting'],
          featured: true,
          published: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-07-20')
        },
        {
          id: '2',
          title: 'T-Mobile Digital Voice Assistants',
          client: 'T-Mobile',
          description: 'Design and development of AI-powered voice assistant interface for mobile applications.',
          summary: 'Created an intuitive voice interaction system that handles complex customer service scenarios with 90% accuracy.',
          year: 2024,
          duration: '8 months',
          role: 'UX Designer & Researcher',
          skills: ['UX Research', 'Voice UI Design', 'AI/ML', 'Prototyping'],
          category: ProjectCategory.RESEARCH,
          images: [],
          deliverables: [],
          process: [],
          results: [
            '90% accuracy in voice recognition',
            '60% reduction in call center volume',
            '4.8/5 user satisfaction rating'
          ],
          challenges: [
            'Complex voice interaction patterns',
            'Integration with existing systems',
            'Ensuring accessibility compliance'
          ],
          solutions: [
            'Extensive user research and testing',
            'Iterative voice pattern design',
            'Comprehensive accessibility testing'
          ],
          technologies: ['VoiceFlow', 'Figma', 'UserTesting', 'Python'],
          featured: true,
          published: true,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-08-15')
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(mockProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const value: PortfolioContextType = {
    projects,
    featuredProjects,
    filteredProjects,
    loading,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    getProjectById,
    refreshProjects,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
