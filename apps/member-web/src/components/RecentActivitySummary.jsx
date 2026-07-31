import PropTypes from "prop-types";

export default function RecentActivitySummary({ accountName, transactions }) {
  return (
    <section
      className="recent-activity"
      aria-label={`${accountName} recent activity`}
    >
      <h4>Recent activity</h4>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>{transaction.description}</li>
          ))}
        </ul>
      ) : (
        <p>No recent transactions.</p>
      )}
    </section>
  );
}

RecentActivitySummary.propTypes = {
  accountName: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
