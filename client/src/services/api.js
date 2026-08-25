/**
 * API Service for ProjectMatch Client
 * Features transparent fallback from Vite proxy (/api) to direct backend (localhost:5000 / 127.0.0.1:5000)
 * with robust error handling and safe JSON parsing.
 */

const API_BASE = '/api';
const DIRECT_BACKEND_URL = 'http://localhost:5000/api';
const DIRECT_BACKEND_IP_URL = 'http://127.0.0.1:5000/api';

/**
 * Executes a resilient API request trying proxy first, then direct origins if network fails.
 */
async function apiRequest(endpoint, options = {}) {
  const urlsToTry = [
    `${API_BASE}${endpoint}`,
    `${DIRECT_BACKEND_URL}${endpoint}`,
    `${DIRECT_BACKEND_IP_URL}${endpoint}`
  ];

  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, options);

      let data = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { message: text };
      }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `HTTP error ${res.status}`);
      }

      return data;
    } catch (err) {
      lastError = err;
      // If the server responded with an application-level HTTP error (4xx/5xx), do not retry
      if (err.message && (err.message.startsWith('HTTP error') || err.message.includes('not found') || err.message.includes('Validation'))) {
        throw err;
      }
      // If it's a network error (e.g. "Failed to fetch"), attempt next fallback URL
    }
  }

  throw lastError || new Error('Network error: Unable to connect to ProjectMatch backend.');
}

export async function fetchStudents(role = '') {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  return apiRequest(`/students${query}`);
}

export async function fetchStudentById(id) {
  return apiRequest(`/students/${id}`);
}

export async function createStudent(studentData) {
  return apiRequest('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
}

export async function fetchProjects() {
  return apiRequest('/projects');
}

export async function fetchProjectById(id) {
  return apiRequest(`/projects/${id}`);
}

export async function createProject(projectData) {
  return apiRequest('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  });
}

export async function fetchProjectMatches(projectId) {
  return apiRequest(`/projects/${projectId}/matches`);
}

export async function resetDatabase() {
  return apiRequest('/seed', {
    method: 'POST'
  });
}
