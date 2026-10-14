import assert from "node:assert/strict";

process.env.LABD_API_KEY = "test-labd-key";
const { analyzeWithLabd } = await import("../services/labdService.js");
const originalFetch = globalThis.fetch;

try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://agent.thedevlabs.io/v1/api/chat");
    assert.equal(options.headers.Authorization, "test-labd-key");

    const request = JSON.parse(options.body);
    assert.equal(request.messages[0].role, "user");
    assert.match(request.messages[0].content, /JOB DESCRIPTION:/);
    assert.match(request.messages[0].content, /RESUME:/);

    return new Response(
      JSON.stringify({
        message: {
          content: '```json\n{"skills":[{"name":"React","weight":2,"present":true},{"name":"Node.js","weight":3,"present":false}],"nextStep":"Add relevant Node.js project evidence."}\n```'
        },
        credits: { percentLeft: 99 }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  const resume = `${"Ada ada@example.com +1 555 123 4567 github.com/ada ".repeat(75)}Experience Projects Education`;
  const result = await analyzeWithLabd(resume, "React and Node.js developer");
  assert.equal(result.engine, "labd-ai-v1");
  assert.equal(result.present[0].name, "React");
  assert.equal(result.missing[0].name, "Node.js");
  assert.equal(result.score, 52);
  assert.equal(result.nextStep, "Add relevant Node.js project evidence.");

  globalThis.fetch = async () => new Response("", { status: 429 });
  await assert.rejects(
    analyzeWithLabd("resume", "job"),
    (error) => error.statusCode === 429
  );

  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ message: { content: '{"skills":[{"name":"React","weight":2}]}' } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  await assert.rejects(
    analyzeWithLabd("resume", "job"),
    (error) => error.statusCode === 502
  );
} finally {
  globalThis.fetch = originalFetch;
}

console.log("labd AI integration checks passed.");
