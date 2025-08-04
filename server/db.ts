import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Ensure environment variables are defined
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error(
    "❌ Missing required environment variables for database connection."
  );
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: Number(DB_PORT) || 3306,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error);
  }
})();

export default sequelize;
