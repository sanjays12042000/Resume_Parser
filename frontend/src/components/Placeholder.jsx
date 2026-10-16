/**
 * Shown in the results column before an analysis exists, so the two-column
 * layout keeps its shape instead of collapsing to one lopsided card.
 */
export default function Placeholder() {
  return (
    <div className="placeholder">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 3v5h5" />
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M8 13h8M8 17h5" />
      </svg>
      <h3>Your results will appear here</h3>
      <p>Paste the job description and add your resume PDF, then run the analysis to see your match score and skill gaps.</p>
    </div>
  );
}
