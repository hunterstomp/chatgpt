const fs = require('fs').promises;
const path = require('path');
const { UXFlowManager } = require('./ux-flows');

/**
 * Case Study Gallery Injector
 * Intelligently injects galleries into existing case studies based on UX phases
 * Only shows phases that have content, preserves all existing content
 */
class CaseStudyInjector {
  constructor() {
    this.flowManager = new UXFlowManager();
    this.caseStudiesDir = path.join(__dirname, '../src/case-studies');
  }

  /**
   * Get all case study directories
   */
  async getCaseStudies() {
    try {
      const entries = await fs.readdir(this.caseStudiesDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch (error) {
      console.error('Error reading case studies directory:', error);
      return [];
    }
  }

  /**
   * Analyze a case study's current structure
   */
  async analyzeCaseStudy(caseStudySlug) {
    const indexPath = path.join(this.caseStudiesDir, caseStudySlug, 'index.html');
    
    try {
      const content = await fs.readFile(indexPath, 'utf8');
      
      // Check which UX phases exist in the current case study
      const phases = {
        problem: content.includes('id="problem"') || content.includes('The Challenge'),
        approach: content.includes('id="approach"') || content.includes('Approach & Process'),
        outcomes: content.includes('id="outcomes"') || content.includes('Outcomes & Impact'),
        gallery: content.includes('id="gallery"') || content.includes('Design Gallery')
      };

      // Extract existing gallery content to preserve it
      const existingGallery = this.extractExistingGallery(content);
      
      return {
        slug: caseStudySlug,
        phases,
        hasExistingGallery: !!existingGallery,
        existingGalleryContent: existingGallery
      };
    } catch (error) {
      console.error(`Error analyzing case study ${caseStudySlug}:`, error);
      return null;
    }
  }

  /**
   * Extract existing gallery content to preserve it
   */
  extractExistingGallery(content) {
    const galleryMatch = content.match(/<section class="section"[^>]*id="gallery"[^>]*>([\s\S]*?)<\/section>/);
    if (galleryMatch) {
      return galleryMatch[1];
    }
    return null;
  }

  /**
   * Get available galleries for a case study from the admin system
   */
  async getAvailableGalleries(caseStudySlug) {
    try {
      const projectsData = await fs.readFile(path.join(__dirname, 'data/projects.json'), 'utf8');
      const projects = JSON.parse(projectsData);
      
      const project = projects.find(p => p.slug === caseStudySlug);
      if (!project) return {};

      // Get series data
      const seriesData = await fs.readFile(path.join(__dirname, 'data/series.json'), 'utf8');
      const series = JSON.parse(seriesData);
      
      // Group series by flow type
      const galleriesByPhase = {};
      
      series.forEach(s => {
        if (s.projectId === project.id && s.flowType) {
          if (!galleriesByPhase[s.flowType]) {
            galleriesByPhase[s.flowType] = [];
          }
          galleriesByPhase[s.flowType].push(s);
        }
      });

      return galleriesByPhase;
    } catch (error) {
      console.error('Error getting available galleries:', error);
      return {};
    }
  }

  /**
   * Generate gallery HTML for a specific phase
   */
  generatePhaseGallery(phase, series, flowManager) {
    const flowInfo = flowManager.getFlowById(phase);
    const title = flowInfo?.title || this.capitalizeFirst(phase);
    const description = flowInfo?.description || `Design process and deliverables for ${title}`;
    
    let galleryHTML = `
    <section class="section" id="${phase}-gallery">
      <div class="container">
        <h2>${title} Gallery</h2>
        <p class="lead mb-4">${description}</p>
        
        <div class="q10ux-gallery">
    `;

    // Sort series by order
    const sortedSeries = series.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    sortedSeries.forEach(s => {
      if (s.images && s.images.length > 0) {
        const mainImage = s.images[0];
        galleryHTML += `
          <div class="q10ux-gallery-item" data-lightbox="${mainImage.full}">
            <img src="${mainImage.thumbnail}" alt="${s.title || 'Design process image'}">
            <div class="gallery-caption">
              <strong>${s.title || 'Process Image'}</strong><br>
              ${s.description || 'Design process documentation'}
            </div>
          </div>
        `;
      }
    });

    galleryHTML += `
        </div>
      </div>
    </section>
    `;

    return galleryHTML;
  }

  /**
   * Inject galleries into a case study
   */
  async injectGalleries(caseStudySlug) {
    try {
      // Analyze current structure
      const analysis = await this.analyzeCaseStudy(caseStudySlug);
      if (!analysis) return { success: false, error: 'Could not analyze case study' };

      // Get available galleries
      const availableGalleries = await this.getAvailableGalleries(caseStudySlug);
      
      // Read the current HTML
      const indexPath = path.join(this.caseStudiesDir, caseStudySlug, 'index.html');
      let content = await fs.readFile(indexPath, 'utf8');

      // Inject galleries for phases that have content
      const phasesToInject = ['problem', 'approach', 'outcomes'];
      let injectedCount = 0;

      for (const phase of phasesToInject) {
        if (analysis.phases[phase] && availableGalleries[phase] && availableGalleries[phase].length > 0) {
          const galleryHTML = this.generatePhaseGallery(phase, availableGalleries[phase], this.flowManager);
          
          // Find the end of the phase section and inject before the next section
          const phaseEndPattern = new RegExp(`(</section>\\s*<!--\\s*${this.getNextPhase(phase)}|</section>\\s*<!--\\s*Outcomes|</section>\\s*<!--\\s*Gallery|</section>\\s*<!--\\s*Downloads)`, 'i');
          const match = content.match(phaseEndPattern);
          
          if (match) {
            content = content.replace(match[0], galleryHTML + '\n    ' + match[0]);
            injectedCount++;
          }
        }
      }

      // Update the existing gallery section if it exists and we have gallery content
      if (analysis.hasExistingGallery && availableGalleries['gallery'] && availableGalleries['gallery'].length > 0) {
        const newGalleryHTML = this.generatePhaseGallery('gallery', availableGalleries['gallery'], this.flowManager);
        content = content.replace(
          /<section class="section"[^>]*id="gallery"[^>]*>[\s\S]*?<\/section>/,
          newGalleryHTML
        );
        injectedCount++;
      }

      // Write the updated content
      await fs.writeFile(indexPath, content, 'utf8');

      return {
        success: true,
        injectedCount,
        phases: Object.keys(availableGalleries).filter(phase => availableGalleries[phase].length > 0)
      };

    } catch (error) {
      console.error(`Error injecting galleries for ${caseStudySlug}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the next phase in the UX process
   */
  getNextPhase(currentPhase) {
    const phaseOrder = ['problem', 'approach', 'outcomes', 'gallery'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    return currentIndex < phaseOrder.length - 1 ? phaseOrder[currentIndex + 1] : 'Downloads';
  }

  /**
   * Capitalize first letter
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Get injection status for all case studies
   */
  async getInjectionStatus() {
    const caseStudies = await this.getCaseStudies();
    const status = [];

    for (const slug of caseStudies) {
      const analysis = await this.analyzeCaseStudy(slug);
      const availableGalleries = await this.getAvailableGalleries(slug);
      
      if (analysis) {
        status.push({
          slug,
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          phases: analysis.phases,
          availableGalleries: Object.keys(availableGalleries).filter(phase => availableGalleries[phase].length > 0),
          hasExistingGallery: analysis.hasExistingGallery
        });
      }
    }

    return status;
  }
}

module.exports = CaseStudyInjector;
