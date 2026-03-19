/**
 * This is the main entry point of the backend.
 * It:
 * - Starts Express server
 * - Loads routes
 * - Enables JSON + CORS
 */


import authRoutes from "./routes/auth.routes";
import patientRoutes from "./routes/patients.routes";
import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";

const app = express();


app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
// 404 — no route matched
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

app.use(errorHandler);
app.listen(4000, () => console.log("Server running on port 4000"));
