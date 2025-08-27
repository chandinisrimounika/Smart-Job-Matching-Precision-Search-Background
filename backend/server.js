import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import candidateRoutes from "./routes/candidateRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// mongo
mongoose
  .connect(process.env.MONGO_URI, { dbName: "recruitment" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// routes
app.use("/api/candidates", candidateRoutes);
app.use("/api/jobs", jobRoutes);

// root
app.get("/", (_req, res) => res.send("API is running..."));

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
