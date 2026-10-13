const STEPS = [
  {
    n: 1,
    title: "You upload a PDF",
    body: "pdf.js reads the pages in your browser and pulls out the raw text layer."
  },
  {
    n: 2,
    title: "We match skills",
    body: "That text is compared against the skill list for your target role, aliases included."
  },
  {
    n: 3,
    title: "You get a plan",
    body: "A score, the gaps worth closing, and which one to fix before you apply."
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
