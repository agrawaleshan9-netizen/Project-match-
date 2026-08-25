import { Router } from 'express';
import { resetToSeed } from '../storage/db.js';

const router = Router();

/**
 * POST /api/seed
 * Reset and re-seed the active database with default demo data
 */
router.post('/', (req, res) => {
  try {
    const data = resetToSeed();
    res.json({
      success: true,
      message: 'Database successfully reset to seed data.',
      summary: {
        studentsCount: data.students.length,
        projectsCount: data.projects.length
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to reset database',
      message: err.message
    });
  }
});

export default router;
