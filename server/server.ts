import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

sequelize
  .sync({ force: false })
  .then(() => console.log("🗂️  Models synced with database."))
  .catch((err: unknown) => console.error("❌ Failed to sync models:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
