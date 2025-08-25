# Q10UX Portfolio

A modern, accessible UX portfolio built with Astro and the Q10UX Command Pack. Features enterprise case studies, design system tokens, and comprehensive accessibility compliance.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd q10ux-portfolio
npm install
```

2. **Install Astro dependencies:**
```bash
npm install astro @astrojs/mdx
```

3. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:4321` to see your portfolio!

## 📁 Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # Main layout with Q10UX tokens
├── pages/
│   ├── index.astro               # Homepage
│   ├── about.astro               # About page
│   ├── contact.astro             # Contact page
│   ├── case-studies/
│   │   ├── index.astro           # Case studies listing
│   │   └── [slug].mdx            # Individual case studies
│   └── api/
│       └── contact.js            # Contact form handler
└── Q10UX_Command_Pack/           # Design system & tools
    ├── styleguide/
    │   └── tokens.css            # Q10UX design tokens
    ├── templates/
    │   └── case-study.mdx        # Case study template
    └── scripts/                  # Build & optimization tools
```

## 🎨 Design System

The portfolio uses the Q10UX design system with:

- **Color Palette**: Extracted from your Q10 card
- **Typography**: Inter + Permanent Marker
- **Components**: Rigid button system (primary/secondary/tertiary/danger)
- **Accessibility**: WCAG 2.1 AA compliant
- **Tokens**: CSS custom properties for consistent theming

### Button Classes
```html
<a class="btn btn--primary">Primary Action</a>
<a class="btn btn--secondary">Secondary Action</a>
<button class="btn btn--tertiary">Tertiary Action</button>
<button class="btn btn--danger">Delete</button>
```

## 📝 Case Studies

### Creating a New Case Study

1. **Use the template:**
```bash
cp src/Q10UX_Command_Pack/templates/case-study.mdx src/pages/case-studies/your-project.mdx
```

2. **Update the frontmatter:**
```yaml
---
title: "Project Title — Client"
slug: "project-slug"
client: "Client Name"
role: ["UX Designer", "Prototyper"]
date: "2024-01-01"
tags: ["UX Design", "Enterprise", "Accessibility"]
hero: "/assets/case-studies/project-slug/hero.webp"
summary: "One-line value proposition"
outcomes: 
  metrics: ["Metric 1", "Metric 2"]
  quotes: ["Client quote"]
phases:
  - { id: research, title: "Research", summary: "What was done" }
  # ... more phases
---
```

3. **Add your content** following the template structure

### Case Study Structure
- **Hero Section**: Project overview and key metrics
- **Problem**: User and business challenges
- **Process**: 8-phase methodology
- **Solution**: Implementation details
- **Results**: Outcomes and learnings

## 🛠️ Command Pack Tools

The Q10UX Command Pack provides automated tools for:

### Image Management
```bash
# Consolidate scattered images into organized structure
npm run images:consolidate

# Optimize images for web (WebP + responsive sizes)
npm run images:opt

# Remap asset paths after reorganization
npm run assets:remap
```

### Quality Assurance
```bash
# Check for Mobirise classes/assets (prevents backsliding)
npm run guard:mobirise

# Accessibility sanity checks
npm run lint:a11y

# Run all checks
npm run check
```

### Git Workflow
```bash
# Checkpoint your work with descriptive messages
bash src/Q10UX_Command_Pack/scripts/git-phase.sh "feat: added new case study"
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables
Create a `.env` file for any API keys or configuration:
```env
# Contact form (optional)
CONTACT_EMAIL=hello@q10ux.com
SMTP_HOST=smtp.example.com
SMTP_USER=your-email
SMTP_PASS=your-password
```

## 📋 Development Workflow

1. **Start development:**
   ```bash
   npm run dev
   ```

2. **Create content:**
   - Use the case study template for new projects
   - Follow the design system tokens
   - Ensure accessibility compliance

3. **Quality checks:**
   ```bash
   npm run check
   ```

4. **Commit with context:**
   ```bash
   bash src/Q10UX_Command_Pack/scripts/git-phase.sh "descriptive message"
   ```

## 🎯 Key Features

- **Accessibility First**: WCAG 2.1 AA compliant
- **Performance Optimized**: Lazy loading, WebP images, minimal JS
- **SEO Ready**: Meta tags, structured data, sitemap
- **Mobile Responsive**: Works perfectly on all devices
- **Design System**: Consistent, token-driven styling
- **Case Study Template**: Structured, professional case studies
- **Contact Form**: Functional contact system
- **Build Tools**: Image optimization, quality checks

## 🔧 Customization

### Colors
Edit `src/Q10UX_Command_Pack/styleguide/tokens.css` to modify the color palette.

### Typography
Update font imports in `src/layouts/BaseLayout.astro`.

### Layout
Modify `src/layouts/BaseLayout.astro` for global layout changes.

### Case Studies
Use the template in `src/Q10UX_Command_Pack/templates/case-study.mdx` as your starting point.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build/)
- [Q10UX Command Pack](src/Q10UX_Command_Pack/README.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design System Documentation](src/Q10UX_Command_Pack/styleguide/)

## 🤝 Contributing

1. Follow the design system tokens
2. Ensure accessibility compliance
3. Run quality checks before committing
4. Use descriptive commit messages

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using the Q10UX Command Pack**
