import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths for persistent data and fallback seed data
const DATA_DIR = process.env.VERCEL
  ? path.resolve('/tmp/data')
  : path.resolve(__dirname, '../data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');
const SEED_FILE = path.resolve(__dirname, 'seedData.json');

/**
 * Loads default seed data from seedData.json
 * @returns {object} { students: [], projects: [] }
 */
export function loadSeedData() {
  try {
    const rawSeed = fs.readFileSync(SEED_FILE, 'utf-8');
    return JSON.parse(rawSeed);
  } catch (err) {
    console.error('[DB] Error loading seedData.json:', err.message);
    return { students: [], projects: [] };
  }
}

/**
 * Initializes the database.
 * Creates data/ directory and db.json if missing, or re-seeds if forced.
 * @param {boolean} forceReset - If true, overwrites db.json with seedData.json
 * @returns {object} The current database content
 */
export function initDb(forceReset = false) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (forceReset || !fs.existsSync(DB_FILE)) {
    const seed = loadSeedData();
    saveDb(seed);
    console.log(`[DB] Initialized database at ${DB_FILE} with ${seed.students.length} students and ${seed.projects.length} projects.`);
    return seed;
  }

  return getDb();
}

/**
 * Reads the active db.json database safely.
 * If file is corrupted or unparseable, automatically restores from seedData.json.
 * @returns {object} { students: [], projects: [] }
 */
export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    return initDb(true);
  }

  try {
    const rawContent = fs.readFileSync(DB_FILE, 'utf-8');
    if (!rawContent.trim()) {
      console.warn('[DB] db.json was empty, resetting to seed data.');
      return initDb(true);
    }
    const data = JSON.parse(rawContent);

    // Validate expected structure
    if (!Array.isArray(data.students) || !Array.isArray(data.projects)) {
      console.warn('[DB] db.json had invalid schema, resetting to seed data.');
      return initDb(true);
    }

    return data;
  } catch (err) {
    console.error('[DB] db.json is corrupted (JSON Parse Error). Restoring from seed data...', err.message);
    return initDb(true);
  }
}

/**
 * Writes data safely to db.json with formatting.
 * @param {object} data - { students: Student[], projects: Project[] }
 */
export function saveDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const payload = {
      students: Array.isArray(data.students) ? data.students : [],
      projects: Array.isArray(data.projects) ? data.projects : []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Could not write to disk in current environment:', err.message);
  }
}

/**
 * Student Accessor Helpers
 */
export function getStudents() {
  const db = getDb();
  return db.students;
}

export function getStudentById(id) {
  const students = getStudents();
  return students.find((s) => s.id === id) || null;
}

export function addStudent(studentData) {
  const db = getDb();
  const newStudent = {
    id: studentData.id || `std_${Date.now().toString(36)}`,
    name: studentData.name,
    avatar: studentData.avatar || studentData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    primaryRole: studentData.primaryRole,
    experienceLevel: studentData.experienceLevel || 'Intermediate',
    skills: studentData.skills || [],
    interests: studentData.interests || [],
    availabilityHours: Number(studentData.availabilityHours) || 10,
    timezoneOffset: Number(studentData.timezoneOffset) || 0,
    shortBio: studentData.shortBio || '',
    githubUrl: studentData.githubUrl || '',
    portfolioUrl: studentData.portfolioUrl || '',
    assessmentStatus: studentData.assessmentStatus || 'Not Completed',
    createdAt: new Date().toISOString()
  };

  db.students.push(newStudent);
  saveDb(db);
  return newStudent;
}

/**
 * Project Accessor Helpers
 */
export function getProjects() {
  const db = getDb();
  return db.projects;
}

export function getProjectById(id) {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
}

export function addProject(projectData) {
  const db = getDb();
  const newProject = {
    id: projectData.id || `proj_${Date.now().toString(36)}`,
    title: projectData.title,
    description: projectData.description,
    targetTeamSize: Number(projectData.targetTeamSize) || 4,
    requiredRoles: projectData.requiredRoles || [],
    requiredSkills: projectData.requiredSkills || [],
    minAvailabilityHours: Number(projectData.minAvailabilityHours) || 10,
    track: projectData.track || 'General',
    currentMembers: projectData.currentMembers || [],
    createdAt: new Date().toISOString()
  };

  db.projects.push(newProject);
  saveDb(db);
  return newProject;
}

/**
 * Resets database to default seed data.
 */
export function resetToSeed() {
  return initDb(true);
}
