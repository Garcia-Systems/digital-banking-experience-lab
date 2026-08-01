import { useState } from "react";
import { members } from "../data/operationsFixtures.js";
import { useOperationsResource } from "../api/operations.js";

export default function Members() {
  const [query, setQuery] = useState("");
  const { data } = useOperationsResource("members", { members });
  const filtered = data.members.filter(({ memberId, displayName }) =>
    `${memberId} ${displayName}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <header>
        <p className="eyebrow">Member support</p>
        <h2>Member lookup</h2>
        <p>Search fictional records by member ID or display name.</p>
      </header>
      <label className="search">
        Search members
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="member-1001 or Avery"
        />
      </label>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Display name</th>
              <th>Verification</th>
              <th>Accounts</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.memberId}>
                <td>{member.memberId}</td>
                <td>{member.displayName}</td>
                <td>
                  <span className="status">{member.verificationStatus}</span>
                </td>
                <td>{member.accountCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p>No fictional members match that search.</p>
        )}
      </div>
    </>
  );
}
