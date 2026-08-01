import {
  checkSession,
  clearLaboratorySessionToken,
  login,
  logout,
} from "../api/session";

function response(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}

describe("mobile laboratory session API", () => {
  beforeEach(() => {
    clearLaboratorySessionToken();
    jest
      .spyOn(global, "fetch")
      .mockImplementation(async (url, options = {}) => {
        const endpoint = new URL(url).pathname;
        if (endpoint === "/api/login" && options.method === "POST") {
          const credentials = JSON.parse(options.body);
          if (credentials.password !== "password")
            return response(401, { error: { code: "invalid_credentials" } });
          return response(200, {
            authenticated: true,
            memberId: "member-1001",
            laboratorySessionToken: "lab-session-member-1001",
          });
        }
        if (endpoint === "/api/session" && options.headers.Authorization)
          return response(200, { authenticated: true });
        if (endpoint === "/api/logout" && options.method === "POST")
          return response(200, { authenticated: false });
        throw new Error(
          `Unexpected request: ${options.method || "GET"} ${endpoint}`,
        );
      });
  });
  afterEach(() => jest.restoreAllMocks());

  it("does not call the protected session endpoint before a mobile token exists", async () => {
    await expect(checkSession()).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("signs in, restores the in-memory session, and logs out with authorization", async () => {
    await login({ memberId: "member-1001", password: "password" });
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "http://127.0.0.1:8000/api/login",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Laboratory-Client": "mobile",
        },
      }),
    );
    await expect(checkSession()).resolves.toEqual({ authenticated: true });
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe(
      "Bearer lab-session-member-1001",
    );
    await logout();
    expect(fetch.mock.calls[2][1]).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer lab-session-member-1001" },
      }),
    );
    await expect(checkSession()).resolves.toBeNull();
  });
});
