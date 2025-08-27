import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    description: String,
    skills: [String],
    location: String,
    salary_min: Number,
    salary_max: Number,
    remote: Boolean
  },
  { timestamps: { createdAt: "postedAt" } }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
