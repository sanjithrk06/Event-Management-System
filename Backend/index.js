import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./utils/db.js";
import { authRoutes, eventRoutes, registrationRoutes } from "./route/route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

app.use("/api/auth/", authRoutes);

app.use("/api/event/", eventRoutes);

app.use("/api/registration/", registrationRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is listening on the port : ", PORT);
});
