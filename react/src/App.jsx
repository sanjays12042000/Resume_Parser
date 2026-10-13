import { useState } from "react";

import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import Results from "./components/Results.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";

import { ROLES } from "./data/roles.js";
import { SAMPLE_RESUME } from "./data/sampleResume.js";
import { extractPdfText } from "./lib/pdf.js";
import { analyzeResume } from "./lib/scoring.js";
import useResumeUpload from "./hooks/useResumeUpload.js";

export default function App() {
  const [role, setRole] = useState("frontend");
  const [analysis, setAnalysis] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const upload = useResumeUpload();
  const { file, setError } = upload;

  async function handleAnalyze() {
    if (!file) return;
    setIsBusy(true);
    setError("");

    try {
      const text = await extractPdfText(file);
      if (!text.trim()) {
        throw new Error(
          "No text layer found in that PDF. If it's a scan or an image, export a text-based PDF instead."
        );
      }
      setAnalysis(analyzeResume(text, role));
    } catch (err) {
      setError(err.message || "Couldn't read that PDF.");
      setAnalysis(null);
    } finally {
      setIsBusy(false);
    }
  }

  // Scores a built-in resume so the page can be demoed without a file.
  function handleSample() {
    upload.clear();
    setAnalysis(analyzeResume(SAMPLE_RESUME, "frontend"));
  }

  return (
    <>
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <Nav />

      <main id="top">
        <Hero skillCount={ROLES[role].skills.length} onSample={handleSample} />

        <section className="analyzer" id="analyze">
          <UploadPanel
            role={role}
            onRoleChange={setRole}
            upload={upload}
            isBusy={isBusy}
            onAnalyze={handleAnalyze}
          />
          {analysis && <Results analysis={analysis} />}
        </section>

        <HowItWorks />
        <Features />
        <Footer />
      </main>
    </>
  );
}
