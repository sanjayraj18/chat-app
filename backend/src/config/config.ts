import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT not found");
}

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL not found");
}

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
