#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class AccessibilityChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  async checkFile(filePath) {
    console.log(`\n🔍 Checking: ${filePath}`);
    
    try {
      const html = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      this.issues = [];
      this.warnings = [];
      this.passed = [];
      
      // Run all checks
      this.checkHeadings(document);
      this.checkImages(document);
      this.checkLinks(document);
      this.checkForms(document);
      this.checkColorContrast(document);
      this.checkSemanticHTML(document);
      this.checkKeyboardNavigation(document);
      this.checkARIA(document);
      this.checkLanguage(document);
      this.checkMetaTags(document);
      
      this.printResults(filePath);
      
    } catch (error) {
      console.error(`❌ Error checking ${filePath}:`, error.message);
    }
  }

  checkHeadings(document) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels = [];
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push({ element: heading, level });
    });
    
    // Check for proper heading hierarchy
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i];
      const previous = headingLevels[i - 1];
      
      if (current.level - previous.level > 1) {
        this.issues.push({
          type: 'Heading Hierarchy',
          message: `Heading level ${current.level} (${current.element.textContent.trim()}) follows heading level ${previous.level} without intermediate levels`,
          element: current.element.outerHTML.substring(0, 100) + '...'
        });
      }
    }
    
    // Check for multiple H1s
    const h1s = document.querySelectorAll('h1');
    if (h1s.length > 1) {
      this.issues.push({
        type: 'Multiple H1s',
        message: `Found ${h1s.length} H1 elements. Should have only one H1 per page.`,
        element: 'Multiple H1 elements found'
      });
    }
    
    if (h1s.length === 0) {
      this.warnings.push({
        type: 'Missing H1',
        message: 'No H1 element found. Each page should have one main heading.',
        element: 'No H1 found'
      });
    }
    
    this.passed.push(`✅ Heading structure: ${headings.length} headings found`);
  }

  checkImages(document) {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      
      if (!alt && !img.hasAttribute('role') && !img.hasAttribute('aria-label')) {
        this.issues.push({
          type: 'Missing Alt Text',
          message: `Image missing alt text: ${src}`,
          element: img.outerHTML.substring(0, 100) + '...'
        });
      } else if (alt === '') {
        this.warnings.push({
          type: 'Empty Alt Text',
          message: `Image has empty alt text: ${src}`,
          element: img.outerHTML.substring(0, 100) + '...'
        });
      }
      
      // Check for decorative images
      if (alt === '' && !img.hasAttribute('role')) {
        this.warnings.push({
          type: 'Decorative Image',
          message: `Consider adding role="presentation" for decorative image: ${src}`,
          element: img.outerHTML.substring(0, 100) + '...'
        });
      }
    });
    
    this.passed.push(`✅ Images: ${images.length} images checked`);
  }

  checkLinks(document) {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      
      // Check for empty links
      if (!href || href === '#') {
        this.warnings.push({
          type: 'Empty Link',
          message: 'Link has no destination',
          element: link.outerHTML.substring(0, 100) + '...'
        });
      }
      
      // Check for generic link text
      const genericTexts = ['click here', 'read more', 'learn more', 'here', 'link'];
      if (genericTexts.some(generic => text.toLowerCase().includes(generic))) {
        this.warnings.push({
          type: 'Generic Link Text',
          message: `Link text "${text}" is not descriptive enough`,
          element: link.outerHTML.substring(0, 100) + '...'
        });
      }
      
      // Check for external links
      if (href && href.startsWith('http') && !link.hasAttribute('rel')) {
        this.warnings.push({
          type: 'External Link',
          message: `External link missing rel="noopener": ${href}`,
          element: link.outerHTML.substring(0, 100) + '...'
        });
      }
    });
    
    this.passed.push(`✅ Links: ${links.length} links checked`);
  }

  checkForms(document) {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, textarea, select');
    
    forms.forEach(form => {
      // Check for form labels
      const formInputs = form.querySelectorAll('input, textarea, select');
      formInputs.forEach(input => {
        const id = input.getAttribute('id');
        const name = input.getAttribute('name');
        const type = input.getAttribute('type');
        
        if (type !== 'hidden' && type !== 'submit' && type !== 'button') {
          const label = document.querySelector(`label[for="${id}"]`);
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledby = input.getAttribute('aria-labelledby');
          
          if (!label && !ariaLabel && !ariaLabelledby) {
            this.issues.push({
              type: 'Missing Form Label',
              message: `Form input missing label: ${name || id || 'unnamed input'}`,
              element: input.outerHTML.substring(0, 100) + '...'
            });
          }
        }
      });
    });
    
    this.passed.push(`✅ Forms: ${forms.length} forms, ${inputs.length} inputs checked`);
  }

  checkColorContrast(document) {
    // This is a basic check - in a real implementation, you'd use a library like axe-core
    const styleSheets = document.querySelectorAll('style');
    const linkSheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    if (styleSheets.length === 0 && linkSheets.length === 0) {
      this.warnings.push({
        type: 'No Stylesheets',
        message: 'No stylesheets found. Color contrast cannot be checked.',
        element: 'No CSS found'
      });
    } else {
      this.passed.push(`✅ Color contrast: Stylesheets found (manual review recommended)`);
    }
  }

  checkSemanticHTML(document) {
    // Check for proper use of semantic elements
    const divs = document.querySelectorAll('div');
    const buttons = document.querySelectorAll('button');
    const links = document.querySelectorAll('a');
    
    // Check for clickable divs
    divs.forEach(div => {
      const onclick = div.getAttribute('onclick');
      const role = div.getAttribute('role');
      
      if (onclick && !role) {
        this.warnings.push({
          type: 'Clickable Div',
          message: 'Div with onclick should have a role attribute',
          element: div.outerHTML.substring(0, 100) + '...'
        });
      }
    });
    
    // Check for proper button usage
    links.forEach(link => {
      const role = link.getAttribute('role');
      if (role === 'button' && !link.hasAttribute('tabindex')) {
        this.warnings.push({
          type: 'Button Role',
          message: 'Link with role="button" should have tabindex="0"',
          element: link.outerHTML.substring(0, 100) + '...'
        });
      }
    });
    
    this.passed.push(`✅ Semantic HTML: ${divs.length} divs, ${buttons.length} buttons, ${links.length} links checked`);
  }

  checkKeyboardNavigation(document) {
    // Check for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    let hasSkipLink = false;
    
    skipLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#main' || href === '#main-content' || href === '#content') {
        hasSkipLink = true;
      }
    });
    
    if (!hasSkipLink) {
      this.warnings.push({
        type: 'Missing Skip Link',
        message: 'No skip link found. Consider adding a skip to main content link.',
        element: 'No skip link found'
      });
    } else {
      this.passed.push(`✅ Skip link: Found`);
    }
    
    // Check for focusable elements
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    this.passed.push(`✅ Keyboard navigation: ${focusableElements.length} focusable elements found`);
  }

  checkARIA(document) {
    const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [aria-hidden], [aria-expanded], [aria-controls], [aria-current], [aria-live], [aria-atomic], [aria-relevant], [aria-busy], [aria-dropeffect], [aria-grabbed], [aria-activedescendant], [aria-colcount], [aria-colindex], [aria-colspan], [aria-level], [aria-multiline], [aria-multiselectable], [aria-orientation], [aria-posinset], [aria-readonly], [aria-required], [aria-rowcount], [aria-rowindex], [aria-rowspan], [aria-selected], [aria-setsize], [aria-sort], [aria-valuemax], [aria-valuemin], [aria-valuenow], [aria-valuetext]');
    const landmarks = document.querySelectorAll('[role]');
    
    // Check for invalid ARIA attributes
    ariaElements.forEach(element => {
      const ariaAttributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('aria-'));
      
      ariaAttributes.forEach(attr => {
        // Basic validation - in a real implementation, you'd use a comprehensive ARIA validator
        if (attr.name === 'aria-label' && attr.value.trim() === '') {
          this.warnings.push({
            type: 'Empty ARIA Label',
            message: 'aria-label attribute is empty',
            element: element.outerHTML.substring(0, 100) + '...'
          });
        }
      });
    });
    
    this.passed.push(`✅ ARIA: ${ariaElements.length} ARIA attributes, ${landmarks.length} landmarks checked`);
  }

  checkLanguage(document) {
    const html = document.documentElement;
    const lang = html.getAttribute('lang');
    
    if (!lang) {
      this.issues.push({
        type: 'Missing Language',
        message: 'HTML element missing lang attribute',
        element: html.outerHTML.substring(0, 100) + '...'
      });
    } else {
      this.passed.push(`✅ Language: ${lang} specified`);
    }
  }

  checkMetaTags(document) {
    const title = document.querySelector('title');
    const description = document.querySelector('meta[name="description"]');
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (!title) {
      this.issues.push({
        type: 'Missing Title',
        message: 'No title element found',
        element: 'No title found'
      });
    } else {
      this.passed.push(`✅ Title: "${title.textContent}"`);
    }
    
    if (!description) {
      this.warnings.push({
        type: 'Missing Description',
        message: 'No meta description found',
        element: 'No description found'
      });
    } else {
      this.passed.push(`✅ Description: Found`);
    }
    
    if (!viewport) {
      this.warnings.push({
        type: 'Missing Viewport',
        message: 'No viewport meta tag found',
        element: 'No viewport found'
      });
    } else {
      this.passed.push(`✅ Viewport: Found`);
    }
  }

  printResults(filePath) {
    console.log(`\n📊 Accessibility Report for: ${path.basename(filePath)}`);
    console.log('=' .repeat(60));
    
    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('🎉 All accessibility checks passed!');
    }
    
    if (this.issues.length > 0) {
      console.log(`\n❌ ${this.issues.length} Critical Issues Found:`);
      this.issues.forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.type}`);
        console.log(`   ${issue.message}`);
        console.log(`   Element: ${issue.element}`);
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} Warnings:`);
      this.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.type}`);
        console.log(`   ${warning.message}`);
        console.log(`   Element: ${warning.element}`);
      });
    }
    
    console.log(`\n✅ ${this.passed.length} Checks Passed:`);
    this.passed.forEach(check => {
      console.log(`   ${check}`);
    });
    
    console.log('\n' + '=' .repeat(60));
  }

  async checkDirectory(dirPath) {
    console.log(`\n🚀 Starting accessibility check for directory: ${dirPath}`);
    
    const files = this.getHtmlFiles(dirPath);
    
    if (files.length === 0) {
      console.log('No HTML files found in the specified directory.');
      return;
    }
    
    console.log(`Found ${files.length} HTML files to check.`);
    
    for (const file of files) {
      await this.checkFile(file);
    }
    
    console.log('\n🎯 Accessibility check complete!');
  }

  getHtmlFiles(dirPath) {
    const files = [];
    
    function walkDir(currentPath) {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (item.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    }
    
    walkDir(dirPath);
    return files;
  }
}

// CLI usage
async function main() {
  const checker = new AccessibilityChecker();
  
  if (process.argv.length < 3) {
    console.log('Usage: node accessibility-checker.js <file-or-directory>');
    console.log('Examples:');
    console.log('  node accessibility-checker.js src/about/index.html');
    console.log('  node accessibility-checker.js src/');
    process.exit(1);
  }
  
  const target = process.argv[2];
  
  try {
    const stat = fs.statSync(target);
    
    if (stat.isFile()) {
      await checker.checkFile(target);
    } else if (stat.isDirectory()) {
      await checker.checkDirectory(target);
    } else {
      console.error('Target must be a file or directory');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AccessibilityChecker;
