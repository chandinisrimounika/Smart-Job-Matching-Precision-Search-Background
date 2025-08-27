import express from "express";
import multer from "multer";
import Candidate from "../models/Candidate.js";
import { fileBufferToText, extractFieldsFromText } from "../utils/resumeParser.js";
import { scoreByTfidf } from "../utils/semantic.js";
import { parseQuery } from "../utils/queryParser.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create
router.post("/", async (req, res, next) => {
  try {
    const cand = await Candidate.create(req.body);
    res.status(201).json(cand);
  } catch (e) {
    next(e);
  }
});

// Read all
router.get("/", async (_req, res, next) => {
  try {
    const all = await Candidate.find().lean();
    res.json(all);
  } catch (e) {
    next(e);
  }
});

// Upload resume → auto-fill
router.post("/upload", upload.single("resume"), async (req, res, next) => {
  try {
    const text = await fileBufferToText(req.file);
    const fields = extractFieldsFromText(text);
    res.json(fields);
  } catch (e) {
    next(e);
  }
});

/**
 * Hybrid search
 * Body:
 * {
 *   query?: string,                  // NL free text
 *   filters?: { skills, location, experience_years, availability, onlyIITUndergrads }
 * }
 */
router.post("/search", async (req, res, next) => {
  try {
    const { query = "", filters = {} } = req.body || {};
    const parsed = parseQuery(query);
    const f = { ...parsed, ...filters };

    // Build strict Mongo filter (no false positives)
    const mongoFilter = {};
    if (f.location) mongoFilter.location = new RegExp(`^${escapeRegex(f.location)}$`, "i");
    if (f.skills?.length) mongoFilter.skills = { $all: f.skills.map((s) => new RegExp(`^${escapeRegex(s)}$`, "i")) };
    if (typeof f.experience_years === "number") mongoFilter.experience_years = { $gte: f.experience_years };
    if (f.availability) mongoFilter.availability = /immediate/i;

    // Special precision rule: only undergraduates from IIT
    if (f.onlyIITUndergrads) {
      mongoFilter.education = {
        $elemMatch: {
          institution: /IIT/i,
          program_type: /full[-\s]?time/i,
          degree: /(B\.?Tech|B\.?E|B\.?Sc|Undergrad(uate)?)/i
        }
      };
    }

    // Pull a candidate set with strict filters first
    const candidates = await Candidate.find(mongoFilter).lean();

    // If there’s a query, rank by semantic relevance using TF-IDF of skills+resume
    let ranked = candidates;
    if (query?.trim()) {
      const rankedScores = scoreByTfidf(
        query,
        candidates,
        (c) => `${c.name ?? ""} ${c.skills?.join(" ") ?? ""} ${c.resume_text ?? ""}`
      );
      ranked = rankedScores.map((r) => ({ ...r.doc, _semScore: r.score }));
    }

    res.json(ranked);
  } catch (e) {
    next(e);
  }
});

function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;
