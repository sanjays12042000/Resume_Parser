/**
 * Turn an unexpected error into a diagnostic payload.
 *
 * A deployed serverless host gives you no logs, so when a request fails there
 * is nothing to go on - which is exactly how the PDF reader stayed a mystery.
 * This puts the environment and the underlying cause into the JSON response.
 *
 * The details are only exposed outside production, so a public deployment
 * cannot be probed for paths or internals. Set DEBUG_ERRORS=true to force it
 * on while diagnosing a live deployment, then turn it off again.
 */
const alwaysDetailed = process.env.DEBUG_ERRORS === "true";

export function describeError(error) {
  const chain = [];
  let current = error;
  while (current && chain.length < 5) {
    chain.push({
      name: current.name,
      message: current.message,
      code: current.code
    });
    current = current.cause;
  }

  return {
    environment: { node: process.version, platform: process.platform },
    error: chain
  };
}

/** Should this response carry the diagnostic block? */
export function errorsAreDetailed() {
  return alwaysDetailed || process.env.NODE_ENV !== "production";
}
