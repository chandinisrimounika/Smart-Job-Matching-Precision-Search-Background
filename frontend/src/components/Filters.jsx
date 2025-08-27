import { useState } from "react";

export default function Filters({ onChange }) {
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  return (
    <div className="filters">
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          onChange({ location: e.target.value || undefined });
        }}
      />
      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => {
          const val = e.target.value;
          setSkills(val);
          onChange({ skills: val.split(",").map((s) => s.trim()).filter(Boolean) });
        }}
      />
      <input
        type="number"
        placeholder="Min experience (years)"
        value={experience}
        onChange={(e) => {
          const val = e.target.value;
          setExperience(val);
          onChange({ experience_years: val ? Number(val) : undefined });
        }}
      />
    </div>
  );
}