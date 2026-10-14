import { fileURLToPath } from "node:url";

export function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function extractPdfText(buffer) {
  let pdf;

  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      standardFontDataUrl: fileURLToPath(
        new URL(
          "../../standard_fonts/",
          import.meta.resolve("pdfjs-dist/legacy/build/pdf.mjs")
        )
      )
    }).promise;

    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }

    return pages.join("\n");
  } catch (error) {
    console.error("[api] PDF extraction failed:", error);
    throw httpError("The uploaded PDF could not be read.", 422);
  } finally {
    if (pdf) {
      await pdf.destroy();
    }
  }
}
