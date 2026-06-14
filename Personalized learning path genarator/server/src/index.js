import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDatabase } from "./config/database.js";
import { loadLearningOptions } from "./services/learningPathService.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

app.use((error, _req, res, _next) => {
  const message = error.message || "Something went wrong.";
  const status = message.includes("not found") ? 404 : 400;
  res.status(status).json({ message });
});

async function startServer() {
  try {
    const mongoUri = await connectDatabase();
    
    // Load all courses from database into learningOptions
    await loadLearningOptions();
    
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log(`MongoDB connected: ${mongoUri}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
