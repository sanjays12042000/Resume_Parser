// scratch: find the install command on the skills.sh page, and locate the source repo
const url = "https://www.skills.sh/anthropics/skills/frontend-design";
const res = await fetch(url, { redirect: "follow" });
const body = await res.text();

const patterns = [/npx[^<>"']{0,120}/g, /skills add[^<>"']{0,120}/g, /git clone[^<>"']{0,120}/g];
for (const p of patterns) {
  const hits = [...new Set(body.match(p) || [])].slice(0, 6);
  console.log("--- " + p + " ---");
  console.log(hits.length ? hits.join("\n") : "(no hits)");
  console.log("");
}

console.log("--- github refs ---");
const gh = [...new Set(body.match(/https:\/\/github\.com\/[^"'<> ]+/g) || [])].slice(0, 10);
console.log(gh.length ? gh.join("\n") : "(no github links)");
