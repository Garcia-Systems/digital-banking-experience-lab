import PropTypes from "prop-types";
import { accountPropType } from "../propTypes/bankingPropTypes";
import AccountCard from "./AccountCard";

export default function AccountList({ accounts }) {
  if (accounts.length === 0) {
    return (
      <p className="empty-accounts">No accounts are currently available.</p>
    );
  }

  return (
    <ul className="account-grid">
      {accounts.map((account) => (
        <li key={account.id}>
          <AccountCard account={account} />
        </li>
      ))}
    </ul>
  );
}

AccountList.propTypes = {
  accounts: PropTypes.arrayOf(accountPropType.isRequired).isRequired,
};
