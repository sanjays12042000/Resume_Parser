const FEATURES = [
  {
    title: "Instant score",
    body: "A weighted 0–100 match score, not a wall of text you have to interpret."
  },
  {
    title: "Gap list",
    body: "Skills requested by the job description that your resume does not mention, ranked by frequency."
  },
  {
    title: "Keyword aliases",
    body: '"JS" counts as JavaScript. "Postgres" counts as PostgreSQL. Common keyword variations are handled.'
  },
  {
    title: "Local API processing",
    body: "Your resume and job description are sent to this app's API. Analysis history is saved when MongoDB is available."
  }
];

export default function Features() {
  return (
    <section className="features" id="features">
      <h2>Built for the apply-now loop</h2>
      <div className="feature-grid">
        {FEATURES.map((feature) => (
          <article className="feature" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
