/* Run with: node scripts/check-scoring.mjs  (from Resume_Parser/react)
   Exercises the real scoring module — no test framework needed. */
import { aliasRegex, analyzeResume, nextStepFor } from "../src/lib/scoring.js";
import { SAMPLE_RESUME } from "../src/data/sampleResume.js";

let failures = 0;
const check = (label, got, expected) => {
  const ok = got === expected;
  if (!ok) failures++;
  console.log(`${ok ? "ok   " : "WRONG"}  ${label}  (got ${got}, want ${expected})`);
};

console.log("--- alias boundaries ---");
const cases = [
  ["js", "work in JS and React", true],
  ["js", "parsed json data", false],
  ["postgres", "used Postgres 14", true],
  ["react", "built with React.js", true],
  ["node", "Node.js services", true],
  ["a11y", "shipped a11y fixes", true],
  ["c++", "wrote C++ code", true],
  ["java", "javascript developer", false]
];
for (const [alias, text, expected] of cases) {
  check(`"${alias}" in "${text}"`, aliasRegex(alias).test(text), expected);
}

console.log("\n--- sample resume, frontend role ---");
const a = analyzeResume(SAMPLE_RESUME, "frontend");
console.log("score       :", a.score);
console.log("band        :", a.band);
console.log("present     :", a.present.map((s) => s.name).join(", "));
console.log("missing     :", a.missing.map((s) => s.name).join(", ") || "(none)");
console.log("checks pass :", `${a.passed}/${a.checks.length}`);
console.log("next step   :", nextStepFor(a));

check("score is within 0-100", a.score >= 0 && a.score <= 100, true);
check("present + missing = total skills", a.present.length + a.missing.length, a.role.skills.length);
check("a sample resume scores above 60", a.score > 60, true);

console.log("\n--- empty text edge case ---");
const empty = analyzeResume("", "frontend");
check("empty text scores 0", empty.score, 0);
check("empty text finds no skills", empty.present.length, 0);

console.log(failures === 0 ? "\nALL PASS" : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
