import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Type a natural language query..." }) {
  const [q, setQ] = useState("");

  function onKeyDown(e) {
    if (e.key === "Enter") onSearch(q);
  }

  return (
    <div className="searchbar">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      <button onClick={() => onSearch(q)}>Search</button>
    </div>
  );
}
