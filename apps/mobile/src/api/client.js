const defaultBaseUrl = "http://127.0.0.1:8000";

let laboratorySessionToken = null;

export class ApiError extends Error {
  constructor(code, status) {
    super(code);
    this.name = "ApiError";
    this.status = status;
  }
}

export function apiBaseUrl(value = process.env.EXPO_PUBLIC_API_BASE_URL) {
  return (value || defaultBaseUrl).replace(/\/$/, "");
}

export function setLaboratorySessionToken(token) {
  laboratorySessionToken = token;
}

export function clearLaboratorySessionToken() {
  laboratorySessionToken = null;
}

export function hasLaboratorySessionToken() {
  return laboratorySessionToken !== null;
}

export async function apiRequest(path, options = {}) {
  const { baseUrl, headers, ...fetchOptions } = options;
  const requestHeaders = { ...headers };
  if (laboratorySessionToken) {
    requestHeaders.Authorization = `Bearer ${laboratorySessionToken}`;
  }

  const response = await fetch(`${apiBaseUrl(baseUrl)}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });
  if (!response.ok) {
    let code = "request_failed";
    try {
      const payload = await response.json();
      code = payload?.error?.code || code;
    } catch {
      // A safe local code is sufficient when an error body is not JSON.
    }
    throw new ApiError(code, response.status);
  }
  return response;
}
