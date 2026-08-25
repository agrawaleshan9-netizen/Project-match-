import { Router } from 'express';
import { getStudents, getStudentById, addStudent } from '../storage/db.js';

const router = Router();

/**
 * GET /api/students
 * Retrieve all student profiles, optional filter by role
 */
router.get('/', (req, res) => {
  try {
    const { role } = req.query;
    let students = getStudents();

    if (role) {
      students = students.filter(
        (s) => (s.primaryRole || '').toLowerCase() === role.toLowerCase()
      );
    }

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve students',
      message: err.message
    });
  }
});

/**
 * GET /api/students/:id
 * Retrieve a specific student by ID
 */
router.get('/:id', (req, res) => {
  try {
    const student = getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
        message: `No student profile found with ID: ${req.params.id}`
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve student',
      message: err.message
    });
  }
});

/**
 * POST /api/students
 * Create a new student profile
 */
router.post('/', (req, res) => {
  try {
    const { name, primaryRole, skills, availabilityHours } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Student name is required.'
      });
    }

    if (!primaryRole || typeof primaryRole !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Primary role is required (e.g. Frontend, Backend, UI/UX Designer, AI/ML, Fullstack, Product/Domain).'
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'At least one skill with proficiency is required.'
      });
    }

    const newStudent = addStudent(req.body);

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: newStudent
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to create student profile',
      message: err.message
    });
  }
});

export default router;
