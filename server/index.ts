import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import adminRoutes from "./routes/adminRoutes"
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
app.use(cors({
    origin: "http://localhost:3002",
    credentials: true,
  }));
app.use(cookieParser());
app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);


app.listen(5000, () => {
    console.log("Server is up and running at 5000");
});