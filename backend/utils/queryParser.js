import nlp from "compromise";

const IIT_RE = /\bIIT\b/i;
const UG_RE = /\b(B\.?Tech|B\.?E|B\.?Sc|Undergrad(uate)?)\b/i;

export function parseQuery(q = "") {
  const doc = nlp(q);
  const lower = q.toLowerCase();

  const skills = Array.from(
    new Set(
      doc
        .match("#Noun+")
        .out("array")
        .filter((t) => ["java","python","react","node","mongodb","pmp","frontend","backend","devops"].includes(t.toLowerCase()))
    )
  );

  const locationMatch = lower.match(/\bin\s+([a-z\s]+?)(?:\bwith|\bwho|\bthat|\bhaving|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : undefined;

  const expMatch = lower.match(/(\d+)\s*\+?\s*(?:years|yrs)/i);
  const experience_years = expMatch ? Number(expMatch[1]) : undefined;

  const salaryMatch = lower.match(/(?:above|over|more than|>\s?)\s*₹?\s*([0-9]+)\s*(lpa|lakhs?)/i);
  const min_salary_lpa = salaryMatch ? Number(salaryMatch[1]) : undefined;

  const immediate = /\bjoin (immediately|now|asap)\b/i.test(lower);

  const onlyIITUndergrads =
    (IIT_RE.test(q) && UG_RE.test(q) && /\bonly\b/i.test(q)) ||
    /only .*undergrads? from iit/i.test(lower) ||
    /only .*b\.?tech .*iit/i.test(lower);

  return {
    skills,
    location,
    experience_years,
    min_salary_lpa,
    availability: immediate ? "immediate" : undefined,
    onlyIITUndergrads
  };
}
