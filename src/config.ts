import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN, GUILD_ID } = process.env;
if (!BOT_TOKEN || !GUILD_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  BOT_TOKEN,
  GUILD_ID,
};
