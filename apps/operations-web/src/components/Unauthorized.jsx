export default function Unauthorized() {
  return (
    <main className="centered">
      <p className="eyebrow">Access restricted</p>
      <h1>Operations access required</h1>
      <p>
        This fictional portal is available only to the deterministic{" "}
        <strong>operations-user</strong> role.
      </p>
    </main>
  );
}
