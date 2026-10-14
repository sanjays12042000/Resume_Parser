import assert from "node:assert/strict";

import { analyzeResume } from "../src/lib/scoring.js";
import { extractPdfText } from "../utils.js";

const pdfText = "Frontend engineer with React and JavaScript experience.";
const content = `BT /F1 12 Tf 72 720 Td (${pdfText}) Tj ET`;
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`
];

let pdfData = "%PDF-1.4\n";
const objectOffsets = [0];
for (let index = 0; index < objects.length; index += 1) {
  objectOffsets.push(Buffer.byteLength(pdfData));
  pdfData += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdfData);
pdfData += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of objectOffsets.slice(1)) {
  pdfData += `${String(offset).padStart(10, "0")} 00000 n \n`;
}
pdfData += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

const extractedText = await extractPdfText(Buffer.from(pdfData));
assert.match(extractedText, /Frontend engineer with React and JavaScript experience/);

const analysis = analyzeResume(extractedText, "Frontend role requiring React and JavaScript.");
assert.ok(analysis.score > 0);
assert.ok(analysis.present.some((skill) => skill.name === "React"));
assert.ok(analysis.present.some((skill) => skill.name === "JavaScript"));

console.log("PDF extraction and scoring checks passed.");
