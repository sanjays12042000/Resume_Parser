/* Skill dictionary used when a job description names no skills at all.
   weight is the importance shown in the UI; there is no role picker any more - 
   the skills come from the job description itself. */

/* Skill matching primitives, shared by the job-description extractor and the
   scorer, so both match with identical rules. */

// Turn a skill name/alias into a safe regex that respects word boundaries.
// The characters before and after the alias must not be letters or digits, so
// "js" doesn't match inside "json", while "react" still matches "React.js".
// Escaping the alias is what keeps metacharacters like "C++" working.
export function aliasRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
}

/** Which spelling of a skill the text used, or null if it shows none. */
export function findSkill(text, skill) {
  const needles = [skill.name, ...(skill.aliases || [])];
  for (const needle of needles) {
    if (aliasRegex(needle).test(text)) return needle;
  }
  return null;
}

/* Words that would otherwise be mistaken for skills. Kept as documentation of
   what the extractor must not match; the catalogue in jobSkills.js is the
   allow-list, so this list is not consulted at runtime. */
export const STOP_WORDS = new Set(
  `the and for with you your our their they this that from have has had are was were will would
   can could should must not but all any each more most other some such only own same than too very
   just into over under again further then once here there when where why how what which who whom
   been being does did doing about above after before between during through because while
   including include includes required requires require preferred plus nice must-have
   job role position candidate candidates applicant applicants company team teams work working
   experience experienced years year skills skill knowledge strong good excellent familiarity
   ability able understanding solid proven plus etc ability responsibilities responsibility
   looking seeking join apply application full time part remote onsite hybrid senior junior
   mid level engineer engineering developer development build building develop design designs
   using use used across within well like also new help ensure ensuring provide providing
   environment environments opportunity benefits salary location degree bachelor master
   communication written verbal collaboration collaborative culture growth learn learning
   plus other`
    .split(/\s+/)
    .filter(Boolean)
);

/* Fallback list: the skills that show up most often in real postings, so an
   empty or vague JD still produces something useful. weight is low because
   these are guesses, not requirements the posting actually stated. */
export const DEFAULT_SKILLS = [
  { name: "JavaScript", weight: 2, aliases: ["js", "es6", "ecmascript"] },
  { name: "TypeScript", weight: 2, aliases: ["ts"] },
  { name: "React", weight: 2, aliases: ["react.js", "reactjs", "next.js", "nextjs"] },
  { name: "Node.js", weight: 2, aliases: ["node", "express", "nestjs"] },
  { name: "REST APIs", weight: 2, aliases: ["rest api", "restful", "graphql"] },
  { name: "SQL", weight: 2, aliases: ["postgres", "postgresql", "mysql", "sqlite"] },
  { name: "MongoDB", weight: 1, aliases: ["mongo", "nosql", "mongoose"] },
  { name: "Git", weight: 1, aliases: ["github", "gitlab", "version control"] },
  { name: "Docker", weight: 1, aliases: ["container", "dockerfile"] },
  { name: "Testing", weight: 1, aliases: ["jest", "vitest", "cypress", "playwright", "unit test"] },
  { name: "Cloud", weight: 1, aliases: ["aws", "gcp", "azure"] },
  { name: "Authentication", weight: 1, aliases: ["jwt", "oauth", "auth", "session"] }
];
