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

    // Normalization helper for accurate matching
    const norm = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    // Enrich current team members with full profile details
    const currentMembersEnriched = (project.currentMembers || []).map((m) => {
      const stud = allStudents.find((s) => s.id === m.studentId);
      return {
        studentId: m.studentId,
        name: stud ? stud.name : 'Team Member',
        avatar: stud ? stud.avatar : 'TM',
        role: m.role || (stud ? stud.primaryRole : 'Contributor'),
        skills: stud && Array.isArray(stud.skills) ? stud.skills.map((s) => (typeof s === 'string' ? s : s.name)) : []
      };
    });

    // 1. PROJECT NEEDS: required roles & required skills
    const requiredRoles = Array.isArray(project.requiredRoles) ? project.requiredRoles : [];
    const requiredSkills = Array.isArray(project.requiredSkills) ? project.requiredSkills : [];
    const projectNeedsList = [...requiredRoles, ...requiredSkills];

    // 2. CURRENT TEAM: skills/roles covered by current team
    const coveredRoles = new Set();
    const coveredSkills = new Set();
    for (const member of currentMembersEnriched) {
      if (member.role) coveredRoles.add(member.role);
      for (const sk of member.skills) {
        coveredSkills.add(sk);
      }
    }

    const currentTeamCoveredList = [];
    for (const r of coveredRoles) currentTeamCoveredList.push(r);
    for (const s of coveredSkills) currentTeamCoveredList.push(s);

    // 3. MISSING SKILLS: required roles/skills not covered by current team
    const missingRoles = requiredRoles.filter(
      (r) => !Array.from(coveredRoles).some((cr) => norm(cr) === norm(r))
    );
    const missingSkills = requiredSkills.filter(
      (s) => !Array.from(coveredSkills).some((cs) => norm(cs) === norm(s) || norm(cs).includes(norm(s)) || norm(s).includes(norm(cs)))
    );
    const missingNeedsList = [...missingRoles, ...missingSkills];

    // Sort descending by compatibility score
    eligibleMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // RECOMMENDED CANDIDATE: highest-ranked candidate who fills at least one missing skill/role
    const recommendedCandidateMatch = eligibleMatches.find((m) => {
      const fillsSkill = (m.missingSkillsSupplied || []).some((ms) =>
        missingNeedsList.some((mn) => norm(mn) === norm(ms))
      );
      const fillsRole = missingRoles.some((mr) => norm(mr) === norm(m.roleCovered || m.student.primaryRole));
      return fillsSkill || fillsRole;
    }) || eligibleMatches[0] || null;

    const recommendedCandidate = recommendedCandidateMatch ? {
      studentId: recommendedCandidateMatch.student.id,
      name: recommendedCandidateMatch.student.name,
      role: recommendedCandidateMatch.roleCovered || recommendedCandidateMatch.student.primaryRole,
      filledSkillOrRole: (recommendedCandidateMatch.missingSkillsSupplied && recommendedCandidateMatch.missingSkillsSupplied.length > 0)
        ? recommendedCandidateMatch.missingSkillsSupplied.join(', ')
        : (recommendedCandidateMatch.roleCovered || recommendedCandidateMatch.student.primaryRole),
      compatibilityScore: recommendedCandidateMatch.compatibilityScore
    } : null;

    // SUGGESTED CANDIDATES: all candidates who can fill missing skills/roles
    const suggestedCandidates = eligibleMatches.filter((m) => {
      const fillsSkill = (m.missingSkillsSupplied || []).some((ms) =>
        missingNeedsList.some((mn) => norm(mn) === norm(ms))
      );
      const fillsRole = missingRoles.some((mr) => norm(mr) === norm(m.roleCovered || m.student.primaryRole));
      return fillsSkill || fillsRole;
    }).map((m) => ({
      studentId: m.student.id,
      name: m.student.name,
      role: m.roleCovered || m.student.primaryRole,
      filledSkillOrRole: (m.missingSkillsSupplied && m.missingSkillsSupplied.length > 0)
        ? m.missingSkillsSupplied.join(', ')
        : (m.roleCovered || m.student.primaryRole),
      compatibilityScore: m.compatibilityScore
    }));

    res.json({
      success: true,
      data: {
        project: {
          ...project,
          currentMembers: currentMembersEnriched
        },
        skillGap: {
          projectNeeds: projectNeedsList,
          currentTeam: currentTeamCoveredList,
          missingSkills: missingNeedsList,
          recommendedCandidate
        },
        teamBalance: {
          covered: currentTeamCoveredList,
          missing: missingNeedsList,
          suggested: suggestedCandidates
        },
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
