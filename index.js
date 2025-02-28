import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import CORS from "cors";
import UserRoutes from "./user/route.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(CORS());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("🟢🟢MongoDB connection successful");
    app.listen(PORT, () => console.log(`🟢🟢Server started on port ${PORT}`));
  })
  .catch((err) => {
    console.error("🔴🔴MongoDB connection error:", err.message);
  });

app.use("/api/user", UserRoutes);
