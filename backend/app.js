import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import checkoutRouter from "./routes/checkoutRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/cart", cartRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/address", addressRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/users", userRouter);
app.use("/api/v1/admin", adminRouter);

// Global Error Handler
app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongooDb Connected ");

    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
