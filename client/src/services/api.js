/**
 * API Service for ProjectMatch Client
 * Supports configurable VITE_API_URL for production cloud deployments
 * while preserving local Vite proxy (/api) and localhost direct fallbacks for development.
 */

// Allow configuring production backend URL via Vite environment variable
const ENV_API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const CONFIGURED_API_BASE = ENV_API_URL
  ? (ENV_API_URL.endsWith('/api') ? ENV_API_URL : `${ENV_API_URL}/api`)
  : null;

const API_BASE = CONFIGURED_API_BASE || '/api';
const DIRECT_BACKEND_URL = 'http://localhost:5000/api';
const DIRECT_BACKEND_IP_URL = 'http://127.0.0.1:5000/api';

/**
 * Executes an API request trying configured URL / proxy first,
 * with resilient direct localhost fallbacks in local development.
 */
async function apiRequest(endpoint, options = {}) {
  const urlsToTry = [`${API_BASE}${endpoint}`];

  // In local development without an explicit remote VITE_API_URL, add localhost fallbacks
  if (!CONFIGURED_API_BASE) {
    urlsToTry.push(`${DIRECT_BACKEND_URL}${endpoint}`);
    urlsToTry.push(`${DIRECT_BACKEND_IP_URL}${endpoint}`);
  }

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
      // If the server responded with a formal HTTP error (4xx/5xx), do not retry
      if (err.message && (err.message.startsWith('HTTP error') || err.message.includes('not found') || err.message.includes('Validation'))) {
        throw err;
      }
      // If it's a network error (e.g. "Failed to fetch"), attempt next fallback URL if available
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
