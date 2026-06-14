import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT not found");
}

const config = {
  PORT: process.env.PORT,
};

export default config;
