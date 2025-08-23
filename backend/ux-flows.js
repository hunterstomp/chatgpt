/**
 * Q10UX Portfolio - UX Flow Configuration
 * Defines the standard UX process stages that match case study templates
 */

const UX_FLOWS = {
  // Main case study sections (matching template structure)
  PROBLEM: {
    id: 'problem',
    title: 'Problem & Research',
    description: 'User pain points, business goals, and research insights',
    icon: 'fas fa-search',
    color: 'primary',
    order: 1
  },
  
  APPROACH: {
    id: 'approach',
    title: 'Approach & Process',
    description: 'Research, design, and implementation methodology',
    icon: 'fas fa-pencil-ruler',
    color: 'secondary',
    order: 2,
    subflows: {
      RESEARCH: {
        id: 'research',
        title: 'Research',
        description: 'User research, competitive analysis, and insights',
        icon: 'fas fa-search',
        color: 'info'
      },
      DESIGN: {
        id: 'design',
        title: 'Design',
        description: 'Wireframes, prototypes, and design iterations',
        icon: 'fas fa-pencil-ruler',
        color: 'warning'
      },
      IMPLEMENTATION: {
        id: 'implementation',
        title: 'Implementation',
        description: 'Development, testing, and deployment',
        icon: 'fas fa-cogs',
        color: 'success'
      }
    }
  },
  
  OUTCOMES: {
    id: 'outcomes',
    title: 'Outcomes & Impact',
    description: 'Results, metrics, and business impact',
    icon: 'fas fa-chart-line',
    color: 'success',
    order: 3
  },
  
  GALLERY: {
    id: 'gallery',
    title: 'Design Gallery',
    description: 'Final deliverables and process documentation',
    icon: 'fas fa-images',
    color: 'info',
    order: 4
  }
};

// Helper functions for flow management
class UXFlowManager {
  constructor() {
    this.flows = UX_FLOWS;
  }

  /**
   * Get all available flow types
   */
  getAllFlows() {
    return Object.values(this.flows);
  }

  /**
   * Get main flow sections (Problem, Approach, Outcomes, Gallery)
   */
  getMainFlows() {
    return Object.values(this.flows).filter(flow => !flow.subflows);
  }

  /**
   * Get subflows for a specific main flow
   */
  getSubflows(mainFlowId) {
    const flow = this.flows[mainFlowId];
    return flow?.subflows ? Object.values(flow.subflows) : [];
  }

  /**
   * Get flow by ID (supports nested: 'approach.research')
   */
  getFlowById(flowId) {
    if (flowId.includes('.')) {
      const [mainId, subId] = flowId.split('.');
      return this.flows[mainId]?.subflows?.[subId] || null;
    }
    return this.flows[flowId] || null;
  }

  /**
   * Validate flow ID
   */
  isValidFlow(flowId) {
    return !!this.getFlowById(flowId);
  }

  /**
   * Get flow display name
   */
  getFlowDisplayName(flowId) {
    const flow = this.getFlowById(flowId);
    if (!flow) return 'Unknown Flow';
    
    if (flowId.includes('.')) {
      const [mainId] = flowId.split('.');
      const mainFlow = this.flows[mainId];
      return `${mainFlow?.title} - ${flow.title}`;
    }
    
    return flow.title;
  }

  /**
   * Get flow icon
   */
  getFlowIcon(flowId) {
    const flow = this.getFlowById(flowId);
    return flow?.icon || 'fas fa-folder';
  }

  /**
   * Get flow color class
   */
  getFlowColor(flowId) {
    const flow = this.getFlowById(flowId);
    return flow?.color || 'secondary';
  }

  /**
   * Get suggested flow based on filename
   */
  suggestFlowFromFilename(filename) {
    const lowerFilename = filename.toLowerCase();
    
    // Research-related files
    if (lowerFilename.includes('research') || lowerFilename.includes('interview') || 
        lowerFilename.includes('survey') || lowerFilename.includes('analysis')) {
      return 'approach.research';
    }
    
    // Design-related files
    if (lowerFilename.includes('design') || lowerFilename.includes('wireframe') || 
        lowerFilename.includes('prototype') || lowerFilename.includes('mockup') ||
        lowerFilename.includes('sketch') || lowerFilename.includes('ui')) {
      return 'approach.design';
    }
    
    // Implementation-related files
    if (lowerFilename.includes('implementation') || lowerFilename.includes('development') || 
        lowerFilename.includes('testing') || lowerFilename.includes('deploy') ||
        lowerFilename.includes('code') || lowerFilename.includes('build')) {
      return 'approach.implementation';
    }
    
    // Problem-related files
    if (lowerFilename.includes('problem') || lowerFilename.includes('pain') || 
        lowerFilename.includes('issue') || lowerFilename.includes('challenge')) {
      return 'problem';
    }
    
    // Outcome-related files
    if (lowerFilename.includes('outcome') || lowerFilename.includes('result') || 
        lowerFilename.includes('impact') || lowerFilename.includes('metric') ||
        lowerFilename.includes('performance') || lowerFilename.includes('success')) {
      return 'outcomes';
    }
    
    // Default to gallery for general files
    return 'gallery';
  }

  /**
   * Get flow order for sorting
   */
  getFlowOrder(flowId) {
    if (flowId.includes('.')) {
      const [mainId] = flowId.split('.');
      const mainFlow = this.flows[mainId];
      return mainFlow?.order || 999;
    }
    
    const flow = this.flows[flowId];
    return flow?.order || 999;
  }
}

module.exports = {
  UX_FLOWS,
  UXFlowManager
};
