/**
 * The left-hand form: job description, drop zone, and submit button.
 * All state lives in App via props so the two panels stay in sync.
 */
export default function UploadPanel({
  jobDescription,
  onJobDescriptionChange,
  upload,
  isBusy,
  onAnalyze
}) {
  const { file, error, isDragging, inputRef, chooseFile, clear, dragProps } = upload;

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Resume Analyzer</h2>
        <p>Compare your resume PDF with the job description you want to target.</p>
      </div>

      <div className="field">
        <label htmlFor="jobDescription">Job description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          maxLength={20000}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here..."
          rows={7}
        />
      </div>

      <div className="field">
        <label htmlFor="fileInput">Resume file</label>
        <div
          className={`dropzone${isDragging ? " is-over" : ""}`}
          tabIndex={0}
          role="button"
          aria-label="Upload a resume PDF"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          {...dragProps}
        >
          <input
            type="file"
            id="fileInput"
            ref={inputRef}
            accept="application/pdf,.pdf"
            hidden
            onChange={(e) => chooseFile(e.target.files[0])}
          />
          <svg className="dz-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
          <p className="dz-title">
            Drop your PDF here or <span>browse files</span>
          </p>
          <p className="dz-hint">PDF only &middot; uploaded to your local API for analysis</p>
        </div>

        {file && (
          <p className="file-row">
            <span className="file-name">{file.name}</span>
            <button className="link-btn" type="button" onClick={clear}>
              remove
            </button>
          </p>
        )}
      </div>

      <button
        className="btn btn-primary btn-block"
        type="button"
        disabled={!file || !jobDescription.trim() || isBusy}
        onClick={onAnalyze}
      >
        {isBusy ? "Analyzing…" : "Get my score"}
      </button>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
