import PropTypes from "prop-types";

export const accountPropType = PropTypes.exact({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["open", "dormant", "restricted"]).isRequired,
  displayName: PropTypes.string.isRequired,
  accountSuffix: PropTypes.string.isRequired,
  availableBalanceCents: PropTypes.number.isRequired,
  currentBalanceCents: PropTypes.number.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
});

export const projectionPropType = PropTypes.exact({
  generatedAt: PropTypes.string.isRequired,
  isStale: PropTypes.bool.isRequired,
});

export const dashboardPropType = PropTypes.exact({
  member: PropTypes.exact({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  projection: projectionPropType.isRequired,
  accounts: PropTypes.arrayOf(accountPropType.isRequired).isRequired,
});
