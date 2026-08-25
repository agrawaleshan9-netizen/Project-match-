import { Router } from 'express';
import { getProjects, getProjectById, addProject } from '../storage/db.js';

const router = Router();

/**
 * GET /api/projects
 * Retrieve all projects
 */
router.get('/', (req, res) => {
  try {
    const projects = getProjects();
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve projects',
      message: err.message
    });
  }
});

/**
 * GET /api/projects/:id
 * Retrieve a specific project by ID
 */
router.get('/:id', (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        message: `No project found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve project',
      message: err.message
    });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', (req, res) => {
  try {
    const { title, description, requiredRoles, requiredSkills, minAvailabilityHours } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Project title is required.'
      });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Project description is required.'
      });
    }

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'At least one required role is required (e.g. Frontend, UI/UX Designer).'
      });
    }

    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'At least one required skill is required (e.g. React, Figma).'
      });
    }

    const newProject = addProject(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      message: err.message
    });
  }
});

export default router;
