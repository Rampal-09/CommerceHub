import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongooDb Connected ");

    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
