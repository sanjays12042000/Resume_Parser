const STEPS = [
  {
    n: 1,
    title: "You upload a PDF",
    body: "The Express API extracts the text from your resume PDF."
  },
  {
    n: 2,
    title: "We compare the job description",
    body: "Keyword matching finds skills requested in the job description and checks your resume for them."
  },
  {
    n: 3,
    title: "You get your results",
    body: "See your score, matched and missing skills, resume health checks, and what to improve first."
  }
];

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <h2>How it works</h2>
      <div className="steps">
        {STEPS.map((step) => (
          <div className="step" key={step.n}>
            <span className="step-n">{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
