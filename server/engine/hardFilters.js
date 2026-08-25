/**
 * Hard filters for ProjectMatch.
 * Deterministically checks candidate eligibility before scoring.
 */

/**
 * Checks if a candidate passes all hard filter requirements for a given project.
 * 
 * Rules:
 * 1. Candidate must not already be a member of the project.
 * 2. Candidate's availability must meet the project's minimum required hours.
 * 3. Candidate's primary role must be among the project's required roles.
 * 
 * @param {object} student - Student profile
 * @param {object} project - Project details
 * @returns {object} { passes: boolean, reasons: string[] }
 */
export function evaluateHardFilters(student, project) {
  const reasons = [];

  // 1. Exclude students already in the project
  const isAlreadyMember = (project.currentMembers || []).some(
    (member) => member.studentId === student.id
  );
  if (isAlreadyMember) {
    return {
      passes: false,
      reasons: ['Student is already a member of this project.']
    };
  }

  // 2. Minimum availability check
  const minHours = Number(project.minAvailabilityHours) || 0;
  const studentHours = Number(student.availabilityHours) || 0;
  if (studentHours < minHours) {
    reasons.push(`Availability (${studentHours}h/wk) is below project minimum (${minHours}h/wk).`);
  }

  // 3. Required role check
  const requiredRoles = Array.isArray(project.requiredRoles) ? project.requiredRoles : [];
  const normalizedRequiredRoles = requiredRoles.map((r) => r.toLowerCase().trim());
  const studentRoleNormalized = (student.primaryRole || '').toLowerCase().trim();

  // Also check if existing members already filled this role (if role count is 1-to-1)
  const currentMembers = Array.isArray(project.currentMembers) ? project.currentMembers : [];
  const filledRoles = currentMembers.map((m) => (m.role || '').toLowerCase().trim());

  const isRoleRequired = normalizedRequiredRoles.includes(studentRoleNormalized);
  if (!isRoleRequired) {
    reasons.push(`Primary role "${student.primaryRole}" is not among project required roles.`);
  }

  return {
    passes: reasons.length === 0,
    reasons
  };
}

/**
 * Filters a pool of students against a project.
 * 
 * @param {Array} students 
 * @param {object} project 
 * @returns {Array} List of students who pass hard filters
 */
export function filterCandidates(students, project) {
  if (!Array.isArray(students) || !project) return [];

  return students.filter((student) => {
    const filterResult = evaluateHardFilters(student, project);
    return filterResult.passes;
  });
}
