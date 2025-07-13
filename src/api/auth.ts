const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth`;

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function signup(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export function saveTokens({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function getAuthHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const authHeaders = getAuthHeaders();
  const headers = { ...(init.headers || {}), ...(authHeaders || {}) };
  return fetch(input, { ...init, headers });
}

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ refreshToken }),
    });
  }
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
} 