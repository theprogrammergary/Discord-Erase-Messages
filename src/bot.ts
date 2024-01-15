import {
  Client,
  GatewayIntentBits,
  Guild,
  Message,
  TextChannel,
  ChannelType,
  Collection,
} from "discord.js";

import readline from "readline";
import chalk from "chalk";
import { config } from "./config";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  console.log(
    chalk.bgYellowBright.bold(
      "\n\n\nDiscord bot is ready for message removal! 🤖"
    )
  );

  await runRemoval();
  process.exit();
});

async function runRemoval() {
  while (true) {
    const input = await getUserInput();
    if (
      input === undefined ||
      input.guildId.trim() === "" ||
      input.authorId.trim() === ""
    ) {
      console.log("❌ Invalid input...exiting");
      return;
    }

    const messages = await fetchDiscordMessages(
      input.guildId,
      input.authorId,
      input.content
    );

    if (messages.length === 0) {
      console.log("❌ No messages found.");
      break;
    } else {
      messages.forEach((message, index) => {
        console.log(
          chalk.underline.bold(
            `\n\nMessage ${index} - ${new Date(
              message.timestamp
            ).toLocaleString()}`
          )
        );

        console.log(
          chalk.italic(`${message.author.username}: ${message.content}`)
        );
      });

      const inputRemoveMessages = await askQuestion(
        "\n\n🚨 DO YOU WANT TO REMOVE THESE MESSAGES? (yes/no): "
      );
      if (inputRemoveMessages.toLowerCase() === "yes") {
        messages.forEach((message, index) => {
          console.log(`\n\nRemoving Message ${index}`);
          console.log(`${message.content}`);
          removeMessage(message.channel.id, message.id);
        });
      }
    }

    const inputContinue = await askQuestion(
      "🔁 DO YOU WANT TO RUN AGAIN? (yes/no): "
    );
    if (inputContinue.toLowerCase() !== "yes") {
      break;
    }
  }
}

async function removeMessage(channelId: string, messageId: string) {
  try {
    const channel = (await client.channels.fetch(channelId)) as TextChannel;
    const message = await channel.messages.fetch(messageId);

    await message.delete();
  } catch (error) {
    console.error(error);
  }
}

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.yellowBright.italic(query), (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getUserInput(): Promise<{
  guildId: string;
  authorId: string;
  content: string;
}> {
  try {
    const guildId = await askQuestion("1️⃣ . Enter Guild (Server) ID: ");
    const authorId = await askQuestion("2️⃣ . Enter Author (User) ID: ");
    const content = await askQuestion("3️⃣ . Enter Search Terms/Phrase: ");

    return { guildId, authorId, content };
  } catch (error) {
    console.error("Error getting user input:", error);
    return { guildId: "", authorId: "", content: "" };
  }
}

async function fetchDiscordMessages(
  guildId: string,
  authorId: string,
  content: string
): Promise<Message[]> {
  const url = `https://discord.com/api/v9/guilds/${guildId}/messages/search?author_id=${authorId}&content=${content}`;
  const headers = {
    Authorization: `Bot ${config.BOT_TOKEN}`,
  };

  console.log(
    chalk.yellowBright.italic("\nSearching for:", guildId, authorId, content)
  );
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data.messages.flat();
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

async function getGuildMessages(guild: Guild): Promise<Message[]> {
  let messages: Message[] = [];

  return messages;
  console.log(`✅ Ready to get "${guild.name}" messages for`);
  Object.values(config.memberIds).forEach((id) => {
    console.log(`   User ID: ${id}`);
  });

  console.log(`\nℹ️  Getting Messages:`);
  for (const [_, channel] of guild.channels.cache) {
    if (channel.type === ChannelType.GuildText) {
      const textChannel = channel as TextChannel;
      let channelMessages: Message[] = [];
      let lastMessageId: string | undefined = undefined;

      while (true) {
        console.log(
          `   "${channel.name}" ${channelMessages.length} messages fetched...`
        );

        const options = { limit: 100, before: lastMessageId };
        const allMessages: Collection<string, Message> =
          await textChannel.messages.fetch(options);

        if (allMessages.size === 0) {
          console.log(`   "${textChannel.name}":  ${channelMessages.length}`);
          break;
        }

        allMessages.forEach((message: Message) => {
          if (Object.values(config.memberIds).includes(message.author.id)) {
            messages.push(message);
          }

          channelMessages.push(message);
        });

        lastMessageId = allMessages.lastKey();
      }
    }
  }

  console.log("   - Finished getting messages");
  return messages;
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
