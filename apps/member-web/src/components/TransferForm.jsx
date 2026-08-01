import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { formatCents, formatMaskedSuffix } from "../utils/formatters";
import { accountPropType } from "../propTypes/bankingPropTypes";
import { useNavigate } from "react-router-dom";

const MEMO_LIMIT = 100;
const API_FIELD_NAMES = {
  sourceAccount: "sourceId",
  destinationAccount: "destinationId",
  amountCents: "amount",
  memo: "memo",
};

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
    errors.amount = "Transfer amount is required.";
  } else if (values.amount <= 0) {
    errors.amount = "Transfer amount must be greater than zero.";
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
  const navigate = useNavigate();
  const [values, setValues] = useState({
    sourceId: "",
    destinationId: "",
    amount: null,
    memo: "",
  });
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(null);
  const [submission, setSubmission] = useState({
    status: "idle",
    result: null,
    error: null,
  });
  const submissionLocked = useRef(false);

  function updateValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setReview(null);
    setSubmission({ status: "idle", result: null, error: null });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateTransfer(values, accounts);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setReview({
        ...values,
        // Generated once per valid review, then retained for every retry of it.
        idempotencyKey: crypto.randomUUID(),
      });
    } else {
      setReview(null);
    }
  }

  async function submitTransfer() {
    if (!review || submissionLocked.current) return;
    submissionLocked.current = true;
    setSubmission({ status: "submitting", result: null, error: null });

    try {
      const requestedScenario = new URLSearchParams(window.location.search).get(
        "transferScenario",
      );
      const scenario = [
        "accepted",
        "completed",
        "rejected",
        "unavailable",
      ].includes(requestedScenario)
        ? `?scenario=${requestedScenario}`
        : "";
      const response = await fetch(`/api/transfers${scenario}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceAccount: review.sourceId,
          destinationAccount: review.destinationId,
          amountCents: Math.round(review.amount * 100),
          memo: review.memo,
          idempotencyKey: review.idempotencyKey,
        }),
      });
      if (response.status === 422) {
        const body = await response.json();
        const serverErrors = Object.entries(body.errors ?? {}).reduce(
          (nextErrors, [field, messages]) => {
            const formField = API_FIELD_NAMES[field];
            if (formField && Array.isArray(messages) && messages[0]) {
              nextErrors[formField] = messages[0];
            }
            return nextErrors;
          },
          {},
        );

        submissionLocked.current = false;
        setErrors(serverErrors);
        setReview(null);
        setSubmission({ status: "idle", result: null, error: null });
        return;
      }
      if (response.status === 503) {
        const body = await response.json();
        throw new Error(
          body.error?.message || "Transfers are temporarily unavailable.",
        );
      }
      if (!response.ok) throw new Error("Transfer request failed");
      const result = await response.json();
      navigate(`/transfers/${encodeURIComponent(result.transferId)}`);
    } catch (error) {
      submissionLocked.current = false;
      setSubmission({ status: "error", result: null, error });
    }
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
        until you review and submit it.
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
            aria-errormessage={
              errors.sourceId ? "source-account-error" : undefined
            }
          >
            <option value="">Choose an account</option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {accountLabel(account)} — available{" "}
                {formatCents(account.availableBalanceCents)}
              </option>
            ))}
          </select>
          <FieldError id="source-account-error">{errors.sourceId}</FieldError>
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
            aria-errormessage={
              errors.destinationId ? "destination-account-error" : undefined
            }
          >
            <option value="">Choose an account</option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {accountLabel(account)}
              </option>
            ))}
          </select>
          <FieldError id="destination-account-error">
            {errors.destinationId}
          </FieldError>
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
              aria-describedby="transfer-amount-help"
              aria-errormessage={
                errors.amount ? "transfer-amount-error" : undefined
              }
            />
          </div>
          <p className="field-help" id="transfer-amount-help">
            Enter dollars and cents without a currency symbol.
          </p>
          <FieldError id="transfer-amount-error">{errors.amount}</FieldError>
        </div>

        <div className="form-field">
          <label htmlFor="transfer-memo">Memo (optional)</label>
          <input
            id="transfer-memo"
            type="text"
            value={values.memo}
            onChange={(event) => updateValue("memo", event.target.value)}
            aria-invalid={Boolean(errors.memo)}
            aria-describedby="transfer-memo-help"
            aria-errormessage={errors.memo ? "transfer-memo-error" : undefined}
          />
          <p className="field-help" id="transfer-memo-help">
            {values.memo.length} of {MEMO_LIMIT} characters
          </p>
          <FieldError id="transfer-memo-error">{errors.memo}</FieldError>
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
            This review is read-only. Submit represents one financial intention,
            not one button click.
          </p>
          <button
            className="primary-action"
            type="button"
            onClick={submitTransfer}
            disabled={
              submission.status === "submitting" ||
              submission.status === "success"
            }
          >
            {submission.status === "submitting"
              ? "Submitting transfer..."
              : "Submit transfer"}
          </button>
          {submission.status === "error" && (
            <p className="submission-error" role="alert">
              {submission.error?.message ||
                "The transfer could not be submitted."}{" "}
              Try again safely; the same idempotency key will be reused.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

TransferForm.propTypes = {
  accounts: PropTypes.arrayOf(accountPropType.isRequired).isRequired,
};
