/* ============================================================
   ResumeIQ — client-side resume scorer
   No backend. pdf.js extracts the text, the code below scores it.
   ============================================================ */

/* ---------- 1. The scoring data ---------- */

// Each role lists the skills an ATS for that job tends to look for.
// `weight` = how much the skill matters for the role (1 = nice to have, 3 = core).
// `aliases` = other spellings that should also count as a hit.
const ROLES = {
  frontend: {
    label: "Frontend Engineer",
    skills: [
      { name: "JavaScript", weight: 3, aliases: ["js", "es6", "ecmascript"] },
      { name: "TypeScript", weight: 2, aliases: ["ts"] },
      { name: "React", weight: 3, aliases: ["react.js", "reactjs"] },
      { name: "HTML", weight: 2, aliases: ["html5"] },
      { name: "CSS", weight: 2, aliases: ["css3", "scss", "sass"] },
      { name: "Accessibility", weight: 1, aliases: ["a11y", "wcag", "aria"] },
      { name: "Testing", weight: 2, aliases: ["jest", "vitest", "playwright", "cypress", "unit test"] },
      { name: "Git", weight: 2, aliases: ["github", "gitlab", "version control"] },
      { name: "REST APIs", weight: 2, aliases: ["rest api", "restful", "fetch api"] },
      { name: "Performance", weight: 2, aliases: ["lighthouse", "core web vitals", "web performance"] },
      { name: "Build tools", weight: 1, aliases: ["webpack", "vite", "esbuild", "rollup"] },
      { name: "Responsive design", weight: 2, aliases: ["mobile-first", "media queries"] },
      { name: "State management", weight: 1, aliases: ["redux", "zustand", "context api"] },
      { name: "Node.js", weight: 1, aliases: ["node", "express"] }
    ]
  },
  backend: {
    label: "Backend Engineer",
    skills: [
      { name: "Node.js", weight: 2, aliases: ["node", "express", "nestjs"] },
      { name: "Python", weight: 2, aliases: ["django", "flask", "fastapi"] },
      { name: "SQL", weight: 3, aliases: ["postgres", "postgresql", "mysql", "sqlite"] },
      { name: "NoSQL", weight: 1, aliases: ["mongodb", "dynamodb", "redis"] },
      { name: "REST APIs", weight: 3, aliases: ["rest api", "restful"] },
      { name: "Authentication", weight: 2, aliases: ["jwt", "oauth", "auth", "session"] },
      { name: "Docker", weight: 2, aliases: ["container", "dockerfile"] },
      { name: "CI/CD", weight: 2, aliases: ["github actions", "jenkins", "pipeline"] },
      { name: "Cloud", weight: 2, aliases: ["aws", "gcp", "azure", "s3", "ec2"] },
      { name: "Testing", weight: 2, aliases: ["pytest", "jest", "integration test", "unit test"] },
      { name: "Caching", weight: 1, aliases: ["redis", "memcached", "cdn"] },
      { name: "Message queues", weight: 1, aliases: ["kafka", "rabbitmq", "sqs", "pub/sub"] },
      { name: "Git", weight: 1, aliases: ["github", "version control"] },
      { name: "System design", weight: 2, aliases: ["scalability", "architecture", "load balancing"] }
    ]
  },
  fullstack: {
    label: "Full-stack Developer",
    skills: [
      { name: "JavaScript", weight: 3, aliases: ["js", "es6"] },
      { name: "TypeScript", weight: 2, aliases: ["ts"] },
      { name: "React", weight: 2, aliases: ["react.js", "next.js", "nextjs"] },
      { name: "Node.js", weight: 2, aliases: ["node", "express"] },
      { name: "HTML", weight: 1, aliases: ["html5"] },
      { name: "CSS", weight: 2, aliases: ["css3", "tailwind", "scss"] },
      { name: "SQL", weight: 2, aliases: ["postgres", "postgresql", "mysql"] },
      { name: "REST APIs", weight: 3, aliases: ["rest api", "restful", "graphql"] },
      { name: "Authentication", weight: 1, aliases: ["jwt", "oauth", "auth"] },
      { name: "Git", weight: 2, aliases: ["github", "version control"] },
      { name: "Testing", weight: 2, aliases: ["jest", "vitest", "cypress", "pytest"] },
      { name: "Docker", weight: 1, aliases: ["container", "dockerfile"] },
      { name: "Deployment", weight: 2, aliases: ["vercel", "netlify", "heroku", "cloud", "aws", "ci/cd"] },
      { name: "State management", weight: 1, aliases: ["redux", "zustand", "context api"] }
    ]
  },
  data: {
    label: "Data / ML Engineer",
    skills: [
      { name: "Python", weight: 3, aliases: ["pandas", "numpy"] },
      { name: "SQL", weight: 3, aliases: ["postgres", "postgresql", "mysql", "bigquery"] },
      { name: "Machine learning", weight: 3, aliases: ["ml", "scikit-learn", "sklearn", "model training"] },
      { name: "Deep learning", weight: 1, aliases: ["pytorch", "tensorflow", "keras", "neural network"] },
      { name: "Data visualisation", weight: 1, aliases: ["matplotlib", "seaborn", "tableau", "power bi", "data visualization"] },
      { name: "Statistics", weight: 2, aliases: ["statistical", "regression", "hypothesis testing"] },
      { name: "ETL / pipelines", weight: 2, aliases: ["etl", "airflow", "data pipeline", "dbt"] },
      { name: "Spark", weight: 1, aliases: ["pyspark", "hadoop", "databricks"] },
      { name: "Cloud", weight: 2, aliases: ["aws", "gcp", "azure", "sagemaker"] },
      { name: "Docker", weight: 1, aliases: ["container", "dockerfile"] },
      { name: "Git", weight: 1, aliases: ["github", "version control"] },
      { name: "Data modelling", weight: 2, aliases: ["data modeling", "schema design", "feature engineering"] },
      { name: "Experimentation", weight: 1, aliases: ["a/b test", "ab testing", "experiment"] },
      { name: "Notebooks", weight: 1, aliases: ["jupyter", "colab", "databricks notebook"] }
    ]
  }
};

