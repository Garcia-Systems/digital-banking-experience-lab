import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const labels = {
  not_started: "Not Started",
  pending: "Verification Pending",
  verified: "Verified",
  retry_required: "Retry Required",
  verification_failed: "Verification Failed",
};

export default function MemberVerification() {
  const [searchParams] = useSearchParams();
  const scenario = searchParams.get("verificationScenario") || "success";
  const [verification, setVerification] = useState(null);
  const [requestState, setRequestState] = useState("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/member-verification")
      .then((response) => {
        if (!response.ok) throw new Error("request failed");
        return response.json();
      })
      .then((payload) => {
        if (active) {
          setVerification(payload);
          setRequestState("ready");
        }
      })
      .catch(() => active && setRequestState("error"));
    return () => {
      active = false;
    };
  }, []);

  const verify = async () => {
    setRequestState("submitting");
    try {
      const response = await fetch(
        `/api/member-verification?scenario=${encodeURIComponent(scenario)}`,
        { method: "POST" },
      );
      if (!response.ok) throw new Error("request failed");
      setVerification(await response.json());
      setRequestState("ready");
    } catch {
      setRequestState("error");
    }
  };

  if (requestState === "loading")
    return (
      <main className="verification-page">
        <p role="status">Loading verification status…</p>
      </main>
    );

  if (requestState === "error")
    return (
      <main className="verification-page">
        <p role="alert">
          We could not load your verification status. Please try again later.
        </p>
      </main>
    );

  const pending = requestState === "submitting";
  return (
    <main className="verification-page" id="main-content">
      <p className="eyebrow">Member security</p>
      <h1>Identity verification</h1>
      <section
        className="verification-card"
        aria-labelledby="verification-status"
      >
        <h2 id="verification-status">Current status</h2>
        <p
          className={`verification-badge status-${pending ? "pending" : verification.status}`}
        >
          {pending ? labels.pending : labels[verification.status]}
        </p>
        <p>
          {pending
            ? "We are checking your information. Please wait."
            : verification.message}
        </p>
        <dl>
          <dt>Last verification attempt</dt>
          <dd>
            {verification.lastAttemptAt
              ? new Date(verification.lastAttemptAt).toLocaleString("en-US", {
                  timeZone: "UTC",
                })
              : "No attempts yet"}
          </dd>
        </dl>
        {!pending && verification.status === "not_started" && (
          <button className="primary-action" type="button" onClick={verify}>
            Start verification
          </button>
        )}
        {!pending && verification.canRetry && (
          <button className="primary-action" type="button" onClick={verify}>
            Try Again
          </button>
        )}
      </section>
    </main>
  );
}
