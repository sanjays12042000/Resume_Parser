// scratch: verify the matcher in app.js counts aliases correctly
const aliasRegex = (a) =>
  new RegExp("(^|[^a-z0-9])" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)", "i");

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

let bad = 0;
for (const [alias, text, expected] of cases) {
  const got = aliasRegex(alias).test(text);
  if (got !== expected) bad++;
  console.log((got === expected ? "ok   " : "WRONG") + "  " + alias.padEnd(9) + " in  " + text);
}
console.log(bad === 0 ? "\nALL PASS" : "\n" + bad + " FAILED");
