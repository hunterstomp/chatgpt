const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Basic CORS
app.use(cors({
  origin: 'http://localhost:8001',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple upload endpoint
app.post('/api/upload/single', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Upload endpoint ready',
    data: { test: true }
  });
});

// Simple gallery endpoint
app.get('/api/gallery/:project', (req, res) => {
  res.json({
    project: req.params.project,
    flows: {},
    totalImages: 0
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Q10UX Simple Backend Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: http://localhost:8001`);
});
