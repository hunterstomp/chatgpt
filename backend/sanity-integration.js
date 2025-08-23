/**
 * Q10UX Portfolio - Sanity Integration
 * Handles image uploads and content management with Sanity CMS
 */

const { createClient } = require('@sanity/client');
const fs = require('fs').promises;
const path = require('path');

class SanityIntegration {
    constructor() {
        this.client = createClient({
            projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
            dataset: process.env.SANITY_DATASET || 'production',
            token: process.env.SANITY_TOKEN, // Required for uploads
            useCdn: false, // Use API for real-time updates
            apiVersion: '2024-01-01'
        });
        
        this.isConfigured = !!(process.env.SANITY_PROJECT_ID && process.env.SANITY_TOKEN);
    }

    /**
     * Upload image to Sanity
     */
    async uploadImage(filePath, metadata = {}) {
        if (!this.isConfigured) {
            console.log('⚠️  Sanity not configured, skipping upload');
            return null;
        }

        try {
            const fileBuffer = await fs.readFile(filePath);
            const filename = path.basename(filePath);
            
            // Upload to Sanity
            const asset = await this.client.assets.upload('image', fileBuffer, {
                filename: filename,
                label: metadata.title || filename,
                description: metadata.description || '',
                alt: metadata.alt || '',
                creditLine: metadata.credit || '',
                source: {
                    name: 'Q10UX Portfolio',
                    url: 'https://q10ux.com'
                }
            });

            console.log(`✅ Uploaded to Sanity: ${filename} (${asset._id})`);
            
            return {
                sanityId: asset._id,
                url: asset.url,
                metadata: asset.metadata,
                originalFilename: filename
            };

        } catch (error) {
            console.error('❌ Sanity upload failed:', error.message);
            return null;
        }
    }

    /**
     * Create or update case study document
     */
    async createCaseStudy(caseStudyData) {
        if (!this.isConfigured) {
            console.log('⚠️  Sanity not configured, skipping case study creation');
            return null;
        }

        try {
            const doc = {
                _type: 'caseStudy',
                title: caseStudyData.title,
                slug: {
                    _type: 'slug',
                    current: caseStudyData.slug
                },
                description: caseStudyData.description,
                status: caseStudyData.status || 'draft',
                ndaRequired: caseStudyData.ndaRequired || false,
                ndaCode: caseStudyData.ndaCode || null,
                client: caseStudyData.client || '',
                projectType: caseStudyData.projectType || 'ux-design',
                technologies: caseStudyData.technologies || [],
                duration: caseStudyData.duration || '',
                teamSize: caseStudyData.teamSize || '',
                role: caseStudyData.role || '',
                results: caseStudyData.results || '',
                challenges: caseStudyData.challenges || '',
                process: caseStudyData.process || '',
                images: caseStudyData.images || [],
                publishedAt: new Date().toISOString()
            };

            const result = await this.client.create(doc);
            console.log(`✅ Created case study in Sanity: ${caseStudyData.title} (${result._id})`);
            
            return result._id;

        } catch (error) {
            console.error('❌ Sanity case study creation failed:', error.message);
            return null;
        }
    }

    /**
     * Add image series to case study
     */
    async addImageSeries(caseStudyId, seriesData) {
        if (!this.isConfigured) {
            console.log('⚠️  Sanity not configured, skipping series creation');
            return null;
        }

        try {
            const seriesDoc = {
                _type: 'imageSeries',
                title: seriesData.title,
                description: seriesData.description,
                caseStudy: {
                    _type: 'reference',
                    _ref: caseStudyId
                },
                images: seriesData.images.map(img => ({
                    _type: 'imageWithCaption',
                    asset: {
                        _type: 'reference',
                        _ref: img.sanityId
                    },
                    caption: img.description || '',
                    order: img.order || 1,
                    alt: img.alt || ''
                })),
                order: seriesData.order || 1,
                createdAt: new Date().toISOString()
            };

            const result = await this.client.create(seriesDoc);
            console.log(`✅ Added image series to Sanity: ${seriesData.title}`);
            
            return result._id;

        } catch (error) {
            console.error('❌ Sanity series creation failed:', error.message);
            return null;
        }
    }

    /**
     * Get case studies from Sanity
     */
    async getCaseStudies() {
        if (!this.isConfigured) {
            console.log('⚠️  Sanity not configured, returning empty array');
            return [];
        }

        try {
            const query = `*[_type == "caseStudy"] {
                _id,
                title,
                slug,
                description,
                status,
                ndaRequired,
                publishedAt,
                "imageCount": count(*[_type == "imageSeries" && references(^._id)] {
                    "count": count(images)
                }[0].count)
            } | order(publishedAt desc)`;

            const caseStudies = await this.client.fetch(query);
            console.log(`✅ Fetched ${caseStudies.length} case studies from Sanity`);
            
            return caseStudies;

        } catch (error) {
            console.error('❌ Sanity fetch failed:', error.message);
            return [];
        }
    }

    /**
     * Get case study with images
     */
    async getCaseStudyWithImages(slug) {
        if (!this.isConfigured) {
            console.log('⚠️  Sanity not configured, returning null');
            return null;
        }

        try {
            const query = `*[_type == "caseStudy" && slug.current == $slug][0] {
                _id,
                title,
                slug,
                description,
                status,
                ndaRequired,
                ndaCode,
                client,
                projectType,
                technologies,
                duration,
                teamSize,
                role,
                results,
                challenges,
                process,
                publishedAt,
                "series": *[_type == "imageSeries" && references(^._id)] {
                    _id,
                    title,
                    description,
                    order,
                    "images": images[] {
                        asset->{
                            _id,
                            url,
                            metadata
                        },
                        caption,
                        alt,
                        order
                    }
                } | order(order asc)
            }`;

            const caseStudy = await this.client.fetch(query, { slug });
            
            if (caseStudy) {
                console.log(`✅ Fetched case study from Sanity: ${caseStudy.title}`);
            }
            
            return caseStudy;

        } catch (error) {
            console.error('❌ Sanity case study fetch failed:', error.message);
            return null;
        }
    }

    /**
     * Check if Sanity is properly configured
     */
    isReady() {
        return this.isConfigured;
    }

    /**
     * Get configuration status
     */
    getConfigStatus() {
        return {
            configured: this.isConfigured,
            projectId: process.env.SANITY_PROJECT_ID || 'Not set',
            dataset: process.env.SANITY_DATASET || 'production',
            hasToken: !!process.env.SANITY_TOKEN
        };
    }
}

module.exports = SanityIntegration;
