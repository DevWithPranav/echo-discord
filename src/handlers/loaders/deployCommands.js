import { REST, Routes } from "discord.js";
import client from "../../bot/botClientOptions.js";
import colors from "colors";
import dotenv from "dotenv";
import loadCommands from "./loadCommands.js";
import logger from "../../logger.js"; // Optional if you want file logging

dotenv.config();

const emoji = {
  refresh: "🔄",
  success: "✅",
  error: "❌",
  system: "🧩",
};

const logSystem = (msg, color = "cyan") =>
  console.log(`${emoji.system} System`.cyan, ">>".blue, msg[color]);

const logError = (msg) =>
  console.error(`${emoji.error} System`.cyan, ">>".blue, msg.red);

// Validate environment variables
if (!process.env.BOT_TOKEN || !process.env.DISCORD_ID) {
  logError("BOT_TOKEN or DISCORD_ID is missing in the .env file");
  process.exit(1);
}

// === Refresh Slash Commands ===
const refreshCommands = async () => {
  try {
    await loadCommands();

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
    const commandCount = client.commands?.size || 0;

    if (commandCount === 0) {
      logSystem("No commands found to register.", "yellow");
      return;
    }

    logSystem(
      `${emoji.refresh} Refreshing ${commandCount} application (/) commands...`,
      "green"
    );

    await rest.put(Routes.applicationCommands(process.env.DISCORD_ID), {
      body: Array.from(client.commands.values()).map((cmd) =>
        cmd.data.toJSON()
      ),
    });

    logSystem(
      `${emoji.success} Successfully reloaded ${commandCount} application (/) commands.`,
      "green"
    );
  } catch (error) {
    logError(`Failed to refresh commands: ${error.message}`);
    console.error(error);
    logger.error("Failed to refresh commands", error); // Optional file logging
  }
};

// Execute
await refreshCommands();
