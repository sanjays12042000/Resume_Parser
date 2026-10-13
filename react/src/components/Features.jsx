const FEATURES = [
  {
    title: "Instant score",
    body: "A weighted 0–100 match score, not a wall of text you have to interpret."
  },
  {
    title: "Gap list",
    body: "The role's expected skills your resume never mentions, ranked by how often they're asked for."
  },
  {
    title: "Keyword aliases",
    body: '"JS" counts as JavaScript. "Postgres" counts as PostgreSQL. ATS keyword traps, handled.'
  },
  {
    title: "Private by default",
    body: "No upload endpoint exists in this build. Close the tab and nothing is left behind."
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
