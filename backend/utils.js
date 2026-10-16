import { createRequire } from "node:module";
import { dirname, join, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

export function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Load pdf.js, and work out where its standard fonts live.
 *
 * Resolution goes through createRequire rather than import.meta.resolve,
 * because pdfjs-dist ships no "exports" map: resolving the bare specifier
 * "pdfjs-dist/legacy/build/pdf.mjs" can fail outright on some Node versions,
 * including the runtime a serverless host picks.
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
      const fontsDir = join(dirname(entry), "..", "..", "standard_fonts");
      const standardFontDataUrl = hasFontsDir(fontsDir) ? fontsDir + sep : undefined;

      return { pdfjs, standardFontDataUrl };
    })();
  }
  return pdfjsPromise;
}

/**
 * Point pdf.js at the fonts only if they are really there.
 *
 * On a host that bundles the code but not the package's data files, the
 * directory is missing. Passing a path that does not exist makes pdf.js try to
 * read file names under it and log "Unable to load font data" for each one -
 * noise that also hides whether the directory was the problem. Passing
 * undefined instead lets pdf.js fall back to its built-in fonts.
 */
function hasFontsDir(dir) {
  try {
    const present = existsSync(dir);
    if (!present) {
      console.warn(`[api] standard fonts not found at ${dir}; using built-in fonts`);
    }
    return present;
  } catch (error) {
    console.warn("[api] could not check the fonts directory:", error?.message);
    return false;
  }
}

export async function extractPdfText(buffer) {
  let pdfjs;
  let standardFontDataUrl;

  try {
    ({ pdfjs, standardFontDataUrl } = await loadPdfjs());
  } catch (error) {
    // Not the resume's fault, so do not blame the resume. The cause is
    // attached so the API can report it rather than hiding it.
    console.error("[api] could not load pdf.js:", error);
    const wrapped = httpError("The PDF reader failed to start on the server.", 500);
    wrapped.cause = error;
    throw wrapped;
  }

  let pdf;

  try {
    const options = { data: new Uint8Array(buffer) };
    if (standardFontDataUrl) options.standardFontDataUrl = standardFontDataUrl;

    pdf = await pdfjs.getDocument(options).promise;
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
