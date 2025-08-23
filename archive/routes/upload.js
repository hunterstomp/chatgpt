const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { validateFile, validateProject } = require('../middleware/validation');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20 // Max 20 files at once
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// Single file upload
router.post('/single', 
  upload.single('image'),
  validateFile,
  validateProject,
  uploadController.uploadSingle.bind(uploadController)
);

// Multiple files upload
router.post('/multiple',
  upload.array('images', 20),
  validateFile,
  validateProject,
  uploadController.uploadMultiple.bind(uploadController)
);

// Get upload statistics
router.get('/stats/:project', uploadController.getStats.bind(uploadController));

module.exports = router;
