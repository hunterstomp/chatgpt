#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

class CaseStudyImporter {
    constructor() {
        this.caseStudiesDir = path.join(__dirname, '../src/case-studies');
        this.dataDir = path.join(__dirname, '../backend/data');
        this.importedProjects = [];
    }

    async importAllCaseStudies() {
        console.log('🚀 Starting case study import...');
        
        try {
            // Read existing data
            const data = await this.loadData();
            
            // Get all case study directories
            const caseStudyDirs = await this.getCaseStudyDirectories();
            
            console.log(`📁 Found ${caseStudyDirs.length} case studies to import`);
            
            for (const dir of caseStudyDirs) {
                await this.importCaseStudy(dir, data);
            }
            
            // Save updated data
            await this.saveData(data);
            
            console.log('✅ Import completed successfully!');
            console.log(`📊 Imported ${this.importedProjects.length} case studies`);
            
            // Generate import report
            await this.generateImportReport();
            
        } catch (error) {
            console.error('❌ Import failed:', error);
        }
    }

    async getCaseStudyDirectories() {
        const entries = await fs.readdir(this.caseStudiesDir, { withFileTypes: true });
        return entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);
    }

    async importCaseStudy(dirName, data) {
        console.log(`📖 Importing: ${dirName}`);
        
        const indexPath = path.join(this.caseStudiesDir, dirName, 'index.html');
        
        try {
            const html = await fs.readFile(indexPath, 'utf8');
            const $ = cheerio.load(html);
            
            // Extract case study data
            const caseStudy = await this.extractCaseStudyData($, dirName);
            
            // Generate unique ID
            const projectId = this.generateId();
            
            // Create project entity
            const project = {
                id: projectId,
                title: caseStudy.title,
                slug: dirName,
                description: caseStudy.description,
                status: 'published',
                ndaRequired: caseStudy.ndaRequired,
                ndaCode: caseStudy.ndaRequired ? 'PUBLIC' : null,
                flowPrivacy: {},
                metadata: {
                    client: caseStudy.client,
                    focus: caseStudy.focus,
                    tags: caseStudy.tags,
                    heroImage: caseStudy.heroImage,
                    downloads: caseStudy.downloads,
                    credits: caseStudy.credits,
                    originalPath: dirName
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to data
            data.projects[projectId] = project;
            
            // Create placeholder series for each UX flow
            await this.createPlaceholderSeries(projectId, caseStudy, data);
            
            this.importedProjects.push({
                id: projectId,
                title: caseStudy.title,
                slug: dirName,
                flows: caseStudy.flows
            });
            
            console.log(`✅ Imported: ${caseStudy.title}`);
            
        } catch (error) {
            console.error(`❌ Failed to import ${dirName}:`, error.message);
        }
    }

    async extractCaseStudyData($, dirName) {
        // Extract title
        const title = $('title').text().replace(' - UX Case Study | Q10UX Design', '').trim();
        
        // Extract description from meta description
        const description = $('meta[name="description"]').attr('content') || '';
        
        // Extract hero image
        const heroSection = $('.q10ux-hero');
        const heroImage = heroSection.css('background-image')?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1] || '';
        
        // Extract tags from hero section
        const tags = [];
        $('.q10ux-hero .badge').each((i, el) => {
            tags.push($(el).text().trim());
        });
        
        // Extract client and focus from credits section
        let client = '';
        let focus = '';
        $('.section#credits p').each((i, el) => {
            const text = $(el).text();
            if (text.includes('Client:')) {
                client = text.match(/Client:\s*([^\n]+)/)?.[1]?.trim() || '';
            }
            if (text.includes('Focus:')) {
                focus = text.match(/Focus:\s*([^\n]+)/)?.[1]?.trim() || '';
            }
        });
        
        // Check for NDA requirements
        const ndaRequired = $('.alert-info').text().toLowerCase().includes('nda') || false;
        
        // Extract downloads
        const downloads = [];
        $('.section#downloads .card').each((i, el) => {
            const title = $(el).find('h4').text().trim();
            const description = $(el).find('p').text().trim();
            const link = $(el).find('a').attr('href');
            downloads.push({ title, description, link });
        });
        
        // Extract credits
        const credits = {};
        $('.section#credits p').each((i, el) => {
            const text = $(el).text();
            if (text.includes('UX Design:')) {
                credits.uxDesign = text.match(/UX Design:\s*([^\n]+)/)?.[1]?.trim() || '';
            }
            if (text.includes('Development Team:')) {
                credits.developmentTeam = text.match(/Development Team:\s*([^\n]+)/)?.[1]?.trim() || '';
            }
        });
        
        // Define standard UX flows based on content
        const flows = this.detectFlowsFromContent($);
        
        return {
            title,
            description,
            heroImage,
            tags,
            client,
            focus,
            ndaRequired,
            downloads,
            credits,
            flows
        };
    }

    detectFlowsFromContent($) {
        const flows = {
            research: [],
            ideation: [],
            design: [],
            testing: [],
            implementation: [],
            results: [],
            screens: [],
            process: []
        };
        
        // Analyze content sections to determine flows
        const sections = $('section');
        sections.each((i, section) => {
            const $section = $(section);
            const id = $section.attr('id');
            const heading = $section.find('h2, h3').first().text().toLowerCase();
            
            if (id === 'overview' || heading.includes('overview')) {
                flows.process.push({
                    id: 'overview',
                    title: 'Project Overview',
                    description: 'Project overview and context'
                });
            }
            
            if (id === 'problem' || heading.includes('problem') || heading.includes('challenge')) {
                flows.research.push({
                    id: 'problem',
                    title: 'Problem Statement',
                    description: 'Problem analysis and research'
                });
            }
            
            if (heading.includes('approach') || heading.includes('solution') || heading.includes('design')) {
                flows.design.push({
                    id: 'approach',
                    title: 'Design Approach',
                    description: 'Design methodology and solutions'
                });
            }
            
            if (heading.includes('outcome') || heading.includes('result') || heading.includes('impact')) {
                flows.results.push({
                    id: 'outcomes',
                    title: 'Outcomes & Results',
                    description: 'Project outcomes and impact'
                });
            }
            
            if (id === 'gallery' || heading.includes('gallery') || heading.includes('screens')) {
                flows.screens.push({
                    id: 'gallery',
                    title: 'Design Gallery',
                    description: 'Visual design and screenshots'
                });
            }
        });
        
        return flows;
    }

    async createPlaceholderSeries(projectId, caseStudy, data) {
        const seriesId = this.generateId();
        
        const series = {
            id: seriesId,
            projectId: projectId,
            title: `${caseStudy.title} - Imported Content`,
            description: `Imported from existing case study: ${caseStudy.title}`,
            flowType: 'process',
            status: 'draft',
            metadata: {
                importSource: caseStudy.originalPath,
                importDate: new Date().toISOString(),
                originalFlows: caseStudy.flows
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        data.series[seriesId] = series;
        
        // Create placeholder images for each flow
        for (const [flowType, flowItems] of Object.entries(caseStudy.flows)) {
            if (flowItems.length > 0) {
                for (const flowItem of flowItems) {
                    const imageId = this.generateId();
                    
                    const image = {
                        id: imageId,
                        projectId: projectId,
                        seriesId: seriesId,
                        originalName: `${flowItem.id}-placeholder.png`,
                        flow: flowType,
                        tags: [flowType, 'imported', 'placeholder'],
                        deliverable: 'imported',
                        deliverableName: flowItem.title,
                        ndaRequired: caseStudy.ndaRequired,
                        sizes: {
                            thumbnail: {
                                filename: `${flowItem.id}-placeholder-thumb.webp`,
                                path: `/placeholder/${flowItem.id}-placeholder-thumb.webp`,
                                url: `/placeholder/${flowItem.id}-placeholder-thumb.webp`,
                                size: 0,
                                width: 400,
                                height: 300
                            }
                        },
                        metadata: {
                            width: 400,
                            height: 300,
                            format: 'webp',
                            hasAlpha: false,
                            hasProfile: false
                        },
                        uploadedAt: new Date().toISOString(),
                        altText: `${flowItem.title} - ${flowItem.description}`,
                        caption: flowItem.description
                    };
                    
                    data.images[imageId] = image;
                }
            }
        }
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async loadData() {
        try {
            const projectsPath = path.join(this.dataDir, 'projects.json');
            const seriesPath = path.join(this.dataDir, 'series.json');
            const imagesPath = path.join(this.dataDir, 'images.json');
            
            const [projectsData, seriesData, imagesData] = await Promise.all([
                fs.readFile(projectsPath, 'utf8').then(JSON.parse).catch(() => ({})),
                fs.readFile(seriesPath, 'utf8').then(JSON.parse).catch(() => ({})),
                fs.readFile(imagesPath, 'utf8').then(JSON.parse).catch(() => ({}))
            ]);
            
            return {
                projects: projectsData,
                series: seriesData,
                images: imagesData
            };
        } catch (error) {
            console.error('Error loading data:', error);
            return {
                projects: {},
                series: {},
                images: {}
            };
        }
    }

    async saveData(data) {
        try {
            await Promise.all([
                fs.writeFile(path.join(this.dataDir, 'projects.json'), JSON.stringify(data.projects, null, 2)),
                fs.writeFile(path.join(this.dataDir, 'series.json'), JSON.stringify(data.series, null, 2)),
                fs.writeFile(path.join(this.dataDir, 'images.json'), JSON.stringify(data.images, null, 2))
            ]);
        } catch (error) {
            console.error('Error saving data:', error);
            throw error;
        }
    }

    async generateImportReport() {
        const report = {
            importDate: new Date().toISOString(),
            totalImported: this.importedProjects.length,
            projects: this.importedProjects.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                flowCount: Object.keys(p.flows).length
            }))
        };
        
        const reportPath = path.join(this.dataDir, 'import-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log('📋 Import report saved to:', reportPath);
    }
}

// Run the import
async function main() {
    const importer = new CaseStudyImporter();
    await importer.importAllCaseStudies();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = CaseStudyImporter;
