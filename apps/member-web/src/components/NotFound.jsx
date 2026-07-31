import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main-content" className="route-page">
      <p className="eyebrow">Page not found</p>
      <h1>We can’t find that page.</h1>
      <p>The page may have moved or the address may be incorrect.</p>
      <Link to="/">Return to dashboard</Link>
    </main>
  );
}
