import express from "express";
import Job from "../models/Job.js";
import { scoreByTfidf } from "../utils/semantic.js";
import { parseQuery } from "../utils/queryParser.js";

const router = express.Router();

/* ------------------------ Helpers ------------------------ */
function escapeRegex(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function enrichJobsWithWhy(list, filters = {}) {
  // Build effective filter values (supports either LPA or INR in filters)
  const eff = { ...filters };
  const minInr =
    typeof eff.salary_min_inr === "number"
      ? eff.salary_min_inr
      : typeof eff.min_salary_lpa === "number"
      ? Math.round(eff.min_salary_lpa * 100000)
      : undefined;

  return list.map((j) => {
    const why = [];

    // skills hits
    if (Array.isArray(eff.skills) && eff.skills.length) {
      const hits = (j.skills || []).filter((s) =>
        eff.skills.some((q) => new RegExp(`^${escapeRegex(q)}$`, "i").test(s))
      );
      if (hits.length) why.push(`skills: ${hits.join(", ")}`);
    }

    // location
    if (
      eff.location &&
      new RegExp(`^${escapeRegex(eff.location)}$`, "i").test(j.location || "")
    ) {
      why.push(`location: ${j.location}`);
    }

    // remote
    if (eff.remote && (j.remote || /remote/i.test(j.location || ""))) {
      why.push("remote");
    }

    // salary floor
    if (typeof minInr === "number" && (j.salary_min || 0) >= minInr) {
      why.push(`salary ≥ ${Math.round(minInr / 100000)} LPA`);
    }

    return { ...j, why };
  });
}

/* ------------------------ Routes ------------------------ */

// Create job
router.post("/", async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (e) {
    next(e);
  }
});

// List jobs
router.get("/", async (_req, res, next) => {
  try {
    const jobs = await Job.find().lean();
    res.json(jobs);
  } catch (e) {
    next(e);
  }
});

// Hybrid search for jobs (NL + strict filters + semantic ranking + why)
router.post("/search", async (req, res, next) => {
  try {
    const { query = "", filters = {} } = req.body || {};

    // 1) Parse NL → structured, then merge explicit filters (explicit wins)
    const parsed = parseQuery(query) || {};
    const f = { ...parsed, ...filters };

    // Normalize salary constraint (allow either min_salary_lpa or salary_min_inr)
    const minSalaryInr =
      typeof f.salary_min_inr === "number"
        ? f.salary_min_inr
        : typeof f.min_salary_lpa === "number"
        ? Math.round(f.min_salary_lpa * 100000)
        : undefined;

    // 2) Build strict Mongo filter
    const mongo = {};

    if (f.location) {
      mongo.location = new RegExp(`^${escapeRegex(f.location)}$`, "i");
    }

    if (Array.isArray(f.skills) && f.skills.length) {
      mongo.skills = {
        $all: f.skills.map((s) => new RegExp(`^${escapeRegex(s)}$`, "i")),
      };
    }

    if (typeof minSalaryInr === "number") {
      mongo.salary_min = { $gte: minSalaryInr };
    }

    // remote flag: either explicit boolean or inferred location "Remote"
    if (f.remote === true) {
      // Either job.remote is true or location explicitly says Remote
      // We'll do this as a post filter after fetch for simplicity & to respect "Remote" location strings.
    }

    // 3) Fetch candidates that pass hard filters
    let jobs = await Job.find(mongo).lean();

    // Apply remote post-filter if requested
    if (f.remote === true) {
      jobs = jobs.filter((j) => j.remote || /remote/i.test(j.location || ""));
    }

    // 4) Rank by semantic score if free-text query present
    let ranked = jobs;
    if (query?.trim()) {
      const rankedScores = scoreByTfidf(
        query,
        jobs,
        (j) => `${j.title} ${j.company} ${j.description} ${(j.skills || []).join(" ")}`
      );
      ranked = rankedScores.map((r) => ({ ...r.doc, _semScore: r.score }));
    }

    // 5) Add "why matched" badges
    const enriched = enrichJobsWithWhy(ranked, f);

    // 6) Limit & return
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    res.json(enriched.slice(0, limit));
  } catch (e) {
    next(e);
  }
});

export default router;
