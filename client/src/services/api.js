/**
 * API Service for ProjectMatch Client
 * Communicates with the Express backend via Vite proxy
 */

const API_BASE = '/api';

export async function fetchStudents(role = '') {
  const url = role ? `${API_BASE}/students?role=${encodeURIComponent(role)}` : `${API_BASE}/students`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch students (${res.status})`);
  return res.json();
}

export async function fetchStudentById(id) {
  const res = await fetch(`${API_BASE}/students/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch student ${id}`);
  return res.json();
}

export async function createStudent(studentData) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create student');
  return data;
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
  return res.json();
}

export async function fetchProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
  return res.json();
}

export async function createProject(projectData) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create project');
  return data;
}

export async function fetchProjectMatches(projectId) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/matches`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Failed to calculate matches for project ${projectId}`);
  return data;
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/seed`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reset database');
  return data;
}