/* ---------- 2. Grab the elements we need ---------- */

const $ = (id) => document.getElementById(id);

const roleSelect  = $("role");
const dropzone    = $("dropzone");
const fileInput   = $("fileInput");
const fileRow     = $("fileRow");
const fileName    = $("fileName");
const clearBtn    = $("clearBtn");
const analyzeBtn  = $("analyzeBtn");
const sampleBtn   = $("sampleBtn");
const errorBox    = $("error");
const results     = $("results");

const ring        = $("ring");
const scoreValue  = $("scoreValue");
const scoreBand   = $("scoreBand");
const scoreSub    = $("scoreSub");
const skillBar    = $("skillBar");
const matchedCount = $("matchedCount");
const totalCount  = $("totalCount");
const roleLabel   = $("roleLabel");
const presentChips = $("presentChips");
const missingChips = $("missingChips");
const checksList  = $("checks");
const nextStep    = $("nextStep");

let selectedFile = null;

/* ---------- 3. Reading the PDF in the browser ---------- */

// pdf.js needs a worker script; point it at the same CDN version as the <script> tag.
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    throw new Error("pdf.js didn't load. Check your internet connection and reload the page.");
  }

  // Read the file into memory as a byte array, then hand it to pdf.js.
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    // Each item is a text fragment; join with spaces and keep line breaks.
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

/* ---------- 4. Scoring ---------- */

// Turn a skill name/alias into a safe regex that respects word boundaries,
// so "js" doesn't match inside "json" and "C++" still works.
function aliasRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

function findSkill(text, skill) {
  const needles = [skill.name, ...(skill.aliases || [])];
  for (const needle of needles) {
    if (aliasRegex(needle).test(text)) return needle;
  }
  return null;
}

