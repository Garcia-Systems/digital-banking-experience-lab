export default function Settings() {
  return (
    <main id="main-content" className="route-page">
      <p className="eyebrow">Member preferences</p>
      <h1>Settings</h1>
      <p>This deterministic profile demonstrates a separate banking screen.</p>
      <dl className="settings-list">
        <div>
          <dt>Preferred language</dt>
          <dd>English</dd>
        </div>
        <div>
          <dt>Notification preference</dt>
          <dd>Email summaries</dd>
        </div>
        <div>
          <dt>Contact preference</dt>
          <dd>Secure message</dd>
        </div>
      </dl>
    </main>
  );
}
