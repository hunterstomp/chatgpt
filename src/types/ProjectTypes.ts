// Core project types for the UX portfolio

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  summary: string;
  year: number;
  duration: string;
  role: string;
  skills: string[];
  category: ProjectCategory;
  images: ProjectImage[];
  deliverables: Deliverable[];
  process: ProcessStep[];
  results: string[];
  challenges: string[];
  solutions: string[];
  technologies: string[];
  url?: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  thumbnail?: string;
  category: ImageCategory;
}

export interface Deliverable {
  id: string;
  name: string;
  type: DeliverableType;
  url: string;
  size: string;
  description?: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  images?: ProjectImage[];
  order: number;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject: string;
  phone?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-100
  years: number;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  rating: number;
  projectId?: string;
  avatar?: string;
}

// Enums
export enum ProjectCategory {
  UX_DESIGN = 'ux-design',
  UI_DESIGN = 'ui-design',
  RESEARCH = 'research',
  PROTOTYPING = 'prototyping',
  STRATEGY = 'strategy',
  DEVELOPMENT = 'development'
}

export enum ImageCategory {
  HERO = 'hero',
  PROCESS = 'process',
  DELIVERABLE = 'deliverable',
  GALLERY = 'gallery',
  THUMBNAIL = 'thumbnail'
}

export enum DeliverableType {
  PDF = 'pdf',
  PRESENTATION = 'presentation',
  PROTOTYPE = 'prototype',
  REPORT = 'report',
  DESIGN_FILE = 'design-file'
}

export enum SkillCategory {
  DESIGN = 'design',
  RESEARCH = 'research',
  PROTOTYPING = 'prototyping',
  DEVELOPMENT = 'development',
  TOOLS = 'tools',
  METHODOLOGY = 'methodology'
}

// Component Props Types
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  title: string;
  description?: string;
  image?: ProjectImage;
  actions?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface GalleryItemProps {
  project: Project;
  onClick?: (project: Project) => void;
  className?: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactForm) => void;
  loading?: boolean;
  className?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
