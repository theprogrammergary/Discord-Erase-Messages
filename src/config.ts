import dotenv from "dotenv";

dotenv.config();

const { BOT_TOKEN, GUILD_ID, MEMBER_ID_1, MEMBER_ID_2 } = process.env;
if (!BOT_TOKEN || !GUILD_ID) {
  throw new Error("Missing environment variables");
}

interface MemberIDs {
  id1: string;
  id2: string;
}
const memberIds: MemberIDs = {
  id1: process.env.MEMBER_ID_1 || "",
  id2: process.env.MEMBER_ID_2 || "",
};

export const config = {
  BOT_TOKEN,
  GUILD_ID,
  memberIds,
};