function scoreSkills(text, roleKey) {
  const role = ROLES[roleKey];
  const present = [];
  const missing = [];
  let earned = 0;
  let total = 0;

  for (const skill of role.skills) {
    total += skill.weight;
    const hit = findSkill(text, skill);
    if (hit) {
      earned += skill.weight;
      present.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Missing skills sorted by weight: the heaviest gap is the one to close first.
  missing.sort((a, b) => b.weight - a.weight);

  return {
    role,
    present,
    missing,
    matchedWeight: earned,
    totalWeight: total,
    skillPct: total ? earned / total : 0
  };
}

// Six structural checks that real screeners care about.
function healthChecks(text, raw) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const has = (re) => re.test(text);

  return [
    {
      pass: has(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/),
      label: "Contact email found",
      hint: "Add an email address near the top."
    },
    {
      pass: has(/(\+?\d[\d\s().-]{7,}\d)/),
      label: "Phone number found",
      hint: "Add a phone number recruiters can call."
    },
    {
      pass: has(/\b(linkedin|github|portfolio|https?:\/\/)\b/i),
      label: "Links found (GitHub / LinkedIn / portfolio)",
      hint: "Link a GitHub, LinkedIn or portfolio URL."
    },
    {
      pass: words >= 300,
      label: `Length is substantial (${words} words)`,
      hint: "Under 300 words usually reads as thin. Aim for one full page."
    },
    {
      pass: has(/\b(experience|employment|work history|projects)\b/i),
      label: "Experience or projects section present",
      hint: "Add an Experience or Projects section with headers."
    },
    {
      pass: has(/\b(education|b\.?tech|bachelor|master|degree|university|college)\b/i),
      label: "Education section present",
      hint: "Add an Education section — ATS parsers look for it."
    }
  ];
}

// Blend: skills are what the role is graded on, structure is the tiebreaker.
function computeScore(skillPct, passedChecks, totalChecks) {
  const healthPct = passedChecks / totalChecks;
  return Math.round(skillPct * 80 + healthPct * 20);
}

function bandFor(score) {
  if (score >= 80) return { band: "Strong match", sub: "You clear the keyword screen for this role." };
  if (score >= 60) return { band: "Solid start", sub: "Close — a few gaps are holding the score down." };
  if (score >= 40) return { band: "Needs work", sub: "The role's core skills aren't showing yet." };
  return { band: "Low match", sub: "This resume doesn't read as a fit for this role yet." };
}

/* ---------- 5. Rendering ---------- */

function renderChips(container, items, kind) {
  container.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = kind === "found" ? "No matching skills found." : "Nothing missing — nice.";
    container.appendChild(li);
    return;
  }
  for (const skill of items) {
    const li = document.createElement("li");
    li.className = kind;
    li.textContent = skill.name;
    if (skill.weight === 3) li.textContent += " · core";
    container.appendChild(li);
  }
}

