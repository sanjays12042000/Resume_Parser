import * as pdfjsLib from "pdfjs-dist";

// Point pdf.js at its worker. Vite resolves this URL and bundles the worker,
// so no CDN and no server are involved — the PDF is read in the browser.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Read a PDF File and return its text layer as one string.
 * Throws a readable error for encrypted, scanned or unreadable files.
 */
export async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    // Each item is a text fragment; join with spaces, keep page breaks.
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}
