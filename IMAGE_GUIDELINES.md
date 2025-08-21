# Q10UX Portfolio Image Guidelines

## Overview
This document provides comprehensive guidelines for naming, tagging, and optimizing images for the Q10UX portfolio case study galleries. All case studies use a standardized 6x8 grid (48 images total) showcasing the complete UX design process.

## Gallery Structure (6x8 Grid)

### Row 1: Research & Discovery (Images 01-06)
- **01**: User Research - Interview sessions and insights
- **02**: Competitive Analysis - Market research and benchmarking
- **03**: User Journey Mapping - Customer journey mapping
- **04**: User Personas - Target audience profiles
- **05**: Pain Points Analysis - Key user frustrations identified
- **06**: Opportunity Areas - Design improvement areas

### Row 2: Ideation & Concepts (Images 07-12)
- **07**: Brainstorming Sessions - Ideation and concept generation
- **08**: Initial Sketches - Hand-drawn concept sketches
- **09**: Low-Fidelity Wireframes - Layout concepts
- **10**: User Flow Diagrams - Navigation and interaction flows
- **11**: Information Architecture - Content structure and hierarchy
- **12**: Concept Selection - Final direction chosen

### Row 3: Design & Prototyping (Images 13-18)
- **13**: High-Fidelity Mockups - Visual designs
- **14**: Design System Components - Component library and patterns
- **15**: Interaction Design - Micro-interactions and animations
- **16**: Interactive Prototype - Clickable prototype
- **17**: Responsive Design - Multi-device design variations
- **18**: Accessibility Features - WCAG 2.1 AA compliance features

### Row 4: Testing & Validation (Images 19-24)
- **19**: Usability Testing - User testing sessions and feedback
- **20**: Analytics & Metrics - Performance metrics and data
- **21**: Design Iterations - Refinements based on feedback
- **22**: Final Validation - User acceptance testing
- **23**: Performance Testing - Load time and optimization testing
- **24**: Final Review - Stakeholder approval and sign-off

### Row 5: Implementation & Handoff (Images 25-30)
- **25**: Design Specifications - Detailed specs for developers
- **26**: Design Assets - Icons, images, and design files
- **27**: Developer Handoff - Collaboration and handoff
- **28**: Quality Assurance - QA testing and bug fixes
- **29**: Product Launch - Release and deployment
- **30**: Post-Launch Monitoring - Performance tracking

### Row 6: Results & Impact (Images 31-36)
- **31**: Key Performance Metrics - KPIs and success metrics
- **32**: User Feedback - Post-launch user satisfaction
- **33**: Business Impact - ROI and business outcomes
- **34**: Lessons Learned - Key insights and takeaways
- **35**: Future Roadmap - Planned improvements and features
- **36**: Case Study Documentation - Complete documentation

### Row 7: Additional Screenshots (Images 37-42)
- **37**: Desktop Screenshots - Full desktop interface screens
- **38**: Tablet Screenshots - Tablet interface variations
- **39**: Mobile Screenshots - Mobile interface screens
- **40**: Detail Views - Close-up interface details
- **41**: Interface States - Loading, error, and empty states
- **42**: Animations & Transitions - Micro-interactions

### Row 8: Process Documentation (Images 43-48)
- **43**: Project Timeline - Milestones and phases
- **44**: Team Collaboration - Cross-functional collaboration
- **45**: Design Tools - Tools and software used
- **46**: Design Methodology - Design thinking and process
- **47**: Challenges & Solutions - Key challenges and solutions
- **48**: Project Summary - Overview and outcomes

## Image Naming Convention

### Format
```
{project-name}-{number:02d}-{category}-{description}.{extension}
```

### Examples
```
atmosfx-01-research-user-interviews.webp
tmobile-13-design-mockups.webp
bmgf-25-implementation-specs.webp
```

### Naming Rules
1. **Project Name**: Use lowercase, no spaces (e.g., `atmosfx`, `tmobile`, `bmgf`)
2. **Number**: Always 2 digits with leading zero (01, 02, 03...)
3. **Category**: Use descriptive category (research, ideation, design, testing, implementation, results, screens, process)
4. **Description**: Use kebab-case for description (user-interviews, competitive-analysis, etc.)
5. **Extension**: Use `.webp` for optimized images

## File Structure

### Directory Organization
```
public/mamp-images/fpo/
├── {project-name}/
│   ├── {project-name}-01-research-user-interviews.webp
│   ├── {project-name}-01-research-user-interviews-thumb.webp
│   ├── {project-name}-02-research-competitive-analysis.webp
│   ├── {project-name}-02-research-competitive-analysis-thumb.webp
│   └── ...
```

### File Types
- **Full Images**: High-resolution images for lightbox viewing (1920x1080 or larger)
- **Thumbnails**: Optimized thumbnails for gallery grid (400x300, 4:3 aspect ratio)

## Image Optimization Guidelines

### Technical Specifications

#### Full Images (Lightbox)
- **Format**: WebP (preferred) or JPEG
- **Resolution**: 1920x1080 minimum, 2560x1440 recommended
- **File Size**: Maximum 2MB per image
- **Quality**: 85-90% for WebP, 80-85% for JPEG
- **Color Space**: sRGB
- **Metadata**: Include copyright and description

#### Thumbnails (Gallery Grid)
- **Format**: WebP (preferred) or JPEG
- **Resolution**: 400x300 pixels (4:3 aspect ratio)
- **File Size**: Maximum 50KB per thumbnail
- **Quality**: 75-80% for WebP, 70-75% for JPEG
- **Color Space**: sRGB
- **Metadata**: Minimal metadata for faster loading

