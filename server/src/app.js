import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authroutes.js";
import postRoutes from "./routes/postroutes.js";
import likeRoutes from "./routes/likeroutes.js";
import followRoutes from "./routes/followroutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import convRoutes from "./routes/convRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://instagram-clone-k5arck94z-suhaniahirwar96-2458.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/likes",likeRoutes);
app.use("/api/follow",followRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/conversation",convRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
      success: true,
      message: "Instagram clone api is running successfully",
  });
});


export default app;