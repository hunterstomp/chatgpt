# Q10UX Design Portfolio

A high-contrast, accessible UX design portfolio showcasing 20 years of experience creating user experiences for startups to enterprise businesses in the Age of AI.

## 🎨 Design System

Built with the **Q10UX Playbook** - a high-contrast dark theme optimized for accessibility and performance:

- **Typography**: Inter, Manrope, and Permanent Marker fonts
- **Colors**: High-contrast dark theme with cyan, magenta, and yellow accents
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive aria-labels
- **Performance**: Optimized images, lazy loading, and minimal dependencies

## 📁 Project Structure

```
src/
├── styles/
│   └── q10ux.css          # Q10UX design system
├── scripts/
│   └── app.js             # Main JavaScript functionality
├── partials/
│   ├── header.html        # Reusable header component
│   ├── footer.html        # Reusable footer component
│   └── social.html        # Social media links
├── case-studies/
│   ├── atmosfx-media-player/
│   ├── tmobile-how-to-switch/
│   ├── tmobile-idea-lab/
│   ├── att-international-roaming/
│   ├── atmosfx-ecommerce/
│   ├── bmgf/
│   └── microsoft-office-365/
└── index.html             # Main homepage
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3 (for local server)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd q10ux-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Or use Python server:
```bash
npm run serve
```

### Build for Production

```bash
npm run build
```

## 🎯 Features

### Accessibility (WCAG 2.1 AA)
- Comprehensive aria-labels on all interactive elements
- Keyboard navigation support
- High contrast color scheme
- Skip links and focus indicators
- Screen reader optimization

### Performance
- Optimized images with WebP format
- Lazy loading for non-critical content
- Minimal JavaScript footprint
- Fast loading times

### SEO
- Structured data (JSON-LD)
- Open Graph and Twitter Cards
- Semantic HTML5 markup
- Canonical URLs

## 📝 Case Study Structure

Each case study follows the Q10UX Playbook structure:

1. **Hero Section** - Project overview and key metrics
2. **Problem** - Challenge and business goals
3. **Approach** - Design process and methodology
4. **Outcomes** - Results and impact
5. **Gallery** - Design artifacts and prototypes
6. **Downloads** - Resources and assets
7. **Credits** - Team and NDA notes

## 🛠️ Development

### Adding New Case Studies

1. Create a new directory in `src/case-studies/`
2. Add `index.html` following the case study template
3. Update navigation in header partials
4. Add images to `/mamp-images/` directory
5. Update image references using `/mamp-images/` path

### Styling Guidelines

- Use Q10UX CSS variables for colors and spacing
- Follow the component structure in `q10ux.css`
- Ensure all interactive elements have aria-labels
- Test with keyboard navigation and screen readers

### Image Guidelines

- Use WebP format for optimal performance
- Include meaningful alt text
- Reference images as `/mamp-images/filename.webp`
- Optimize for web (compress appropriately)

## 📊 Analytics & Tracking

The portfolio includes:
- Google Analytics integration
- Hotjar for user behavior analysis
- Performance monitoring

## 🤝 Contributing

This portfolio follows the Q10UX Playbook guidelines:

1. Maintain high-contrast accessibility standards
2. Use semantic HTML5 markup
3. Include comprehensive aria-labels
4. Follow the established component structure
5. Test across different devices and assistive technologies

## 📄 License

Internal use only - Q10UX Design Portfolio
© 2024 Quentin Little (Q10UX). All rights reserved.

## �� Contact

- **Email**: design@q10ux.com
- **GitHub**: [hunterstomp](https://github.com/hunterstomp)
- **LinkedIn**: [quentinlittle](https://linkedin.com/in/quentinlittle)

---

Built with ❤️ and accessibility in mind by Q10UX Design.
