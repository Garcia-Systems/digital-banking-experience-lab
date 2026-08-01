import { useEffect, useRef, useState } from "react";
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
  const [statusRequest, setStatusRequest] = useState(0);
  const operationActive = useRef(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/member-verification?scenario=${encodeURIComponent(scenario)}`)
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
  }, [scenario, statusRequest]);

  const verify = async () => {
    if (operationActive.current) return;
    operationActive.current = true;
    setRequestState(verification?.canRetry ? "retrying" : "submitting");
    try {
      const response = await fetch(
        `/api/member-verification?scenario=${encodeURIComponent(scenario)}`,
        { method: "POST" },
      );
      const payload = await response.json();
      if (!response.ok && !payload.status) throw new Error("request failed");
      setVerification(payload);
      setRequestState("ready");
    } catch {
      setRequestState("error");
    } finally {
      operationActive.current = false;
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
        <h1>Identity verification</h1>
        <p role="alert">Member verification is temporarily unavailable.</p>
        <button
          className="primary-action"
          type="button"
          onClick={() => {
            setRequestState("loading");
            setStatusRequest((request) => request + 1);
          }}
        >
          Retry verification
        </button>
      </main>
    );

  const pending = ["submitting", "retrying"].includes(requestState);
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
        {verification.canRetry && (
          <>
            {requestState === "retrying" && (
              <p role="status">Retrying your verification…</p>
            )}
            <button
              className="primary-action"
              type="button"
              onClick={verify}
              disabled={pending}
              aria-describedby={pending ? "retry-progress" : undefined}
            >
              {requestState === "retrying" ? "Trying Again…" : "Try Again"}
            </button>
            {requestState === "retrying" && (
              <span id="retry-progress" className="visually-hidden">
                Retry in progress. Additional requests are disabled.
              </span>
            )}
          </>
        )}
      </section>
    </main>
  );
}
