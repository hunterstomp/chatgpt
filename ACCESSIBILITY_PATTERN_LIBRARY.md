# 🎯 Accessibility Pattern Library

## Overview
This pattern library provides reusable CSS classes and components for implementing WCAG 2.1 AA accessibility standards across the Q10UX portfolio site.

## 📁 File Structure
```
src/styles/
├── accessibility-patterns.css    # Main pattern library
└── q10ux.css                     # Site-specific styles

ACCESSIBILITY_PATTERN_LIBRARY.md  # This documentation
```

## 🎨 Pattern Categories

### 1. Skip Links
**Purpose**: Allow keyboard users to skip navigation and jump to main content.

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

**CSS Class**: `.skip-link`
- Positioned off-screen by default
- Appears on focus
- High contrast styling
- Z-index ensures visibility

### 2. Focus Indicators
**Purpose**: Provide clear visual feedback for keyboard navigation.

```css
.focus-visible {
  outline: 2px solid var(--primary-color, #007bff);
  outline-offset: 2px;
}
```

**Applied to**:
- Buttons (`.btn:focus`)
- Navigation links (`.nav-link:focus`)
- Form controls (`.form-control:focus`)
- Interactive cards (`.skill-item:focus`)

### 3. High Contrast Text
**Purpose**: Ensure sufficient contrast for text readability.

```css
.text-high-contrast {
  color: #1a1a1a !important;  /* Near black */
}

.text-high-contrast-light {
  color: #333 !important;     /* Dark gray */
}
```

### 4. Semantic Elements
**Purpose**: Make non-semantic elements accessible to screen readers.

```css
.clickable-div {
  cursor: pointer;
  tabindex: 0;
  role: button;
}
```

### 5. Image Accessibility
**Purpose**: Provide proper alt text and roles for images.

```html
<!-- Decorative images -->
<img src="decoration.png" alt="" role="presentation" class="decorative-image">

<!-- Content images -->
<img src="content.png" alt="Descriptive text" class="content-image">
```

### 6. Form Accessibility
**Purpose**: Ensure forms are accessible to all users.

```css
.form-label-required::after {
  content: " *";
  color: #dc3545;
  font-weight: bold;
}
```

### 7. ARIA Improvements
**Purpose**: Enhance screen reader experience.

```css
[role="status"]::before {
  content: "Status: ";
  font-weight: bold;
}
```

### 8. Keyboard Navigation
**Purpose**: Enable full keyboard navigation.

```css
.keyboard-focusable {
  tabindex: 0;
}
```

### 9. Screen Reader Utilities
**Purpose**: Hide content visually while keeping it available to screen readers.

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 10. Lightbox Accessibility
**Purpose**: Make image galleries accessible.

```css
.lightbox-overlay {
  role: dialog;
  aria-modal: true;
  aria-label: "Image gallery";
}
```

## 🚀 Usage Examples

### Basic Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/src/styles/accessibility-patterns.css">
</head>
<body>
  <!-- Skip link -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <!-- Header -->
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation content -->
    </nav>
  </header>
  
  <!-- Main content -->
  <main id="main-content" role="main" class="content-landmark">
    <!-- Page content -->
  </main>
  
  <!-- Footer -->
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Interactive Components
```html
<!-- Skills grid with accessibility -->
<div class="skills-grid">
  <div class="skill-item keyboard-focusable" 
       role="button" 
       tabindex="0" 
       aria-label="View details about Figma">
    <img src="figma-logo.png" alt="Figma logo">
    <h5>Figma</h5>
    <p>Design and prototyping tool</p>
  </div>
</div>

<!-- Testimonial with accessibility -->
<article class="testimonial-card" role="article" aria-label="Testimonial from John Doe">
  <div class="testimonial-stars" aria-label="5 out of 5 stars" role="img">
    ★★★★★
  </div>
  <blockquote class="testimonial-text">
    "Excellent work on our project..."
  </blockquote>
  <cite class="testimonial-author">John Doe, CEO</cite>
</article>
```

### Form Accessibility
```html
<form class="needs-validation" novalidate>
  <div class="form-group">
    <label for="email" class="form-label form-label-required">
      Email Address
    </label>
    <input type="email" 
           class="form-control" 
           id="email" 
           name="email" 
           required 
           aria-describedby="email-help email-error">
    <div id="email-help" class="form-text">
      We'll never share your email with anyone else.
    </div>
    <div id="email-error" class="form-error" role="alert">
      Please provide a valid email address.
    </div>
  </div>
</form>
```

## 🎯 Implementation Guidelines

### 1. Always Include Skip Links
Every page should have a skip link for keyboard users.

### 2. Use Semantic HTML
Prefer semantic elements over generic divs:
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for self-contained content
- `<section>` for thematic grouping

### 3. Provide Alt Text
- **Content images**: Descriptive alt text
- **Decorative images**: Empty alt with `role="presentation"`
- **Functional images**: Describe the function

### 4. Ensure Keyboard Navigation
- All interactive elements must be focusable
- Provide clear focus indicators
- Test tab order is logical

### 5. Use ARIA Appropriately
- `aria-label` for unlabeled elements
- `aria-describedby` for additional context
- `aria-live` for dynamic content
- `role` for semantic meaning

### 6. Test with Screen Readers
- Test with NVDA (Windows)
- Test with VoiceOver (macOS)
- Test with JAWS (Windows)

## 🔧 Customization

### CSS Variables
The pattern library uses CSS variables for consistent theming:

```css
:root {
  --primary-color: #007bff;
  --error-color: #dc3545;
  --success-color: #198754;
  --focus-outline-width: 2px;
  --focus-outline-offset: 2px;
}
```

### Responsive Considerations
```css
@media (max-width: 768px) {
  .skip-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
  .text-high-contrast {
    color: #ffffff !important;
  }
}
```

## 🧪 Testing Checklist

### Automated Testing
- [ ] Run accessibility checker
- [ ] Validate HTML structure
- [ ] Check color contrast ratios
- [ ] Verify ARIA attributes

### Manual Testing
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- [ ] Screen reader testing
- [ ] Focus management
- [ ] Skip link functionality
- [ ] Form validation and error handling

### Browser Testing
- [ ] Chrome with ChromeVox
- [ ] Firefox with NVDA
- [ ] Safari with VoiceOver
- [ ] Edge with Narrator

## 📚 Resources

### WCAG Guidelines
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/AA/)
- [Understanding WCAG](https://www.w3.org/WAI/WCAG21/Understanding/)

### Tools
- [axe DevTools](https://www.deque.com/axe/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Documentation
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Web.dev Accessibility](https://web.dev/accessibility/)

## 🔄 Maintenance

### Regular Updates
- Review and update patterns quarterly
- Test with new browser versions
- Update based on user feedback
- Monitor accessibility standards changes

### Version Control
- Document breaking changes
- Maintain backward compatibility
- Test patterns across all pages
- Update documentation with changes

---

*This pattern library is designed to ensure the Q10UX portfolio meets WCAG 2.1 AA standards and provides an excellent experience for all users.*
