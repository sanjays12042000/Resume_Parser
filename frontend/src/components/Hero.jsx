export default function Hero({ onSample }) {
  return (
    <section className="hero">
      <p className="eyebrow">
        <span className="dot" /> Keyword-based resume and job-description comparison
      </p>
      <h1>
        Know your resume score
        <br />
        <span className="grad">before a recruiter does.</span>
      </h1>
      <p className="lede">
        Upload a PDF resume and paste a job description to see your match score, the skills you
        already show, the skills you may be missing, and what to improve first. AI analysis will
        be added later.
      </p>
      <div className="hero-cta">
        <a className="btn btn-primary" href="#analyze">
          Analyze my resume &rarr;
        </a>
        <button className="btn btn-ghost" type="button" onClick={onSample}>
          Use a sample job description
        </button>
      </div>

      <ul className="hero-stats">
        <li>
          <strong>PDF + JD</strong>
          <span>compared together</span>
        </li>
        <li>
          <strong>MongoDB</strong>
          <span>analysis history</span>
        </li>
        <li>
          <strong>AI later</strong>
          <span>keyword matching now</span>
        </li>
      </ul>
    </section>
  );
}
