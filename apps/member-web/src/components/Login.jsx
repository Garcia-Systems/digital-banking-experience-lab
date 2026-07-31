import { useState } from "react";
import PropTypes from "prop-types";

export default function Login({ message, onLogin }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: form.get("memberId"),
          password: form.get("password"),
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        setError("The laboratory credentials were not recognized.");
      else onLogin(payload);
    } catch {
      setError("Sign in is temporarily unavailable.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">Fictional learning environment</p>
        <h1>Member login</h1>
        <p>
          Use only the deterministic laboratory credentials shown below. They
          are intentionally insecure and must never be used in a real system.
        </p>
        {message && (
          <p className="session-message" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit}>
          <label htmlFor="memberId">Member ID</label>
          <input
            id="memberId"
            name="memberId"
            defaultValue="member-1001"
            autoComplete="username"
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="password"
            autoComplete="current-password"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
Login.propTypes = {
  message: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
};
