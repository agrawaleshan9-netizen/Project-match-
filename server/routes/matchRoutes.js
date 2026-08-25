import { Router } from 'express';
import { getProjectById, getStudents } from '../storage/db.js';
import { evaluateHardFilters } from '../engine/hardFilters.js';
import { scoreCandidate } from '../engine/scoringEngine.js';
import { generateMatchExplanation } from '../engine/aiExplainer.js';

const router = Router();

/**
 * GET /api/projects/:id/matches
 * Calculate and return ranked candidate matches for a project
 */
router.get('/:id/matches', async (req, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        message: `No project found with ID: ${req.params.id}`
      });
    }

    const allStudents = getStudents();
    const eligibleMatches = [];
    const ineligibleCandidates = [];

    for (const student of allStudents) {
      const filterResult = evaluateHardFilters(student, project);

      if (!filterResult.passes) {
        ineligibleCandidates.push({
          studentId: student.id,
          name: student.name,
          primaryRole: student.primaryRole,
          reasons: filterResult.reasons
        });
        continue;
      }

      // Calculate deterministic compatibility score
      const matchMetrics = scoreCandidate(student, project);

      // Generate explainable rationale (AI with fallback)
      const { explanation, source } = await generateMatchExplanation(student, project, matchMetrics);

      eligibleMatches.push({
        student,
        compatibilityScore: matchMetrics.compatibilityScore,
        scoreBreakdown: matchMetrics.scoreBreakdown,
        matchedSkills: matchMetrics.matchedSkills,
        missingSkillsSupplied: matchMetrics.missingSkillsSupplied,
        roleCovered: matchMetrics.roleCovered,
        aiExplanation: explanation,
        explanationSource: source
      });
    }

    // Sort descending by compatibility score
    eligibleMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      success: true,
      data: {
        project,
        totalCandidatesEvaluated: allStudents.length,
        eligibleMatchesCount: eligibleMatches.length,
        matches: eligibleMatches,
        ineligibleCandidates
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate matches',
      message: err.message
    });
  }
});

export default router;
