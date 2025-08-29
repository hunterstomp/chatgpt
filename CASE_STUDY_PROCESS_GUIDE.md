# UX Process Image System Guide

## 🎯 **Overview**

The new UX Process Image System allows you to easily populate case studies with process-specific images that automatically organize into a beautiful, accessible timeline. Only steps with images will display, and numbers automatically adjust.

## 🚀 **Key Features**

- **Dynamic Steps**: Only shows process steps that have images
- **Auto-Numbering**: Step numbers automatically adjust (1, 2, 3... instead of 01, 02, 03...)
- **Image Galleries**: Each step can have multiple images with captions
- **Responsive Design**: Works perfectly on all devices
- **Accessible**: High contrast, readable text, proper alt tags
- **Cool Visuals**: Gradient backgrounds, animations, hover effects

## 📝 **How to Use**

### 1. **Add Process Images to Your Case Study**

In your case study markdown file, add the process image arrays to the frontmatter:

```yaml
---
layout: "@/layouts/CaseStudyLayout.astro"
title: Your Case Study
client: Client Name
role: UX Designer
year: 2025-01-01
# ... other frontmatter

# Process Images - Only steps with images will show
discoveryImages:
  - src: /path/to/discovery-image-1.jpg
    alt: Discovery phase image
    caption: "Stakeholder interviews revealed key insights"

researchImages:
  - src: /path/to/research-image-1.jpg
    alt: User research session
    caption: "User interviews with target customers"
  - src: /path/to/research-image-2.jpg
    alt: Survey results
    caption: "Survey analysis showing user preferences"

# ... continue for other steps
---
```

### 2. **Available Process Steps**

You can add images to any of these 10 process steps:

| Step ID | Step Name | Description |
|---------|-----------|-------------|
| `discoveryImages` | Discovery | Initial project exploration, stakeholder interviews |
| `researchImages` | Research | User interviews, surveys, competitive analysis |
| `analysisImages` | Analysis | Synthesizing findings, personas, journey maps |
| `strategyImages` | Strategy | Project goals, success metrics, roadmap |
| `ideationImages` | Ideation | Brainstorming, sketching, concept exploration |
| `wireframingImages` | Wireframing | Low-fidelity wireframes, information architecture |
| `prototypeImages` | Prototyping | Interactive prototypes, user flow testing |
| `visualDesignImages` | Visual Design | High-fidelity mockups, brand guidelines |
| `testingImages` | Testing | Usability testing, user feedback |
| `implementationImages` | Implementation | Final design specs, development handoff |

### 3. **Image Format**

Each image should follow this structure:

```yaml
- src: /path/to/your/image.jpg
  alt: Descriptive alt text for accessibility
  caption: "Optional caption explaining the image"
```

### 4. **Example Case Study Structure**

```yaml
---
layout: "@/layouts/CaseStudyLayout.astro"
title: "Amazing UX Project"
client: "Tech Company"
role: "Senior UX Designer"
year: "2025-01-01"
summary: "Redesigned mobile app for better user engagement"
slug: "amazing-ux-project"

# Process Images
discoveryImages:
  - src: /case-studies/amazing-ux-project/discovery-1.jpg
    alt: Stakeholder interview notes
    caption: "Key insights from stakeholder interviews"

researchImages:
  - src: /case-studies/amazing-ux-project/user-interview.jpg
    alt: User interview session
    caption: "User interview revealing pain points"
  - src: /case-studies/amazing-ux-project/survey-results.jpg
    alt: Survey data visualization
    caption: "Survey results showing user preferences"

wireframingImages:
  - src: /case-studies/amazing-ux-project/wireframe-1.jpg
    alt: Low-fidelity wireframe
    caption: "Initial wireframe for main user flow"

visualDesignImages:
  - src: /case-studies/amazing-ux-project/mockup-1.jpg
    alt: High-fidelity mockup
    caption: "Final visual design for main screen"
  - src: /case-studies/amazing-ux-project/mockup-2.jpg
    alt: Mobile app mockup
    caption: "Mobile responsive design"

testingImages:
  - src: /case-studies/amazing-ux-project/usability-test.jpg
    alt: Usability testing session
    caption: "User testing the prototype"

implementationImages:
  - src: /case-studies/amazing-ux-project/final-app.jpg
    alt: Final implemented app
    caption: "Live app in production"
---
```

## 🎨 **Visual Features**

### **Cool Design Elements**
- **Gradient Backgrounds**: Subtle gradients with accent colors
- **Pulsing Animations**: Step numbers have a subtle pulse effect
- **Hover Effects**: Cards lift and glow on hover
- **Timeline Design**: Visual timeline connecting all steps
- **Image Galleries**: Responsive grid layouts for multiple images

### **Accessibility Features**
- **High Contrast**: Dark backgrounds with light text for readability
- **Proper Alt Tags**: All images have descriptive alt text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Friendly**: Proper semantic structure
- **Responsive Text**: Text scales appropriately on all devices

## 📱 **Responsive Behavior**

- **Desktop**: Full timeline with side-by-side layout
- **Tablet**: Adjusted spacing and single-column gallery
- **Mobile**: Stacked layout with optimized touch targets

## 🔧 **Tips for Best Results**

1. **Image Quality**: Use high-quality images (minimum 800px width)
2. **Consistent Sizing**: Keep images similar aspect ratios for uniform galleries
3. **Descriptive Captions**: Add meaningful captions that explain the process
4. **Alt Text**: Write descriptive alt text for accessibility
5. **File Organization**: Keep images organized in case study folders

## 🚫 **What Happens If...**

- **No Images for a Step**: The step won't appear at all
- **Missing Alt Text**: Default alt text will be generated
- **Broken Image**: Image will show as broken, but layout remains intact
- **No Process Images**: Only the main content will show (no process section)

## 🎯 **Example Output**

When you have images for Discovery, Research, and Visual Design steps, the system will show:
- Step 1: Discovery (with your discovery images)
- Step 2: Research (with your research images)  
- Step 3: Visual Design (with your visual design images)

The numbers automatically adjust, and the timeline flows beautifully!

---

**Ready to create amazing case studies?** Just add your process images to the frontmatter and watch the magic happen! ✨
