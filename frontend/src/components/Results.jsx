import ScoreCard from "./ScoreCard.jsx";
import SkillLists from "./SkillLists.jsx";
import HealthChecks from "./HealthChecks.jsx";

/** Everything below the form, shown once a resume has been scored. */
export default function Results({ analysis }) {
  return (
    <div className="results">
      <ScoreCard analysis={analysis} />
      <SkillLists present={analysis.present} missing={analysis.missing} />
      <HealthChecks checks={analysis.checks} />

      <article className="card card-next">
        <h3>Fix this first</h3>
        <p>{analysis.nextStep}</p>
      </article>

      <p className="disclaimer">
        {analysis.engine === "labd-ai-v1"
          ? "AI-assisted job and resume comparison with resume-structure checks."
          : "Keyword matching and resume-structure checks are being used. Set LABD_API_KEY on the backend to enable AI analysis."} {analysis.saved
          ? "This analysis was saved to MongoDB."
          : "MongoDB is unavailable, so this analysis was not saved."}
      </p>
    </div>
  );
}
