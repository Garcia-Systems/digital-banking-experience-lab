import { useState } from "react";
import PropTypes from "prop-types";
import { formatCents, formatMaskedSuffix } from "../utils/formatters";
import { accountPropType } from "../propTypes/bankingPropTypes";

const MEMO_LIMIT = 100;

function accountLabel(account) {
  return `${account.displayName} (${formatMaskedSuffix(account.accountSuffix)})`;
}

function validateTransfer(values, accounts) {
  const errors = {};
  const source = accounts.find((account) => account.id === values.sourceId);

  if (!values.sourceId) errors.sourceId = "Choose a source account.";
  if (!values.destinationId)
    errors.destinationId = "Choose a destination account.";
  if (
    values.sourceId &&
    values.destinationId &&
    values.sourceId === values.destinationId
  ) {
    errors.destinationId = "Source and destination accounts must be different.";
  }

  if (values.amount === null) {
    errors.amount = "Enter a transfer amount.";
  } else if (values.amount === 0) {
    errors.amount = "Transfer amount must be greater than zero.";
  } else if (values.amount < 0) {
    errors.amount = "Transfer amount must be positive.";
  } else if (
    source &&
    Math.round(values.amount * 100) > source.availableBalanceCents
  ) {
    errors.amount = `Amount cannot exceed the available balance of ${formatCents(source.availableBalanceCents)}.`;
  }

  if (values.memo.length > MEMO_LIMIT) {
    errors.memo = `Memo must be ${MEMO_LIMIT} characters or fewer.`;
  }

  return errors;
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p className="field-error" id={id}>
      {children}
    </p>
  );
}

FieldError.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.string,
};

export default function TransferForm({ accounts }) {
  const [values, setValues] = useState({
    sourceId: "",
    destinationId: "",
    amount: null,
    memo: "",
  });
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(null);

  function updateValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setReview(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTransfer(values, accounts);
    setErrors(nextErrors);
    setReview(Object.keys(nextErrors).length === 0 ? values : null);
  }

  const reviewedSource = accounts.find(
    (account) => account.id === review?.sourceId,
  );
  const reviewedDestination = accounts.find(
    (account) => account.id === review?.destinationId,
  );

  return (
    <main id="main-content" className="route-page transfer-page">
      <p className="eyebrow">Transfer money</p>
      <h1>Prepare a transfer</h1>
      <p className="transfer-intro">
        Move fictional money between your Harbor accounts. Nothing will be sent
        yet.
      </p>

      <form className="transfer-form" onSubmit={handleSubmit} noValidate>
        {Object.keys(errors).length > 0 && (
          <div className="validation-summary" role="alert">
            Check the highlighted fields before reviewing this transfer.
          </div>
        )}

        <div className="form-field">
          <label htmlFor="source-account">Source account</label>
          <select
            id="source-account"
            value={values.sourceId}
            onChange={(event) => updateValue("sourceId", event.target.value)}
            aria-invalid={Boolean(errors.sourceId)}
            aria-describedby={errors.sourceId ? "source-error" : undefined}
          >
            <option value="">Choose an account</option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {accountLabel(account)} — available{" "}
                {formatCents(account.availableBalanceCents)}
              </option>
            ))}
          </select>
          <FieldError id="source-error">{errors.sourceId}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="destination-account">Destination account</label>
          <select
            id="destination-account"
            value={values.destinationId}
            onChange={(event) =>
              updateValue("destinationId", event.target.value)
            }
            aria-invalid={Boolean(errors.destinationId)}
            aria-describedby={
              errors.destinationId ? "destination-error" : undefined
            }
          >
            <option value="">Choose an account</option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {accountLabel(account)}
              </option>
            ))}
          </select>
          <FieldError id="destination-error">{errors.destinationId}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="transfer-amount">Amount</label>
          <div className="money-input">
            <span aria-hidden="true">$</span>
            <input
              id="transfer-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={values.amount ?? ""}
              onChange={(event) =>
                updateValue(
                  "amount",
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? "amount-error" : "amount-help"}
            />
          </div>
          <p className="field-help" id="amount-help">
            Enter dollars and cents without a currency symbol.
          </p>
          <FieldError id="amount-error">{errors.amount}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="transfer-memo">Memo (optional)</label>
          <input
            id="transfer-memo"
            type="text"
            value={values.memo}
            onChange={(event) => updateValue("memo", event.target.value)}
            aria-invalid={Boolean(errors.memo)}
            aria-describedby="memo-help memo-error"
          />
          <p className="field-help" id="memo-help">
            {values.memo.length} of {MEMO_LIMIT} characters
          </p>
          <FieldError id="memo-error">{errors.memo}</FieldError>
        </div>

        <button className="primary-action" type="submit">
          Review
        </button>
      </form>

      {review && (
        <section className="transfer-review" aria-labelledby="review-title">
          <p className="eyebrow">Review</p>
          <h2 id="review-title">Transfer summary</h2>
          <dl>
            <div>
              <dt>Source</dt>
              <dd>{accountLabel(reviewedSource)}</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>{accountLabel(reviewedDestination)}</dd>
            </div>
            <div>
              <dt>Amount</dt>
              <dd>{formatCents(Math.round(review.amount * 100))}</dd>
            </div>
            <div>
              <dt>Memo</dt>
              <dd>{review.memo || "No memo"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Ready for submission</dd>
            </div>
          </dl>
          <p className="review-note">
            This review is read-only. No transfer has been submitted.
          </p>
        </section>
      )}
    </main>
  );
}

TransferForm.propTypes = {
  accounts: PropTypes.arrayOf(accountPropType.isRequired).isRequired,
};
