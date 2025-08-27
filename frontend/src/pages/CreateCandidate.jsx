import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeUpload from "../components/ResumeUpload";
import { uploadResume, createCandidate } from "../api";

export default function CreateCandidate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    experience_years: 0,
    availability: "",
    // 1-row education array so we can enforce IIT UG precision later
    education: [{ degree: "", program_type: "", institution: "", start_year: "", end_year: "" }]
  });

  const navigate = useNavigate();

  // Resume → auto-fill email/phone/skills
  async function handleParse(file) {
    const data = await uploadResume(file);
    setForm((f) => ({
      ...f,
      email: data.email || f.email,
      phone: data.phone || f.phone,
      skills: Array.from(new Set([...(f.skills || []), ...((data.skills || []).map(String))]))
    }));
  }

  // helper to update the first education object
  function setEdu(partial) {
    setForm((f) => {
      const e0 = { ...(f.education?.[0] || {}), ...partial };
      return { ...f, education: [e0] };
    });
  }

  async function handleSave(e) {
    e.preventDefault();

    const payload = {
      ...form,
      skills: (form.skills || []).map((s) => String(s).trim()).filter(Boolean),
      experience_years: Number(form.experience_years) || 0,
      education: [
        {
          ...form.education[0],
          start_year: form.education[0].start_year ? Number(form.education[0].start_year) : undefined,
          end_year: form.education[0].end_year ? Number(form.education[0].end_year) : undefined
        }
      ]
    };

    await createCandidate(payload);
    // Redirect to search page after saving
    navigate("/");
  }

  return (
    <div className="container narrow">
      <h1>Create Candidate</h1>

      <ResumeUpload onParsed={handleParse} />

      <form className="form" onSubmit={handleSave}>
        <label>Name</label>
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Phone</label>
        <input
          placeholder="+91 99999 99999"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label>Location</label>
        <input
          placeholder="City (e.g., Pune)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <label>Skills (comma separated)</label>
        <input
          placeholder="java, python, react"
          value={(form.skills || []).join(", ")}
          onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map((s) => s.trim()) })}
        />

        <label>Experience (years)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={form.experience_years}
          onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
        />

        <label>Availability</label>
        <input
          placeholder="immediate, 15 days, 30 days"
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value })}
        />

        <fieldset className="fieldset">
          <legend>Education (for IIT precision)</legend>

          <label>Degree</label>
          <input
            placeholder="B.Tech / B.E / B.Sc"
            value={form.education?.[0]?.degree || ""}
            onChange={(e) => setEdu({ degree: e.target.value })}
          />

          <label>Program Type</label>
          <input
            placeholder="full-time / part-time / online"
            value={form.education?.[0]?.program_type || ""}
            onChange={(e) => setEdu({ program_type: e.target.value })}
          />

          <label>Institution</label>
          <input
            placeholder="IIT Bombay"
            value={form.education?.[0]?.institution || ""}
            onChange={(e) => setEdu({ institution: e.target.value })}
          />

          <div className="grid-2">
            <div>
              <label>Start Year</label>
              <input
                type="number"
                placeholder="2019"
                value={form.education?.[0]?.start_year || ""}
                onChange={(e) => setEdu({ start_year: e.target.value })}
              />
            </div>
            <div>
              <label>End Year</label>
              <input
                type="number"
                placeholder="2023"
                value={form.education?.[0]?.end_year || ""}
                onChange={(e) => setEdu({ end_year: e.target.value })}
              />
            </div>
          </div>
        </fieldset>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
