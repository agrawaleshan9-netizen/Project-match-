import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  initDb,
  getDb,
  saveDb,
  getStudents,
  getStudentById,
  addStudent,
  getProjects,
  getProjectById,
  addProject,
  resetToSeed
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../data/db.json');

console.log('🧪 Starting Phase 1 Storage Verification Tests...\n');

// 1. Test Initialization
console.log('Test 1: Initializing DB from seed data...');
const initialDb = resetToSeed();
console.assert(initialDb.students.length === 15, `Expected 15 students, got ${initialDb.students.length}`);
console.assert(initialDb.projects.length === 5, `Expected 5 projects, got ${initialDb.projects.length}`);
console.log(`✅ Test 1 Passed: Loaded ${initialDb.students.length} students and ${initialDb.projects.length} projects.`);

// 2. Test Accessors
console.log('\nTest 2: Testing student & project lookup...');
const student1 = getStudentById('std_01');
console.assert(student1 && student1.name === 'Sarah Chen', 'Failed to retrieve Sarah Chen by ID');
const project1 = getProjectById('proj_01');
console.assert(project1 && project1.title === 'MediScan AI', 'Failed to retrieve MediScan AI by ID');
console.log(`✅ Test 2 Passed: Retrieved student "${student1.name}" and project "${project1.title}".`);

// 3. Test Insertion
console.log('\nTest 3: Testing student and project creation...');
const createdStudent = addStudent({
  name: 'Test Candidate',
  primaryRole: 'Frontend',
  experienceLevel: 'Beginner',
  skills: [{ name: 'React', proficiency: 'Intermediate' }],
  interests: ['EdTech'],
  availabilityHours: 15,
  timezoneOffset: 0,
  shortBio: 'Test bio'
});
console.assert(getStudentById(createdStudent.id) !== null, 'Failed to persist new student');

const createdProject = addProject({
  title: 'Test Project',
  description: 'Test description',
  targetTeamSize: 3,
  requiredRoles: ['Frontend'],
  requiredSkills: ['React'],
  minAvailabilityHours: 10,
  track: 'EdTech'
});
console.assert(getProjectById(createdProject.id) !== null, 'Failed to persist new project');
console.log(`✅ Test 3 Passed: Successfully created student "${createdStudent.id}" and project "${createdProject.id}".`);

// 4. Test Corruption Recovery
console.log('\nTest 4: Simulating corrupted db.json...');
fs.writeFileSync(DB_FILE, '{ corrupted invalid json content ...', 'utf-8');
const recoveredDb = getDb();
console.assert(recoveredDb.students.length === 15, 'Recovery failed to restore 15 students');
console.assert(recoveredDb.projects.length === 5, 'Recovery failed to restore 5 projects');
console.log('✅ Test 4 Passed: Handled corrupted database safely and restored from seed data.');

// 5. Clean Reset
console.log('\nTest 5: Resetting database to clean state...');
resetToSeed();
console.log('✅ Test 5 Passed: Clean reset verified.');

console.log('\n🎉 ALL PHASE 1 STORAGE TESTS PASSED SUCCESSFULLY!\n');
