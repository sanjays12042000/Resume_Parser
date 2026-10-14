import useCountUp from "../hooks/useCountUp.js";

/**
 * The animated 0-100 ring. The conic-gradient is driven by the --pct
 * custom property, which React sets inline; the number counts up.
 */
export default function ScoreCard({ analysis }) {
  const { score, band, sub, skillPct, present, totalSkills } = analysis;
  const shown = useCountUp(score);

  return (
    <div className="score-card">
      <div className="ring" style={{ "--pct": score }} role="img" aria-label={`Score ${score} out of 100`}>
        <div className="ring-inner">
          <span className="ring-value">{shown}</span>
          <span className="ring-unit">/ 100</span>
        </div>
      </div>
      <div className="score-meta">
        <p className="score-band">{band}</p>
        <p className="score-sub">{sub}</p>
        <div className="bar">
          <div className="bar-fill" style={{ width: `${Math.round(skillPct * 100)}%` }} />
        </div>
        <p className="bar-legend">
          {present.length} of {totalSkills} skills from the job description found in your resume
        </p>
      </div>
    </div>
  );
}
