const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/questions`;

// Get all users (for the users list)
export async function getAllUsers() {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/users`, {
    headers: authHeaders || {},
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get questions received by a user
export async function getUserQuestions(userId: string) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${API_URL}/user/${userId}`, {
    headers: authHeaders || {},
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get questions asked by a user
export async function getAskedQuestions(userId: string) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${API_URL}/asked/${userId}`, {
    headers: authHeaders || {},
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Send a question to a user
export async function sendQuestion(toUserId: string, question: string, isAnonymous: boolean = false) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${API_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders || {}),
    },
    body: JSON.stringify({ toUserId, question, isAnonymous }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Answer a question
export async function answerQuestion(questionId: string, answer: string) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${API_URL}/${questionId}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaders || {}),
    },
    body: JSON.stringify({ answer }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Ignore a question
export async function ignoreQuestion(questionId: string) {
  const authHeaders = getAuthHeaders();
  const res = await fetch(`${API_URL}/${questionId}/ignore`, {
    method: 'POST',
    headers: authHeaders || {},
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Get feed questions
export async function getFeedQuestions() {
  const res = await fetch(`${API_URL}/feed`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : undefined;
} 