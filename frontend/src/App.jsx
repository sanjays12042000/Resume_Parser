import { useState } from "react";

import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Nav from "./components/Nav.jsx";
import Results from "./components/Results.jsx";
import UploadPanel from "./components/UploadPanel.jsx";
import useResumeUpload from "./hooks/useResumeUpload.js";
import { analyzeResume } from "./lib/api.js";

export default function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const upload = useResumeUpload();
  const { file, setError } = upload;

  async function handleAnalyze() {
    if (!file || !jobDescription.trim()) return;
    setIsBusy(true);
    setError("");

    try {
      setAnalysis(await analyzeResume(file, jobDescription));
    } catch (err) {
      setError(err.message || "Couldn't analyze this resume.");
      setAnalysis(null);
    } finally {
      setIsBusy(false);
    }
  }

  function handleSampleJobDescription() {
    setJobDescription(
      "We are looking for a frontend engineer with experience building accessible web applications using React, JavaScript, TypeScript, HTML, CSS, REST APIs, Git, and automated testing."
    );
    setAnalysis(null);
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <Nav />

      <main id="top">
        <Hero onSample={handleSampleJobDescription} />

        <section className="analyzer" id="analyze">
          <UploadPanel
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
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
