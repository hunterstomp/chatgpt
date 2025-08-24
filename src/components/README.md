# Atomic Design Component Hierarchy

## Overview
This portfolio follows Atomic Design principles to create a scalable, maintainable component system.

## Component Hierarchy

### 🧪 Atoms (Basic Building Blocks)
**Location**: `src/components/atoms/`

- **Button** - Primary, secondary, and tertiary buttons
- **Input** - Form inputs, text areas, and search fields
- **Typography** - Headings, paragraphs, and text elements
- **Icon** - SVG icons and icon components
- **Image** - Optimized image components with lazy loading
- **Link** - Navigation and external links
- **Badge** - Status indicators and tags
- **Avatar** - Profile images and user avatars

### 🔬 Molecules (Simple Combinations)
**Location**: `src/components/molecules/`

- **NavigationItem** - Individual navigation links with icons
- **SearchBar** - Search input with submit button
- **Card** - Content containers with headers and actions
- **FormField** - Input with label and validation
- **GalleryItem** - Image with caption and overlay
- **ContactInfo** - Contact details with icons
- **SkillBadge** - Skill display with proficiency level
- **ProjectMeta** - Project metadata display

### 🧬 Organisms (Complex UI Sections)
**Location**: `src/components/organisms/`

- **Header** - Main navigation with logo and menu
- **Footer** - Site footer with links and social media
- **ProjectGallery** - Filterable gallery of case studies
- **ContactForm** - Complete contact form with validation
- **CaseStudyHero** - Hero section for case study pages
- **SkillsSection** - Visual skills showcase
- **TestimonialCard** - Client testimonial display
- **ImageLightbox** - Modal image viewer

### 📄 Templates (Page Layouts)
**Location**: `src/components/templates/`

- **PortfolioLayout** - Main portfolio page template
- **CaseStudyLayout** - Case study page template
- **AboutLayout** - About page template
- **ContactLayout** - Contact page template
- **AdminLayout** - Admin dashboard template

### 📱 Pages (Complete Pages)
**Location**: `src/pages/`

- **HomePage** - Landing page with hero and featured work
- **CaseStudiesPage** - Portfolio gallery page
- **CaseStudyDetailPage** - Individual case study page
- **AboutPage** - Professional background page
- **ContactPage** - Contact form page
- **AdminPage** - Admin dashboard page

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `ProjectGallery.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `HomePage.tsx`)
- **Templates**: PascalCase with "Layout" suffix (e.g., `PortfolioLayout.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `useLocalStorage.ts`)
- **Types**: PascalCase with "Types" suffix (e.g., `ProjectTypes.ts`)

## Component Structure

Each component should follow this structure:
```
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Unit tests
├── ComponentName.stories.tsx  # Storybook stories
├── ComponentName.module.css   # Component styles
└── index.ts                   # Export file
```

## Usage Guidelines

1. **Reusability**: Components should be designed for reuse across the application
2. **Props Interface**: All components must have TypeScript interfaces for props
3. **Accessibility**: Components must follow WCAG 2.1 AA guidelines
4. **Responsive**: Components should be mobile-first and responsive
5. **Performance**: Use React.memo and useMemo where appropriate
6. **Testing**: Each component should have unit tests and Storybook stories
