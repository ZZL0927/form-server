import * as env from "dotenv";
env.config();

export default {
  port: Number(process.env.PORT) || 3000,
  secret: process.env.SECRET || "form",
  dbUrl:process.env.DB_URL || "mongodb://127.0.0.1:27017",
  dbDatabase:process.env.DB_DATABASE || "form"
};
