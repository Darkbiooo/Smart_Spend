import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env.local" });
/** @type { import('drizzle-kit').Config } */
const config = {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
};

export default config;