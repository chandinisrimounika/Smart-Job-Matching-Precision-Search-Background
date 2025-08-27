import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ResultCard from "../components/ResultCard";
import useDebounce from "../hooks/useDebounce";
import { nlCandidateSearch, nlJobSearch } from "../api";

export default function Search() {
  const [tab, setTab] = useState("candidates"); // "candidates" | "jobs"
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dq = useDebounce(q, 500);

  // Auto-search when typing (debounced) and when filters/tab change (if there is a query)
  useEffect(() => {
    if (dq?.trim()) doSearch(dq);
  }, [dq, tab, filters]);

  async function doSearch(queryText) {
    try {
      setLoading(true);
      setErr("");
      const fn = tab === "candidates" ? nlCandidateSearch : nlJobSearch;
      const data = await fn(queryText || "", filters);
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Triggered by the Search button
  function handleSearchClick(queryText) {
    setQ(queryText);
    doSearch(queryText); // immediate fetch
  }

  // Optional: when switching tabs, keep the same query but re-run search immediately
  function switchTab(next) {
    setTab(next);
    if (q?.trim()) doSearch(q);
  }

  return (
    <div className="container">
      <header>
        <h1>Smart Job Matching</h1>
        <div className="tabs">
          <button
            className={tab === "candidates" ? "active" : ""}
            onClick={() => switchTab("candidates")}
          >
            Candidates
          </button>
          <button
            className={tab === "jobs" ? "active" : ""}
            onClick={() => switchTab("jobs")}
          >
            Jobs
          </button>
        </div>
      </header>

      <SearchBar
        onSearch={handleSearchClick}
        placeholder={`Search ${tab}... e.g., "python developers in Pune with 3+ years"`}
      />

      <section>
        <Filters onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))} />
      </section>

      {loading && <div className="empty">Searching…</div>}
      {err && <div className="empty">Error: {err}</div>}

      <section className="results">
        {!loading &&
          !err &&
          results.map((r) => (
            <ResultCard
              key={r._id}
              title={tab === "candidates" ? r.name : r.title}
              subtitle={
                tab === "candidates"
                  ? `${r.location || ""} • ${(r.experience_years ?? 0)} yrs`
                  : `${r.company} • ${r.location}`
              }
              bullets={r.skills || []}
              why={r.why || []}
              sem={r._semScore}
              /* show salary when on Jobs tab */
              salaryMin={tab === "jobs" ? r.salary_min : undefined}
              salaryMax={tab === "jobs" ? r.salary_max : undefined}
            />
          ))}

        {!loading && !err && !results.length && (
          <div className="empty">No results yet. Try searching.</div>
        )}
      </section>
    </div>
  );
}
