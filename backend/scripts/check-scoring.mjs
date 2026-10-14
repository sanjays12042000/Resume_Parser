import assert from "node:assert/strict";

import { analyzeResume } from "../src/lib/scoring.js";

const resume = "Frontend engineer with React, JavaScript, TypeScript, HTML, CSS and Git experience.";
const jobDescription =
  "We need a React engineer. React and JavaScript are required. TypeScript, HTML, CSS, and Python are also useful.";
const result = analyzeResume(resume, jobDescription);

assert.equal(result.engine, "keyword-v1");
assert.ok(result.score >= 0 && result.score <= 100);
assert.ok(result.present.some((skill) => skill.name === "React"));
assert.ok(result.missing.some((skill) => skill.name === "Python"));
assert.equal(result.present.length + result.missing.length, result.totalSkills);
assert.ok(result.checks.length > 0);

console.log("Backend scoring checks passed.");
