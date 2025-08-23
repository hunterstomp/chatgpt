/**
 * Q10UX Portfolio - CRUD Manager
 * Provides Create, Read, Update, Delete operations for all entities
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CRUDManager {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.entities = {
            projects: { file: 'projects.json', schema: this.getProjectSchema() },
            series: { file: 'series.json', schema: this.getSeriesSchema() },
            images: { file: 'images.json', schema: this.getImageSchema() },
            flows: { file: 'flows.json', schema: this.getFlowSchema() },
            tags: { file: 'tags.json', schema: this.getTagSchema() },
            users: { file: 'users.json', schema: this.getUserSchema() },
            settings: { file: 'settings.json', schema: this.getSettingsSchema() },
            analytics: { file: 'analytics.json', schema: this.getAnalyticsSchema() }
        };
        
        this.ensureDataDirectory();
    }

    async ensureDataDirectory() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
        } catch (error) {
            console.error('Error creating data directory:', error);
        }
    }

    // ===== SCHEMA DEFINITIONS =====
    getProjectSchema() {
        return {
            id: 'string',
            title: 'string',
            description: 'string',
            client: 'string',
            status: 'string', // draft, published, archived
            ndaRequired: 'boolean',
            ndaCode: 'string',
            tags: 'array',
            technologies: 'array',
            duration: 'string',
            teamSize: 'string',
            role: 'string',
            results: 'string',
            challenges: 'string',
            process: 'string',
            slug: 'string',
            createdAt: 'string',
            updatedAt: 'string',
            publishedAt: 'string',
            createdBy: 'string',
            lastModifiedBy: 'string'
        };
    }

    getSeriesSchema() {
        return {
            id: 'string',
            title: 'string',
            description: 'string',
            projectId: 'string',
            flowType: 'string',
            order: 'number',
            status: 'string', // draft, published, archived
            imageCount: 'number',
            createdAt: 'string',
            updatedAt: 'string',
            createdBy: 'string',
            lastModifiedBy: 'string'
        };
    }

    getImageSchema() {
        return {
            id: 'string',
            name: 'string',
            originalName: 'string',
            description: 'string',
            alt: 'string',
            seriesId: 'string',
            projectId: 'string',
            flowType: 'string',
            order: 'number',
            width: 'number',
            height: 'number',
            size: 'number',
            mimeType: 'string',
            url: 'string',
            thumbnailUrl: 'string',
            optimized: 'boolean',
            aiGenerated: 'boolean',
            tags: 'array',
            metadata: 'object',
            status: 'string', // processing, ready, error
            createdAt: 'string',
            updatedAt: 'string',
            createdBy: 'string',
            lastModifiedBy: 'string'
        };
    }

    getFlowSchema() {
        return {
            id: 'string',
            name: 'string',
            title: 'string',
            description: 'string',
            icon: 'string',
            color: 'string',
            order: 'number',
            isActive: 'boolean',
            createdAt: 'string',
            updatedAt: 'string',
            createdBy: 'string'
        };
    }

    getTagSchema() {
        return {
            id: 'string',
            name: 'string',
            category: 'string',
            color: 'string',
            description: 'string',
            usageCount: 'number',
            isActive: 'boolean',
            createdAt: 'string',
            updatedAt: 'string',
            createdBy: 'string'
        };
    }

    getUserSchema() {
        return {
            id: 'string',
            username: 'string',
            email: 'string',
            role: 'string', // admin, editor, viewer
            permissions: 'array',
            isActive: 'boolean',
            lastLogin: 'string',
            createdAt: 'string',
            updatedAt: 'string'
        };
    }

    getSettingsSchema() {
        return {
            id: 'string',
            key: 'string',
            value: 'mixed',
            category: 'string',
            description: 'string',
            isPublic: 'boolean',
            createdAt: 'string',
            updatedAt: 'string',
            updatedBy: 'string'
        };
    }

    getAnalyticsSchema() {
        return {
            id: 'string',
            entityType: 'string',
            entityId: 'string',
            action: 'string', // view, edit, delete, create
            userId: 'string',
            metadata: 'object',
            timestamp: 'string',
            ipAddress: 'string',
            userAgent: 'string'
        };
    }

    // ===== CRUD OPERATIONS =====

    // CREATE
    async create(entityType, data, userId = 'system') {
        try {
            const entity = this.entities[entityType];
            if (!entity) {
                throw new Error(`Unknown entity type: ${entityType}`);
            }

            // Validate schema
            const validatedData = this.validateSchema(data, entity.schema);
            
            // Add required fields
            const newEntity = {
                id: uuidv4(),
                ...validatedData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: userId,
                lastModifiedBy: userId
            };

            // Load existing data
            const existingData = await this.loadData(entityType);
            
            // Add new entity
            if (Array.isArray(existingData)) {
                existingData.push(newEntity);
            } else {
                existingData[newEntity.id] = newEntity;
            }

            // Save data
            await this.saveData(entityType, existingData);

            // Log analytics
            await this.logAnalytics(entityType, newEntity.id, 'create', userId);

            console.log(`✅ Created ${entityType}: ${newEntity.id}`);
            return newEntity;

        } catch (error) {
            console.error(`❌ Error creating ${entityType}:`, error);
            throw error;
        }
    }

    // READ
    async read(entityType, id = null, filters = {}) {
        try {
            const entity = this.entities[entityType];
            if (!entity) {
                throw new Error(`Unknown entity type: ${entityType}`);
            }

            const data = await this.loadData(entityType);

            if (id) {
                // Return specific entity
                const entity = Array.isArray(data) 
                    ? data.find(item => item.id === id)
                    : data[id];
                
                if (!entity) {
                    throw new Error(`${entityType} with id ${id} not found`);
                }

                // Log view analytics
                await this.logAnalytics(entityType, id, 'view');

                return entity;
            } else {
                // Return filtered list
                let entities = Array.isArray(data) ? data : Object.values(data);
                
                // Apply filters
                entities = this.applyFilters(entities, filters);
                
                return entities;
            }

        } catch (error) {
            console.error(`❌ Error reading ${entityType}:`, error);
            throw error;
        }
    }

    // UPDATE
    async update(entityType, id, updates, userId = 'system') {
        try {
            const entity = this.entities[entityType];
            if (!entity) {
                throw new Error(`Unknown entity type: ${entityType}`);
            }

            // Load existing data
            const data = await this.loadData(entityType);
            
            // Find entity to update
            let existingEntity;
            if (Array.isArray(data)) {
                existingEntity = data.find(item => item.id === id);
                if (!existingEntity) {
                    throw new Error(`${entityType} with id ${id} not found`);
                }
            } else {
                existingEntity = data[id];
                if (!existingEntity) {
                    throw new Error(`${entityType} with id ${id} not found`);
                }
            }

            // Validate updates against schema
            const validatedUpdates = this.validateSchema(updates, entity.schema, true);
            
            // Update entity
            const updatedEntity = {
                ...existingEntity,
                ...validatedUpdates,
                updatedAt: new Date().toISOString(),
                lastModifiedBy: userId
            };

            // Save updated data
            if (Array.isArray(data)) {
                const index = data.findIndex(item => item.id === id);
                data[index] = updatedEntity;
            } else {
                data[id] = updatedEntity;
            }

            await this.saveData(entityType, data);

            // Log analytics
            await this.logAnalytics(entityType, id, 'update', userId);

            console.log(`✅ Updated ${entityType}: ${id}`);
            return updatedEntity;

        } catch (error) {
            console.error(`❌ Error updating ${entityType}:`, error);
            throw error;
        }
    }

    // DELETE
    async delete(entityType, id, userId = 'system') {
        try {
            const entity = this.entities[entityType];
            if (!entity) {
                throw new Error(`Unknown entity type: ${entityType}`);
            }

            // Load existing data
            const data = await this.loadData(entityType);
            
            // Check if entity exists
            let existingEntity;
            if (Array.isArray(data)) {
                existingEntity = data.find(item => item.id === id);
                if (!existingEntity) {
                    throw new Error(`${entityType} with id ${id} not found`);
                }
            } else {
                existingEntity = data[id];
                if (!existingEntity) {
                    throw new Error(`${entityType} with id ${id} not found`);
                }
            }

            // Remove entity
            if (Array.isArray(data)) {
                const index = data.findIndex(item => item.id === id);
                data.splice(index, 1);
            } else {
                delete data[id];
            }

            await this.saveData(entityType, data);

            // Log analytics
            await this.logAnalytics(entityType, id, 'delete', userId);

            console.log(`✅ Deleted ${entityType}: ${id}`);
            return { success: true, deletedId: id };

        } catch (error) {
            console.error(`❌ Error deleting ${entityType}:`, error);
            throw error;
        }
    }

    // BULK OPERATIONS
    async bulkCreate(entityType, entities, userId = 'system') {
        const results = [];
        for (const entity of entities) {
            try {
                const result = await this.create(entityType, entity, userId);
                results.push({ success: true, data: result });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }
        return results;
    }

    async bulkUpdate(entityType, updates, userId = 'system') {
        const results = [];
        for (const update of updates) {
            try {
                const result = await this.update(entityType, update.id, update.data, userId);
                results.push({ success: true, data: result });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }
        return results;
    }

    async bulkDelete(entityType, ids, userId = 'system') {
        const results = [];
        for (const id of ids) {
            try {
                const result = await this.delete(entityType, id, userId);
                results.push({ success: true, data: result });
            } catch (error) {
                results.push({ success: false, error: error.message });
            }
        }
        return results;
    }

    // ===== UTILITY METHODS =====

    async loadData(entityType) {
        const entity = this.entities[entityType];
        if (!entity) {
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        const filePath = path.join(this.dataDir, entity.file);
        
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, return empty structure
                return Array.isArray(entity.schema) ? [] : {};
            }
            throw error;
        }
    }

    async saveData(entityType, data) {
        const entity = this.entities[entityType];
        if (!entity) {
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        const filePath = path.join(this.dataDir, entity.file);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    validateSchema(data, schema, isUpdate = false) {
        const validated = {};
        
        for (const [key, expectedType] of Object.entries(schema)) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                
                // Type validation
                if (!this.validateType(value, expectedType)) {
                    throw new Error(`Invalid type for ${key}: expected ${expectedType}, got ${typeof value}`);
                }
                
                validated[key] = value;
            } else if (!isUpdate) {
                // Required fields for creation
                if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && 
                    key !== 'createdBy' && key !== 'lastModifiedBy') {
                    throw new Error(`Missing required field: ${key}`);
                }
            }
        }
        
        return validated;
    }

    validateType(value, expectedType) {
        switch (expectedType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number';
            case 'boolean':
                return typeof value === 'boolean';
            case 'array':
                return Array.isArray(value);
            case 'object':
                return typeof value === 'object' && value !== null && !Array.isArray(value);
            case 'mixed':
                return true; // Accept any type
            default:
                return true;
        }
    }

    applyFilters(entities, filters) {
        return entities.filter(entity => {
            for (const [key, value] of Object.entries(filters)) {
                if (entity[key] !== value) {
                    return false;
                }
            }
            return true;
        });
    }

    async logAnalytics(entityType, entityId, action, userId = 'system') {
        try {
            const analyticsData = {
                entityType,
                entityId,
                action,
                userId,
                timestamp: new Date().toISOString(),
                metadata: {}
            };

            await this.create('analytics', analyticsData, userId);
        } catch (error) {
            console.error('Error logging analytics:', error);
        }
    }

    // ===== QUERY METHODS =====

    async findByField(entityType, field, value) {
        const entities = await this.read(entityType);
        return entities.filter(entity => entity[field] === value);
    }

    async findOneByField(entityType, field, value) {
        const entities = await this.read(entityType);
        return entities.find(entity => entity[field] === value);
    }

    async count(entityType, filters = {}) {
        const entities = await this.read(entityType, null, filters);
        return entities.length;
    }

    async exists(entityType, id) {
        try {
            await this.read(entityType, id);
            return true;
        } catch (error) {
            return false;
        }
    }

    // ===== RELATIONSHIP METHODS =====

    async getProjectWithSeries(projectId) {
        const project = await this.read('projects', projectId);
        const series = await this.findByField('series', 'projectId', projectId);
        return { ...project, series };
    }

    async getSeriesWithImages(seriesId) {
        const series = await this.read('series', seriesId);
        const images = await this.findByField('images', 'seriesId', seriesId);
        return { ...series, images };
    }

    async getProjectWithAllContent(projectId) {
        const project = await this.read('projects', projectId);
        const series = await this.findByField('series', 'projectId', projectId);
        
        // Get images for each series
        for (const s of series) {
            s.images = await this.findByField('images', 'seriesId', s.id);
        }
        
        return { ...project, series };
    }
}

module.exports = CRUDManager;
