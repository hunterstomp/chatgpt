# Q10UX Portfolio - Modern UX Design Portfolio

A comprehensive, responsive portfolio showcasing UX design work with case studies, interactive elements, and modern design patterns.

## 🚀 Quick Start

### Local Development
```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/src/
```

### Deployment
```bash
# Deploy to Netlify
netlify deploy --prod
```

## 📁 Project Structure

```
src/
├── index.html                 # Main portfolio page
├── about/                     # About page
├── contact/                   # Contact form
├── case-studies/             # Case study pages
│   ├── index.html            # Case studies hub
│   ├── microsoft-office-365.html
│   ├── tmobile-idea-lab.html
│   ├── att-international-roaming.html
│   ├── atmosfx-ecommerce.html
│   └── bmgf/
├── styles/
│   └── q10ux.css            # Main design system
├── scripts/
│   ├── main.js              # Core functionality
│   └── case-study-navigation.js
├── partials/                 # Reusable components
│   ├── header.html
│   ├── footer.html
│   └── case-study-navigation.html
└── assets/
    └── images/              # Portfolio images
```

## 🎨 Design System

### Core Features
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
- **Modern CSS**: Flexbox, Grid, CSS Custom Properties, and smooth animations
- **Typography**: Google Fonts (Roboto Condensed, Inter) with proper hierarchy
- **Color Palette**: Dark theme with accent colors and proper contrast

### Key Components
- **Navigation**: Fixed header with dropdown menus and mobile hamburger
- **Hero Sections**: Full-screen with gradient overlays and centered content
- **Case Study Cards**: Hover effects with backdrop blur and smooth transitions
- **Contact Forms**: Accessible forms with proper validation
- **Case Study Navigation**: Previous/Next navigation between studies

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 576px) { /* Extra Small */ }
@media (max-width: 768px) { /* Small */ }
@media (min-width: 769px) and (max-width: 1024px) { /* Medium */ }
@media (min-width: 1025px) { /* Large */ }
```

## 🔧 Development

### Prerequisites
- Python 3.x (for local server)
- Modern web browser
- Git

### Setup
1. Clone the repository
2. Navigate to project directory
3. Start local server: `python3 -m http.server 8000`
4. Open `http://localhost:8000/src/`

### File Organization
- **HTML**: Semantic structure with proper accessibility attributes
- **CSS**: Modular design system with consistent naming conventions
- **JavaScript**: Vanilla JS with modular functions and classes
- **Images**: Optimized for web with proper alt text

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Build command: `echo "Static site - no build required"`
   - Publish directory: `src/`
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=src
```

## 📋 Case Studies

### Available Studies
1. **Microsoft Office 365** - Enterprise UX redesign
2. **T-Mobile Idea Lab** - Innovation platform design
3. **AT&T International Roaming** - Mobile app design
4. **AtmosFX E-commerce** - Digital retail experience
5. **BMGF** - Healthcare platform design

### Case Study Structure
Each case study follows an 8-phase UX process:
1. **Research** - User research and insights
2. **Strategy** - Design strategy and goals
3. **Ideation** - Brainstorming and concept development
4. **Design** - Wireframes and visual design
5. **Prototype** - Interactive prototypes
6. **Test** - User testing and validation
7. **Iterate** - Refinement based on feedback
8. **Launch** - Final implementation and results

## 🎯 Features

### Interactive Elements
- **Smooth Scrolling**: CSS-based smooth scrolling navigation
- **Hover Effects**: Subtle animations and transitions
- **Form Validation**: Client-side validation with accessibility
- **Dynamic Content**: JavaScript-powered content loading
- **Responsive Images**: Optimized images for all screen sizes

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators

### Performance
- **Optimized Images**: WebP format with fallbacks
- **Minified CSS**: Production-ready stylesheets
- **Lazy Loading**: Images load as needed
- **Fast Loading**: Optimized for Core Web Vitals

## 🔍 Quality Assurance

### Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on all devices
- [ ] Forms submit correctly
- [ ] Images display properly
- [ ] Links are functional
- [ ] Accessibility standards met
- [ ] Performance metrics acceptable

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

### Additional Resources
- `NETLIFY_DEPLOYMENT.md` - Detailed deployment instructions
- `ACCESSIBILITY_REPORT.md` - Accessibility audit results
- `BUG_BASH_REPORT.md` - Quality assurance findings
- `CASE_STUDIES_COMPLETION_SUMMARY.md` - Case study details

### Maintenance
- Regular accessibility audits
- Performance monitoring
- Content updates
- Security updates
- Browser compatibility testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for portfolio purposes. All case study content and designs are the property of their respective clients and companies.

## 📞 Contact

- **Portfolio**: [https://portfolio.q10ux.com](https://portfolio.q10ux.com)
- **Email**: [Contact through portfolio](https://portfolio.q10ux.com/contact)
- **LinkedIn**: [Quentin Little](https://linkedin.com/in/quentinlittle)

---

**Built with ❤️ using modern web standards and accessibility best practices.**
