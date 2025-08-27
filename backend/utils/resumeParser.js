import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function fileBufferToText(file) {
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text || "";
  }
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    return value || "";
  }
  return "";
}

export function extractFieldsFromText(text) {
  const email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0];
  const phone = (text.match(/(\+?\d[\d -]{8,}\d)/) || [])[0];
  const skills = Array.from(
    new Set(
      (text.match(/\b(Java|Python|React|Node\.?js?|MongoDB|SQL|AWS|Docker|Kubernetes|PMP)\b/gi) || [])
        .map((s) => s.toLowerCase())
    )
  );
  return { email, phone, skills, resume_text: text };
}
