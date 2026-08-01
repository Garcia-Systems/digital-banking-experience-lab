const headers = { "X-Laboratory-Role": "operations-user" };

import { useEffect, useState } from "react";

export async function getOperationsResource(resource) {
  const response = await fetch(`/api/operations/${resource}`, { headers });
  if (!response.ok)
    throw new Error(response.status === 403 ? "unauthorized" : "unavailable");
  return response.json();
}

export function useOperationsResource(resource, fallback) {
  const [data, setData] = useState(fallback);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getOperationsResource(resource)
      .then((nextData) => active && setData(nextData))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [resource]);
  return { data, error };
}
