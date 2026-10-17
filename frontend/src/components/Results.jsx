import ScoreCard from "./ScoreCard.jsx";
import SkillLists from "./SkillLists.jsx";
import HealthChecks from "./HealthChecks.jsx";

function DetailList({ title, items, emptyText }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      {items && items.length ? (
        <ul className="detail-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="empty-detail">{emptyText}</p>
      )}
    </article>
  );
}

/** Everything below the form, shown once a resume has been scored. */
export default function Results({ analysis }) {
  return (
    <div className="results">
      <ScoreCard analysis={analysis} />
      <SkillLists present={analysis.present} missing={analysis.missing} />
      <HealthChecks checks={analysis.checks} />

      <div className="grid-2 detail-grid">
        <DetailList
          title="Education"
          items={analysis.education}
          emptyText="No education details were extracted from the resume."
        />
        <DetailList
          title="Experience"
          items={analysis.experience}
          emptyText="No experience details were extracted from the resume."
        />
      </div>

      <div className="grid-2 detail-grid">
        <DetailList
          title="Strengths"
          items={analysis.strengths}
          emptyText="No notable strengths were detected."
        />
        <DetailList
          title="Weaknesses"
          items={analysis.weaknesses}
          emptyText="No major weaknesses were detected."
        />
      </div>

      <DetailList
        title="Improvement suggestions"
        items={analysis.improvementSuggestions}
        emptyText="No suggestions were generated for this resume."
      />

      <article className="card card-next">
        <h3>Fix this first</h3>
        <p>{analysis.nextStep}</p>
      </article>

      <p className="disclaimer">
        {analysis.engine === "gemini-ai-v1"
          ? "AI-assisted job and resume comparison with resume-structure checks."
          : "Keyword matching and resume-structure checks are being used. Set GEMINI_API_KEY on the backend to enable Gemini AI analysis."} {analysis.saved
          ? "This analysis was saved to MongoDB."
          : "MongoDB is unavailable, so this analysis was not saved."}
      </p>
    </div>
  );
}
