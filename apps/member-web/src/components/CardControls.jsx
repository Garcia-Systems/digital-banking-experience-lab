import PropTypes from "prop-types";
import { useState } from "react";

export default function CardControls({ accountName }) {
  const [isCardLocked, setIsCardLocked] = useState(false);

  function handleLockCard() {
    setIsCardLocked(true);
  }

  function handleUnlockCard() {
    setIsCardLocked(false);
  }

  return (
    <section
      className="card-controls"
      aria-label={`Card controls for ${accountName}`}
    >
      <div>
        <h4>Card controls</h4>
        <p className="card-lock-status" aria-live="polite">
          {isCardLocked ? "Card locked" : "Card unlocked"}
        </p>
      </div>
      <button
        type="button"
        onClick={isCardLocked ? handleUnlockCard : handleLockCard}
        aria-label={`${isCardLocked ? "Unlock" : "Lock"} card for ${accountName}`}
      >
        {isCardLocked ? "Unlock card" : "Lock card"}
      </button>
      <p className="simulation-note">
        Simulation only — no banking system has been updated.
      </p>
    </section>
  );
}

CardControls.propTypes = {
  accountName: PropTypes.string.isRequired,
};
