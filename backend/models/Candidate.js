import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,           // e.g., B.Tech, B.E, B.Sc, M.Tech, MBA
  program_type: String,     // full-time, part-time, online
  institution: String,      // e.g., IIT Bombay
  start_year: Number,
  end_year: Number
});

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    location: String,
    skills: [{ type: String, trim: true }],
    experience_years: Number,
    availability: String, // e.g., immediate, 30 days
    education: [educationSchema],
    certifications: [String],
    resume_text: String
  },
  { timestamps: true }
);

// Full-text only on free-text fields
candidateSchema.index({ resume_text: "text", name: "text" });

// Structured filter indexes (NOT text)
candidateSchema.index({ skills: 1 });
candidateSchema.index({ location: 1 });

// Email uniqueness (Mongoose will create this; keeping explicit helps in some setups)
candidateSchema.index({ email: 1 }, { unique: true });

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
