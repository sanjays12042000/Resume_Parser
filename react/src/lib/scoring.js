import { ROLES } from "../data/roles.js";

/* ---------- keyword matching ---------- */

// Turn a skill name/alias into a safe regex that respects word boundaries.
// The characters before and after the alias must not be letters or digits, so
// "js" doesn't match inside "json", while "react" still matches "React.js".
// Escaping the alias is what keeps metacharacters like "C++" working.
export function aliasRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

export function findSkill(text, skill) {
  const needles = [skill.name, ...(skill.aliases || [])];
  for (const needle of needles) {
    if (aliasRegex(needle).test(text)) return needle;
  }
  return null;
}

/* ---------- scoring ---------- */

export function scoreSkills(text, roleKey) {
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

  // Heaviest gap first: the skill costing the most points is the one to fix.
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
export function healthChecks(text) {
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
export function computeScore(skillPct, passedChecks, totalChecks) {
  return Math.round(skillPct * 80 + (passedChecks / totalChecks) * 20);
}

export function bandFor(score) {
  if (score >= 80) return { band: "Strong match", sub: "You clear the keyword screen for this role." };
  if (score >= 60) return { band: "Solid start", sub: "Close — a few gaps are holding the score down." };
  if (score >= 40) return { band: "Needs work", sub: "The role's core skills aren't showing yet." };
  return { band: "Low match", sub: "This resume doesn't read as a fit for this role yet." };
}

// One call that takes raw resume text and returns everything the UI renders.
export function analyzeResume(text, roleKey) {
  const analysis = scoreSkills(text, roleKey);
  const checks = healthChecks(text);
  const passed = checks.filter((c) => c.pass).length;
  const score = computeScore(analysis.skillPct, passed, checks.length);

  return { ...analysis, checks, passed, score, ...bandFor(score) };
}

// The "fix this first" line: worst structural failure, else heaviest missing skill.
export function nextStepFor(analysis) {
  const { checks, missing, role } = analysis;
  const worstCheck = checks.find((c) => !c.pass);
  const heaviestGap = missing.find((s) => s.weight >= 2) || missing[0];

  if (worstCheck) {
    return `${worstCheck.hint} After that, ${
      heaviestGap
        ? `work "${heaviestGap.name}" into your bullets if you've used it.`
        : "keep the skill list as it is."
    }`;
  }
  if (heaviestGap) {
    return `Structure is clean. The gap costing you most is "${heaviestGap.name}" — ${role.label} postings ask for it often. If you've used it, name it in a bullet; if not, that's your next thing to learn.`;
  }
  return `No gaps left for ${role.label}. Tailor your top three bullets to the specific job post and apply.`;
}
