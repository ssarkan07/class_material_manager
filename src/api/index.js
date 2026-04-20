/**
 * api/index.js — Central API service for Class Material Manager
 *
 * All communication with the FastAPI backend lives here.
 * Components just call these functions — they never write fetch() themselves.
 *
 * Base URL: http://localhost:8000
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";

// ── Helper ─────────────────────────────────────────────────────────────────────
async function request(url, options = {}) {
  // Ensure we don't have double slashes when joining BASE_URL and url
  const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullUrl = `${BASE_URL}/${normalizedUrl}`;
  
  const response = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }
  // 204 No Content has no body
  if (response.status === 204) return null;
  return response.json();
}

// ── YEARS ──────────────────────────────────────────────────────────────────────

/**
 * GET /api/years
 * Returns all year tabs (SY, TY, BY) with their subjects.
 * Used by Dashboard to populate the sidebar and subject list.
 */
export const getYears = () => request("/years/");

// ── SUBJECTS ───────────────────────────────────────────────────────────────────

/**
 * GET /api/years/{yearKey}/subjects
 * Returns subjects for a specific year tab (e.g. 'SY').
 */
export const getSubjects = (yearKey) => request(`/years/${yearKey}/subjects`);

/**
 * POST /api/years/{yearKey}/subjects
 * Adds a new subject to the given year tab.
 * @param {string} yearKey - e.g. 'SY'
 * @param {string} subjectName - e.g. 'Machine Learning'
 */
export const addSubject = (yearKey, subjectName) =>
  request(`/years/${yearKey}/subjects`, {
    method: "POST",
    body: JSON.stringify({ name: subjectName }),
  });

/**
 * DELETE /api/years/subjects/{subjectId}
 * Deletes a subject and all its sections/files.
 */
export const deleteSubject = (subjectId) =>
  request(`/years/subjects/${subjectId}`, { method: "DELETE" });

// ── FILES & SECTIONS ───────────────────────────────────────────────────────────

/**
 * GET /api/subjects/{subjectName}/sections
 * Returns all sections + files for a subject.
 * Used by FilesLink screen.
 * @param {string} subjectName - e.g. 'DBMS'
 */
export const getSubjectSections = (subjectName) =>
  request(`/subjects/${subjectName}/sections`);

/**
 * POST /api/sections/{section_id}/files
 * Adds a new file to a specific section and subject.
 * @param {number} sectionId - The section's database ID
 * @param {{ name: string, link: string, subject_id: number }} fileData
 */
export const addFile = (sectionId, fileData) =>
  request(`/sections/${sectionId}/files`, {
    method: "POST",
    body: JSON.stringify(fileData),
  });

/**
 * DELETE /api/files/{fileId}
 * Deletes a specific file by its ID.
 */
export const deleteFile = (fileId) =>
  request(`/files/${fileId}`, { method: "DELETE" });

/**
 * PATCH /api/years/subjects/{subjectId}
 * Renames a subject (folder).
 * @param {number} subjectId
 * @param {string} name - new subject name
 */
export const updateSubject = (subjectId, name) =>
  request(`/years/subjects/${subjectId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

/**
 * PATCH /api/files/{fileId}
 * Updates a file's name and/or link URL.
 * @param {number} fileId
 * @param {{ name?: string, link?: string }} data
 */
export const updateFile = (fileId, data) =>
  request(`/files/${fileId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
