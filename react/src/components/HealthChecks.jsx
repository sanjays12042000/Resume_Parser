export default function HealthChecks({ checks }) {
  return (
    <article className="card">
      <h3>Resume health checks</h3>
      <ul className="checks">
        {checks.map((check) => (
          <li key={check.label}>
            <span className={`tick ${check.pass ? "pass" : "fail"}`}>{check.pass ? "✓" : "!"}</span>
            <span>
              <b>{check.label}</b>
              {!check.pass && ` — ${check.hint}`}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