### Optimization Tools
- **WebP Conversion**: Use `cwebp` command-line tool or online converters
- **Image Compression**: Use tools like TinyPNG, ImageOptim, or Squoosh
- **Batch Processing**: Use ImageMagick or similar for bulk operations

### Command Line Examples
```bash
# Convert to WebP with optimization
cwebp -q 85 -m 6 -af -f 50 -sharpness 0 -mt -v input.jpg -o output.webp

# Resize and optimize thumbnail
convert input.jpg -resize 400x300^ -gravity center -extent 400x300 -quality 80 output-thumb.webp

# Batch processing
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

## Alt Text Guidelines

### Format
```
{Category}: {Specific Description} - {Context/Details}
```

### Examples
```
Research: User interview sessions with target audience members discussing media player pain points
Design: High-fidelity mockup of main interface showing content grid and navigation elements
Testing: Usability testing session with participant interacting with mobile prototype
```

### Alt Text Rules
1. **Be Descriptive**: Provide enough detail for screen readers
2. **Include Context**: Mention the design phase or purpose
3. **Keep Concise**: Maximum 125 characters
4. **Avoid Redundancy**: Don't repeat information already in captions
5. **Use Proper Grammar**: Complete sentences with proper punctuation

## Caption Guidelines

### Format
```
**{Title}**<br>
{Description}
```

### Examples
```
**User Research**<br>
Interview sessions and insights
**Design Mockups**<br>
High-fidelity visual designs
**Usability Testing**<br>
User testing sessions and feedback
```

### Caption Rules
1. **Bold Title**: Use `<strong>` tags for the main title
2. **Brief Description**: One line describing the content
3. **Consistent Style**: Use same format across all images
4. **Clear Language**: Avoid jargon, use plain English
5. **Action-Oriented**: Use active voice when possible

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio for text on images
- **Text Alternatives**: All images must have descriptive alt text
- **Keyboard Navigation**: Gallery items must be keyboard accessible
- **Focus Indicators**: Clear focus states for interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions

### Implementation
```html
<div class="q10ux-gallery-item" 
     data-lightbox="/path/to/full-image.webp"
     tabindex="0"
     role="button"
     aria-label="View full image: {Description}">
  <img src="/path/to/thumbnail.webp" 
       alt="{Alt text}"
       loading="lazy">
  <div class="gallery-caption">
    <strong>{Title}</strong><br>
    {Description}
  </div>
</div>
```

## Performance Optimization

### Loading Strategy
- **Lazy Loading**: Use `loading="lazy"` for images below the fold
- **Progressive Loading**: Load thumbnails first, then full images on demand
- **Preloading**: Preload critical images (first row)
- **Caching**: Set appropriate cache headers for static assets

### CDN Configuration
- **Image Optimization**: Use CDN image optimization features
- **Format Selection**: Serve WebP to supported browsers, fallback to JPEG
- **Responsive Images**: Use `srcset` for different screen sizes
- **Compression**: Enable automatic compression and optimization

## Quality Assurance Checklist

### Before Upload
- [ ] Images follow naming convention
- [ ] Both full and thumbnail versions created
- [ ] File sizes within limits
- [ ] Alt text written and tested
- [ ] Captions consistent with template
- [ ] Images optimized for web
- [ ] Color contrast meets accessibility standards
- [ ] Metadata includes copyright information

### After Upload
- [ ] Images display correctly in gallery
- [ ] Lightbox functionality works
- [ ] Alt text displays in screen readers
- [ ] Loading performance acceptable
- [ ] Responsive behavior correct
- [ ] Accessibility features working
- [ ] Cross-browser compatibility verified

## Tools and Resources

### Image Editing
- **Adobe Photoshop**: Professional image editing
- **Figma**: Design and export capabilities
- **Sketch**: Mac-based design tool
- **GIMP**: Free alternative to Photoshop

### Optimization Tools
- **ImageOptim**: Mac-based image optimization
- **TinyPNG**: Online compression tool
- **Squoosh**: Google's image optimization tool
- **ImageMagick**: Command-line image processing

### Validation Tools
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Performance and accessibility testing
- **Color Contrast Analyzer**: WCAG compliance checking
- **Screen Reader Testing**: NVDA, JAWS, VoiceOver

## Best Practices Summary

1. **Consistency**: Follow naming conventions strictly
2. **Quality**: Optimize for both quality and file size
3. **Accessibility**: Always include descriptive alt text
4. **Performance**: Use modern formats and lazy loading
5. **Organization**: Maintain clear file structure
6. **Documentation**: Keep records of image sources and licenses
7. **Testing**: Verify across devices and browsers
8. **Backup**: Keep original high-resolution files

## Template Files

### Gallery HTML Template
```html
<div class="q10ux-gallery-item" data-lightbox="/public/mamp-images/fpo/{project}-{number:02d}-{category}-{description}.webp">
  <img src="/public/mamp-images/fpo/{project}-{number:02d}-{category}-{description}-thumb.webp" 
       alt="{Category}: {Description} - {Context}">
  <div class="gallery-caption">
    <strong>{Title}</strong><br>
    {Description}
  </div>
</div>
```

### CSS Classes
```css
.q10ux-gallery {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin: 48px 0;
}

.q10ux-gallery-item {
  aspect-ratio: 4/3;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}
```

This comprehensive guide ensures consistent, high-quality, and accessible image management across all Q10UX case studies.
