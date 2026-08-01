import {
  apiRequest,
  clearLaboratorySessionToken,
  hasLaboratorySessionToken,
  setLaboratorySessionToken,
} from "./client";

export async function checkSession(options = {}) {
  if (!hasLaboratorySessionToken()) return null;
  const response = await apiRequest("/api/session", options);
  return response.json();
}

export async function login({ memberId, password }, options = {}) {
  const response = await apiRequest("/api/login", {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Laboratory-Client": "mobile",
    },
    body: JSON.stringify({ memberId, password }),
  });
  const session = await response.json();
  if (session.laboratorySessionToken !== "lab-session-member-1001") {
    throw new Error("invalid_laboratory_session");
  }
  setLaboratorySessionToken(session.laboratorySessionToken);
  return session;
}

export async function logout(options = {}) {
  try {
    await apiRequest("/api/logout", { ...options, method: "POST" });
  } finally {
    clearLaboratorySessionToken();
  }
}

export { clearLaboratorySessionToken };
