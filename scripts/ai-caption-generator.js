#!/usr/bin/env node

/**
 * Q10UX AI Caption Generator
 * Automatically generates contextual captions for UX portfolio images
 * 
 * Features:
 * - Image analysis using AI vision models
 * - Context-aware caption generation
 * - UX-specific terminology and descriptions
 * - Multiple caption lengths (thumbnail, lightbox, detailed)
 * - Smart detection of UI elements, user flows, and design patterns
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const chalk = require('chalk');

class AICaptionGenerator {
    constructor() {
        this.config = {
            // AI Providers (use environment variables)
            anthropic: {
                apiKey: process.env.ANTHROPIC_API_KEY,
                model: 'claude-3-sonnet-20240229'
            },
            openai: {
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-4-vision-preview'
            },
            // Caption types
            captionTypes: {
                thumbnail: { maxLength: 80, style: 'concise' },
                lightbox: { maxLength: 200, style: 'descriptive' },
                detailed: { maxLength: 500, style: 'comprehensive' }
            },
            // UX-specific terminology
            uxTerms: {
                phases: ['Research', 'Design', 'Prototyping', 'Testing', 'Implementation'],
                elements: ['Wireframe', 'Mockup', 'Prototype', 'User Flow', 'Interface', 'Dashboard', 'Form', 'Navigation'],
                actions: ['User Journey', 'Task Flow', 'Interaction Design', 'Information Architecture', 'Usability Testing'],
                patterns: ['Card Layout', 'Grid System', 'Modal Dialog', 'Dropdown Menu', 'Search Interface', 'Data Visualization']
            }
        };

        // Initialize AI clients
        this.anthropic = this.config.anthropic.apiKey ? 
            createClient({ apiKey: this.config.anthropic.apiKey }) : null;
        this.openai = this.config.openai.apiKey ? 
            new OpenAI({ apiKey: this.config.openai.apiKey }) : null;
    }

    async generateCaptions(imagePath, context = {}) {
        try {
            console.log(chalk.blue(`🔍 Analyzing image: ${path.basename(imagePath)}`));

            // Analyze image with AI
            const analysis = await this.analyzeImage(imagePath, context);
            
            // Generate different caption types
            const captions = {
                thumbnail: await this.generateThumbnailCaption(analysis, context),
                lightbox: await this.generateLightboxCaption(analysis, context),
                detailed: await this.generateDetailedCaption(analysis, context)
            };

            console.log(chalk.green(`✅ Generated captions for ${path.basename(imagePath)}`));
            return captions;

        } catch (error) {
            console.log(chalk.red(`❌ Error generating captions: ${error.message}`));
            return this.generateFallbackCaptions(imagePath, context);
        }
    }

    async analyzeImage(imagePath, context) {
        // Prepare image for AI analysis
        const imageBuffer = await this.prepareImageForAnalysis(imagePath);
        const imageBase64 = imageBuffer.toString('base64');

        // Create analysis prompt
        const analysisPrompt = this.createAnalysisPrompt(context);

        // Try different AI providers
        if (this.openai) {
            return await this.analyzeWithOpenAI(imageBase64, analysisPrompt);
        } else if (this.anthropic) {
            return await this.analyzeWithAnthropic(imageBase64, analysisPrompt);
        } else {
            throw new Error('No AI provider configured');
        }
    }

    async prepareImageForAnalysis(imagePath) {
        // Resize and optimize image for AI analysis
        return await sharp(imagePath)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
    }

    createAnalysisPrompt(context) {
        const { project, tags, fileName } = context;
        
        return `Analyze this UX design image and provide a detailed description focusing on:

CONTEXT:
- Project: ${project || 'Unknown'}
- Tags: ${tags?.join(', ') || 'None'}
- Filename: ${fileName || 'Unknown'}

ANALYSIS REQUIREMENTS:
1. **UI Elements**: Identify buttons, forms, navigation, layouts, cards, modals, etc.
2. **Design Patterns**: Recognize grid systems, typography, color schemes, spacing
3. **User Flow**: Understand the user journey and interaction patterns
4. **Content Type**: Determine if it's wireframe, mockup, prototype, or final design
5. **Purpose**: Identify the specific UX phase (research, design, testing, etc.)
6. **Key Features**: Highlight important functionality and user interactions
7. **Visual Hierarchy**: Describe layout structure and information organization
8. **Accessibility**: Note any accessibility considerations visible

OUTPUT FORMAT:
Provide a structured analysis with these sections:
- Main Elements: [list of primary UI components]
- Design Patterns: [layout and interaction patterns]
- User Flow: [how users would interact]
- Purpose: [what this screen/component accomplishes]
- Key Features: [important functionality]
- Visual Notes: [design observations]`;
    }

    async analyzeWithOpenAI(imageBase64, prompt) {
        const response = await this.openai.chat.completions.create({
            model: this.config.openai.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a UX design expert analyzing portfolio images. Provide detailed, professional analysis.'
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBase64}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000
        });

        return this.parseAnalysisResponse(response.choices[0].message.content);
    }

    async analyzeWithAnthropic(imageBase64, prompt) {
        const response = await this.anthropic.messages.create({
            model: this.config.anthropic.model,
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: prompt
                        },
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: imageBase64
                            }
                        }
                    ]
                }
            ]
        });

        return this.parseAnalysisResponse(response.content[0].text);
    }

    parseAnalysisResponse(response) {
        // Parse the AI response into structured data
        const analysis = {
            mainElements: [],
            designPatterns: [],
            userFlow: '',
            purpose: '',
            keyFeatures: [],
            visualNotes: ''
        };

        // Extract information from the response
        const lines = response.split('\n');
        let currentSection = '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.includes('Main Elements:')) {
                currentSection = 'mainElements';
            } else if (trimmed.includes('Design Patterns:')) {
                currentSection = 'designPatterns';
            } else if (trimmed.includes('User Flow:')) {
                currentSection = 'userFlow';
            } else if (trimmed.includes('Purpose:')) {
                currentSection = 'purpose';
            } else if (trimmed.includes('Key Features:')) {
                currentSection = 'keyFeatures';
            } else if (trimmed.includes('Visual Notes:')) {
                currentSection = 'visualNotes';
            } else if (currentSection && trimmed.startsWith('-')) {
                const item = trimmed.substring(1).trim();
                if (currentSection === 'mainElements') {
                    analysis.mainElements.push(item);
                } else if (currentSection === 'designPatterns') {
                    analysis.designPatterns.push(item);
                } else if (currentSection === 'keyFeatures') {
                    analysis.keyFeatures.push(item);
                }
            } else if (currentSection === 'userFlow' && analysis.userFlow === '') {
                analysis.userFlow = trimmed;
            } else if (currentSection === 'purpose' && analysis.purpose === '') {
                analysis.purpose = trimmed;
            } else if (currentSection === 'visualNotes' && analysis.visualNotes === '') {
                analysis.visualNotes = trimmed;
            }
        }

        return analysis;
    }

    async generateThumbnailCaption(analysis, context) {
        const { project, tags } = context;
        
        // Create concise thumbnail caption
        let caption = '';
        
        if (analysis.mainElements.length > 0) {
            const primaryElement = analysis.mainElements[0];
            caption = `${primaryElement}`;
        } else if (analysis.purpose) {
            caption = analysis.purpose;
        } else {
            caption = this.generateFallbackThumbnailCaption(context);
        }

        // Add project context if available
        if (project && project !== 'general') {
            caption = `${project}: ${caption}`;
        }

        // Ensure it fits thumbnail constraints
        return caption.length > 80 ? caption.substring(0, 77) + '...' : caption;
    }

    async generateLightboxCaption(analysis, context) {
        const { project, tags } = context;
        
        let caption = '';
        
        // Start with purpose or main element
        if (analysis.purpose) {
            caption = analysis.purpose;
        } else if (analysis.mainElements.length > 0) {
            caption = `Shows ${analysis.mainElements[0].toLowerCase()}`;
        }

        // Add key features
        if (analysis.keyFeatures.length > 0) {
            caption += ` featuring ${analysis.keyFeatures[0].toLowerCase()}`;
        }

        // Add design pattern context
        if (analysis.designPatterns.length > 0) {
            caption += ` using ${analysis.designPatterns[0].toLowerCase()} design pattern`;
        }

        // Add project context
        if (project && project !== 'general') {
            caption = `${project} - ${caption}`;
        }

        // Ensure it fits lightbox constraints
        return caption.length > 200 ? caption.substring(0, 197) + '...' : caption;
    }

    async generateDetailedCaption(analysis, context) {
        const { project, tags, fileName } = context;
        
        let caption = '';
        
        // Comprehensive description
        if (analysis.purpose) {
            caption += `${analysis.purpose}. `;
        }

        if (analysis.mainElements.length > 0) {
            caption += `This screen includes ${analysis.mainElements.join(', ')}. `;
        }

        if (analysis.userFlow) {
            caption += `Users can ${analysis.userFlow}. `;
        }

        if (analysis.keyFeatures.length > 0) {
            caption += `Key features include ${analysis.keyFeatures.join(', ')}. `;
        }

        if (analysis.designPatterns.length > 0) {
            caption += `The design employs ${analysis.designPatterns.join(', ')} patterns. `;
        }

        if (analysis.visualNotes) {
            caption += analysis.visualNotes;
        }

        // Add context information
        if (project && project !== 'general') {
            caption = `[${project}] ${caption}`;
        }

        if (tags && tags.length > 0) {
            caption += ` Tags: ${tags.join(', ')}.`;
        }

        // Ensure it fits detailed constraints
        return caption.length > 500 ? caption.substring(0, 497) + '...' : caption;
    }

    generateFallbackCaptions(imagePath, context) {
        const fileName = path.basename(imagePath, path.extname(imagePath));
        const { project, tags } = context;

        // Generate fallback captions based on filename and context
        const fallbackThumbnail = this.generateFallbackThumbnailCaption(context);
        const fallbackLightbox = this.generateFallbackLightboxCaption(context);
        const fallbackDetailed = this.generateFallbackDetailedCaption(context);

        return {
            thumbnail: fallbackThumbnail,
            lightbox: fallbackLightbox,
            detailed: fallbackDetailed
        };
    }

    generateFallbackThumbnailCaption(context) {
        const { project, tags, fileName } = context;
        
        if (tags && tags.length > 0) {
            return tags[0];
        } else if (fileName) {
            // Extract meaningful words from filename
            const words = fileName.split(/[-_\s]/).filter(word => word.length > 2);
            return words.length > 0 ? words[0] : 'UX Design';
        }
        
        return 'UX Design';
    }

    generateFallbackLightboxCaption(context) {
        const { project, tags, fileName } = context;
        
        let caption = '';
        
        if (project && project !== 'general') {
            caption += `${project} - `;
        }
        
        if (tags && tags.length > 0) {
            caption += tags.join(', ');
        } else if (fileName) {
            const words = fileName.split(/[-_\s]/).filter(word => word.length > 2);
            caption += words.slice(0, 3).join(' ');
        } else {
            caption += 'UX Design Component';
        }
        
        return caption;
    }

    generateFallbackDetailedCaption(context) {
        const { project, tags, fileName } = context;
        
        let caption = '';
        
        if (project && project !== 'general') {
            caption += `This is part of the ${project} project. `;
        }
        
        if (tags && tags.length > 0) {
            caption += `It represents the ${tags.join(', ')} phase of the design process. `;
        }
        
        if (fileName) {
            const words = fileName.split(/[-_\s]/).filter(word => word.length > 2);
            caption += `The image shows ${words.slice(0, 5).join(' ')}. `;
        }
        
        caption += 'This design component demonstrates user experience principles and interface design patterns.';
        
        return caption;
    }

    // Batch processing for multiple images
    async generateBatchCaptions(imagePaths, context = {}) {
        console.log(chalk.blue(`🚀 Generating captions for ${imagePaths.length} images...`));
        
        const results = [];
        
        for (let i = 0; i < imagePaths.length; i++) {
            const imagePath = imagePaths[i];
            console.log(chalk.gray(`Processing ${i + 1}/${imagePaths.length}: ${path.basename(imagePath)}`));
            
            try {
                const captions = await this.generateCaptions(imagePath, context);
                results.push({
                    imagePath,
                    captions,
                    success: true
                });
            } catch (error) {
                console.log(chalk.red(`Failed to process ${path.basename(imagePath)}: ${error.message}`));
                results.push({
                    imagePath,
                    captions: this.generateFallbackCaptions(imagePath, context),
                    success: false,
                    error: error.message
                });
            }
            
            // Add delay to avoid rate limiting
            if (i < imagePaths.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        console.log(chalk.green(`✅ Completed caption generation for ${imagePaths.length} images`));
        return results;
    }
}

// CLI Interface
async function main() {
    const generator = new AICaptionGenerator();
    
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(chalk.cyan('🎨 Q10UX AI Caption Generator'));
        console.log(chalk.gray('Usage: node ai-caption-generator.js <image-path> [project] [tags...]'));
        console.log(chalk.gray('Example: node ai-caption-generator.js ./image.jpg atmosfx-media-player "User Research" "Wireframes"'));
        process.exit(1);
    }
    
    const imagePath = args[0];
    const project = args[1] || 'general';
    const tags = args.slice(2);
    
    try {
        const captions = await generator.generateCaptions(imagePath, { project, tags });
        
        console.log(chalk.green('\n📝 Generated Captions:'));
        console.log(chalk.cyan('\nThumbnail:'), captions.thumbnail);
        console.log(chalk.cyan('\nLightbox:'), captions.lightbox);
        console.log(chalk.cyan('\nDetailed:'), captions.detailed);
        
    } catch (error) {
        console.error(chalk.red('Error:', error.message));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = AICaptionGenerator;
