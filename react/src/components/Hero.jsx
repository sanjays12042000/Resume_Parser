export default function Hero({ skillCount, onSample }) {
  return (
    <section className="hero">
      <p className="eyebrow">
        <span className="dot" /> Runs 100% in your browser &mdash; your resume never leaves your laptop
      </p>
      <h1>
        Know your resume score
        <br />
        <span className="grad">before a recruiter does.</span>
      </h1>
      <p className="lede">
        Drop in a PDF resume, pick the role you're targeting, and get an instant match score
        &mdash; the skills you already show, the ones the role expects and your resume never
        mentions, and what to fix first.
      </p>
      <div className="hero-cta">
        <a className="btn btn-primary" href="#analyze">
          Analyze my resume &rarr;
        </a>
        <button className="btn btn-ghost" type="button" onClick={onSample}>
          Try a sample resume
        </button>
      </div>

      <ul className="hero-stats">
        <li>
          <strong>{skillCount}</strong>
          <span>skills checked per role</span>
        </li>
        <li>
          <strong>0 ms</strong>
          <span>server round-trip</span>
        </li>
        <li>
          <strong>PDF</strong>
          <span>parsed client-side</span>
        </li>
      </ul>
    </section>
  );
}
