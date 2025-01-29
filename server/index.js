import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config({});
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true,
  })
);
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Hello , I am coming from backend",
  });
});

app.listen(PORT, () => console.log(`Server listen at port ${PORT}`));
