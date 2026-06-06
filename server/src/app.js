import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import portfolioRoutes from "./routes/portfolio.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security headers
app.use(helmet());

// CORS — allow Vite dev server
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Rate limiting: 100 req / 15 min per IP
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many requests, please slow down." },
}));

// Routes
app.use("/api/portfolio", portfolioRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", ts: new Date().toISOString() } });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
