import { createRequire } from "node:module";
import { dirname, join, sep } from "node:path";
import { pathToFileURL } from "node:url";

export function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Load pdf.js, and work out where its standard fonts live.
 *
 * Two things make this fiddly on a serverless host, and both are reasons a
 * deployed build can fail where a local run succeeds:
 *  - pdfjs-dist ships no "exports" map, so resolving the bare specifier
 *    "pdfjs-dist/legacy/build/pdf.mjs" can fail on some Node versions.
 *    createRequire uses classic Node resolution, which does not care.
 *  - the fonts are read off disk while parsing, so this has to be a real
 *    filesystem path, not a file:// URL.
 */
let pdfjsPromise;

function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const require = createRequire(import.meta.url);
      const entry = require.resolve("pdfjs-dist/legacy/build/pdf.mjs");
      const pdfjs = await import(pathToFileURL(entry).href);

      // entry is .../pdfjs-dist/legacy/build/pdf.mjs, so two levels up is the
      // package root. The trailing separator matters: pdf.js treats this as a
      // prefix it appends font file names to.
      const standardFontDataUrl = join(dirname(entry), "..", "..", "standard_fonts") + sep;

      return { pdfjs, standardFontDataUrl };
    })();
  }
  return pdfjsPromise;
}

export async function extractPdfText(buffer) {
  let pdfjs;
  let standardFontDataUrl;

  try {
    ({ pdfjs, standardFontDataUrl } = await loadPdfjs());
  } catch (error) {
    // Not the resume's fault, so do not blame the resume.
    console.error("[api] could not load pdf.js:", error);
    throw httpError("The PDF reader failed to start on the server.", 500);
  }

  let pdf;

  try {
    pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      standardFontDataUrl,
      // No worker process: parsing is fast, and serverless hosts often do not
      // allow spawning one.
      disableWorker: true
    }).promise;
  } catch (error) {
    // The underlying error is logged rather than swallowed - the generic
    // message alone is what made this failure hard to diagnose.
    console.error("[api] PDF open failed:", error?.name, error?.message);

    if (error?.name === "PasswordException") {
      throw httpError("That PDF is password-protected. Remove the password and upload it again.", 422);
    }
    if (error?.name === "InvalidPDFException") {
      throw httpError("That file isn't a readable PDF. Re-export it and upload it again.", 422);
    }
    throw httpError("The uploaded PDF could not be read.", 422);
  }

  try {
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }

    return pages.join("\n");
  } catch (error) {
    console.error("[api] PDF text extraction failed:", error?.name, error?.message);
    throw httpError(
      "The resume's text layer could not be read. If it's a scan or an image, export a text-based PDF.",
      422
    );
  } finally {
    if (pdf) await pdf.destroy().catch(() => {});
  }
}
