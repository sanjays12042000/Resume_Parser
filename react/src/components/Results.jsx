import ScoreCard from "./ScoreCard.jsx";
import SkillLists from "./SkillLists.jsx";
import HealthChecks from "./HealthChecks.jsx";
import { nextStepFor } from "../lib/scoring.js";

/** Everything below the form, shown once a resume has been scored. */
export default function Results({ analysis }) {
  return (
    <div className="results">
      <ScoreCard analysis={analysis} />
      <SkillLists present={analysis.present} missing={analysis.missing} />
      <HealthChecks checks={analysis.checks} />

      <article className="card card-next">
        <h3>Fix this first</h3>
        <p>{nextStepFor(analysis)}</p>
      </article>

      <p className="disclaimer">
        Demo model: the score comes from keyword matching against a fixed skill list for the
        selected role, plus six resume-structure checks. Real ATS scoring also weighs recency,
        depth and impact metrics.
      </p>
    </div>
  );
}