function render(analysis) {
  const { role, present, missing, matchedWeight, totalWeight, skillPct } = analysis;

  const passed = analysis.checks.filter((c) => c.pass).length;
  const score = computeScore(skillPct, passed, analysis.checks.length);
  const { band, sub } = bandFor(score);

  results.hidden = false;

  // Ring: --pct drives the conic-gradient in CSS.
  ring.style.setProperty("--pct", score);
  scoreValue.textContent = score;
  scoreBand.textContent = band;
  scoreSub.textContent = sub;

  skillBar.style.width = `${Math.round(skillPct * 100)}%`;
  matchedCount.textContent = present.length;
  totalCount.textContent = role.skills.length;
  roleLabel.textContent = role.label;

  renderChips(presentChips, present, "found");
  renderChips(missingChips, missing, "gap");

  checksList.innerHTML = "";
  for (const check of analysis.checks) {
    const li = document.createElement("li");
    const tick = document.createElement("span");
    tick.className = `tick ${check.pass ? "pass" : "fail"}`;
    tick.textContent = check.pass ? "✓" : "!";
    const body = document.createElement("span");
    body.innerHTML = check.pass
      ? `<b>${check.label}</b>`
      : `<b>${check.label}</b> — ${check.hint}`;
    li.append(tick, body);
    checksList.appendChild(li);
  }

  // What to do next: worst structural failure, else the heaviest missing skill.
  const worstCheck = analysis.checks.find((c) => !c.pass);
  const heaviestGap = missing.find((s) => s.weight >= 2) || missing[0];

  if (worstCheck) {
    nextStep.textContent = `${worstCheck.hint} After that, ${
      heaviestGap ? `work "${heaviestGap.name}" into your bullets if you've used it.` : "keep the skill list as it is."
    }`;
  } else if (heaviestGap) {
    nextStep.textContent = `Structure is clean. The gap costing you most is "${heaviestGap.name}" — ${
      role.label
    } postings ask for it often. If you've used it, name it in a bullet; if not, that's your next thing to learn.`;
  } else {
    nextStep.textContent = `No gaps left for ${role.label}. Tailor your top three bullets to the specific job post and apply.`;
  }

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- 6. Wiring up the UI ---------- */

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
}

function setFile(file) {
  if (!file) return;
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) {
    showError(`"${file.name}" isn't a PDF. Export your resume as PDF and try again.`);
    return;
  }
  clearError();
  selectedFile = file;
  fileName.textContent = file.name;
  fileRow.hidden = false;
  analyzeBtn.disabled = false;
}

function clearFile() {
  selectedFile = null;
  fileInput.value = "";
  fileRow.hidden = true;
  analyzeBtn.disabled = true;
  results.hidden = true;
}

async function analyze(text) {
  const analysis = { ...scoreSkills(text, roleSelect.value) };
  analysis.checks = healthChecks(text);
  render(analysis);
}

async function runAnalysis() {
  if (!selectedFile) return;
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Reading PDF…";
  clearError();

  try {
    const text = await extractPdfText(selectedFile);
    if (!text.trim()) {
      throw new Error("No text layer found in that PDF. If it's a scan or an image, export a text-based PDF instead.");
    }
    await analyze(text);
  } catch (err) {
    showError(err.message || "Couldn't read that PDF.");
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Get my score";
  }
}

// Click the dropzone → open the file picker.
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", (e) => setFile(e.target.files[0]));
clearBtn.addEventListener("click", clearFile);
analyzeBtn.addEventListener("click", runAnalysis);

// Drag and drop.
["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-over");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-over");
  })
);
dropzone.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

// The sample button skips the PDF step and scores a built-in resume,
// so the page can be demoed without a file on hand.
sampleBtn.addEventListener("click", () => {
  const sample = `Priya Raman
  priya.raman@example.com | +91 98765 43210 | github.com/priyaraman | linkedin.com/in/priyaraman

  SUMMARY
  Frontend engineer with 3 years building responsive, accessible web apps in React and TypeScript.

  EXPERIENCE
  Frontend Engineer, Northwind Labs (2022 - present)
  - Rebuilt the checkout flow in React and TypeScript, cutting load time by 40% (Lighthouse 92).
  - Wrote component tests with Jest and Playwright, raising coverage from 30% to 78%.
  - Built a design system with SCSS and media queries for mobile-first layouts.
  - Consumed REST APIs and handled auth tokens in a shared context store.

  Junior Developer, Bluefin (2021 - 2022)
  - Maintained HTML, CSS and JavaScript pages; migrated jQuery widgets to React.
  - Used Git and GitHub for version control and code review.

  EDUCATION
  B.Tech in Computer Science, Anna University, 2021

  SKILLS
  JavaScript, TypeScript, React, HTML, CSS, Git, Jest, Playwright, REST APIs, Accessibility`;

  roleSelect.value = "frontend";
  clearFile();
  analyze(sample);
});
