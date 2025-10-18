const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory storage for development (replace with MongoDB in production)
let projects = [];
let nextId = 1;

// Project structure
const createProject = (name, description, files) => ({
  _id: (nextId++).toString(),
  name,
  description,
  files: files || [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Routes

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const sortedProjects = projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json(sortedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific project
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = projects.find(p => p._id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new project
app.post('/api/projects', (req, res) => {
  try {
    const { name, description, files } = req.body;
    const project = createProject(name, description, files);
    projects.push(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a project
app.put('/api/projects/:id', (req, res) => {
  try {
    const { name, description, files } = req.body;
    const projectIndex = projects.findIndex(p => p._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      name,
      description,
      files,
      updatedAt: new Date().toISOString()
    };
    
    res.json(projects[projectIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    projects.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
