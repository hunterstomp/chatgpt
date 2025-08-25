# CaseStudyGallery Component

A production-ready React gallery component with lightbox functionality, built for the Q10UX portfolio.

## Features

- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation, focus management, and screen reader support
- **Performance**: Lazy loading, intersection observer hydration, optimized image loading
- **UX**: Hover captions, keyboard shortcuts (Esc, arrow keys), swipe gestures, focus trap
- **Responsive**: Grid layout that adapts to screen size
- **No Dependencies**: Pure React with inline styles, no external libraries

## Usage

### In Astro Layouts

```astro
---
import CaseStudyGallery from '@/components/CaseStudyGallery.astro';
const { frontmatter } = Astro.props;
const images = frontmatter?.gallery ?? [];
---

{images.length > 0 && (
  <CaseStudyGallery images={images} />
)}
```

### In MDX Pages

```mdx
---
title: "My Case Study"
gallery:
  - { src: "/path/to/image.webp", alt: "Description", caption: "Optional caption" }
  - { src: "/path/to/image2.webp", alt: "Description 2" }
---
```

### Direct React Usage

```tsx
import CaseStudyGallery from '@/components/CaseStudyGallery.tsx';

const images = [
  { src: "/path/to/image.webp", alt: "Description", caption: "Caption" }
];

<CaseStudyGallery items={images} />
```

## Gallery Item Structure

```typescript
type GalleryItem = {
  src: string;                // Image path
  alt: string;                // Alt text (required)
  caption?: string;           // Optional caption
  sources?: Source[];         // Optional <picture> sources
  width?: number;             // Optional intrinsic width
  height?: number;            // Optional intrinsic height
};
```

## Keyboard Shortcuts

- **Escape**: Close lightbox
- **Arrow Left/Right**: Navigate between images
- **Tab**: Navigate between controls (focus trap)

## Accessibility Features

- Modal role with proper ARIA attributes
- Focus trap in lightbox
- Keyboard navigation
- Screen reader announcements
- High contrast controls
- Reduced motion support (planned)

## Performance Features

- Lazy loading for thumbnails
- Intersection observer for hydration
- Optimized image loading with `<picture>` element
- Minimal bundle size (no external deps)