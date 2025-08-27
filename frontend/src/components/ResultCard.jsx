import Badge from "./Badge";

export default function ResultCard({
  title,
  subtitle,
  bullets = [],
  why = [],
  sem,
  salaryMin,
  salaryMax
}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {subtitle && <div className="card-sub">{subtitle}</div>}

      {/* Salary (jobs) */}
      {typeof salaryMin === "number" && typeof salaryMax === "number" && (
        <div className="card-sub">
          ₹{(salaryMin / 100000).toFixed(0)}–₹{(salaryMax / 100000).toFixed(0)} LPA
        </div>
      )}

      {/* Why matched badges */}
      {!!why.length && (
        <div className="why" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          {why.map((w, i) => (
            <Badge key={i}>{w}</Badge>
          ))}
        </div>
      )}

      {/* Skill bullets */}
      {!!bullets.length && (
        <ul className="bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {typeof sem === "number" && <div className="sem">_semScore: {sem.toFixed(3)}</div>}
    </div>
  );
}
