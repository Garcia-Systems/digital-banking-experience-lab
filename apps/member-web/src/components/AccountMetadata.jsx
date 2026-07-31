import PropTypes from "prop-types";
import { formatOwnership } from "../utils/formatters";

export default function AccountMetadata({
  nickname,
  ownership,
  interestBearing,
  transfersRestricted,
}) {
  return (
    <dl className="account-metadata">
      <div>
        <dt>Nickname</dt>
        <dd>{nickname}</dd>
      </div>
      <div>
        <dt>Ownership</dt>
        <dd>{formatOwnership(ownership)}</dd>
      </div>
      <div>
        <dt>Dividends</dt>
        <dd>{interestBearing ? "Earns dividends" : "No dividends"}</dd>
      </div>
      {transfersRestricted ? (
        <div className="restricted-metadata">
          <dt>Transfers</dt>
          <dd>Transfers unavailable</dd>
        </div>
      ) : null}
    </dl>
  );
}

AccountMetadata.propTypes = {
  nickname: PropTypes.string.isRequired,
  ownership: PropTypes.oneOf(["individual", "joint"]).isRequired,
  interestBearing: PropTypes.bool.isRequired,
  transfersRestricted: PropTypes.bool.isRequired,
};
