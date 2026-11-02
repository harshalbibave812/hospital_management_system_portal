import { getToken } from './auth.utils';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Central fetch wrapper.
 * @param {string} endpoint  - e.g. '/auth/login'
 * @param {object} options   - { method, body, auth }
 *   auth: true  → attaches Bearer token header
 *   body: object → JSON-stringified automatically
 * @returns parsed JSON response
 * @throws error with { message, status } on non-2xx or network failure
 */
const request = async (endpoint, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export default request;
