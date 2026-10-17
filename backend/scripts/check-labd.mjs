import assert from "node:assert/strict";

process.env.GEMINI_API_KEY = "test-gemini-key";
const { analyzeWithGemini } = await import("../services/geminiService.js");
const originalFetch = globalThis.fetch;

try {
  globalThis.fetch = async (url, options) => {
    assert.match(url, /https:\/\/generativelanguage.googleapis.com\/v1beta\/models\/gemini-1\.5-flash:generateContent/);
    assert.match(url, /key=test-gemini-key/);
    const request = JSON.parse(options.body);
    assert.equal(request.contents[0].parts[0].text.includes("JOB DESCRIPTION:"), true);
    assert.equal(request.contents[0].parts[0].text.includes("RESUME:"), true);

    return new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                { text: '{"skills":[{"name":"React","weight":2,"present":true},{"name":"Node.js","weight":3,"present":false}],"nextStep":"Add relevant Node.js project evidence."}' }
              ]
            }
          }
        ]
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  const resume = `${"Ada ada@example.com +1 555 123 4567 github.com/ada ".repeat(75)}Experience Projects Education`;
  const result = await analyzeWithGemini(resume, "React and Node.js developer");
  assert.equal(result.engine, "gemini-ai-v1");
  assert.equal(result.present[0].name, "React");
  assert.equal(result.missing[0].name, "Node.js");
  assert.equal(result.score, 52);
  assert.equal(result.nextStep, "Add relevant Node.js project evidence.");

  globalThis.fetch = async () => new Response("", { status: 429 });
  await assert.rejects(
    analyzeWithGemini("resume", "job"),
    (error) => error.statusCode === 429
  );

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"skills":[{"name":"React","weight":2}]}' }] } }] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  await assert.rejects(
    analyzeWithGemini("resume", "job"),
    (error) => error.statusCode === 502
  );
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Gemini AI integration checks passed.");
