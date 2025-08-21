const validateFile = (req, res, next) => {
  if (!req.file && (!req.files || req.files.length === 0)) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  next();
};

const validateProject = (req, res, next) => {
  const project = req.body.project;
  if (!project) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  // Validate project name format
  const validProjects = [
    'atmosfx', 'tmobile', 'bmgf', 'microsoft', 'att', 'office'
  ];

  if (!validProjects.includes(project)) {
    return res.status(400).json({ 
      error: 'Invalid project name',
      validProjects: validProjects
    });
  }

  next();
};

module.exports = {
  validateFile,
  validateProject
};
