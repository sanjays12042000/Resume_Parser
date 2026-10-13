// scratch: fetch the skills.sh page read-only so we can see what it is
const url = "https://www.skills.sh/anthropics/skills/frontend-design";
const res = await fetch(url, { redirect: "follow" });
console.log("status:", res.status, res.statusText);
console.log("content-type:", res.headers.get("content-type"));
console.log("final url:", res.url);
const body = await res.text();
console.log("bytes:", body.length);
console.log("----- first 3000 chars -----");
console.log(body.slice(0, 3000));
