import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";
import webhook from "./controllers/webhook.js";
import stripe from "./routes/stripe.js";

// config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(cors());
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  webhook
);
app.use(express.json());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/stripe", stripe);

// localhost:4000/api/admin

// API routes
app.get("/", (req, res) => res.send("Hello from backend"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
