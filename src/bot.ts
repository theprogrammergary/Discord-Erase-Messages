import { Client, GatewayIntentBits, Guild } from "discord.js";
import { config } from "./config";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  console.log("Discord bot is ready! 🤖");
  const guild: Guild = await getGuild(config.GUILD_ID);
  await getGuildMessages(guild);
});

async function getGuildMessages(guild: Guild) {
  console.log(`Ready to get "${guild.name}" messages`);
}

async function getGuild(guildId: string): Promise<Guild> {
  const guild: Guild | undefined = client.guilds.cache.get(guildId);
  if (guild) {
    return guild;
  } else {
    throw new Error(`Guild with ID ${guildId} not found!`);
  }
}

client.login(config.BOT_TOKEN);
