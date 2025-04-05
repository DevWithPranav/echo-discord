import { Collection } from "discord.js";
import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import colors from "colors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();

const emoji = {
  folder: "📁",
  success: "✅",
  warn: "⚠️",
  error: "❌",
  load: "📦",
};

const foldersPath = path.resolve(__dirname, "..", "..", "commands");

const loadCommands = async () => {
  try {
    if (!fs.existsSync(foldersPath)) {
      throw new Error(`Commands folder not found at: ${foldersPath}`);
    }

    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);

      if (!fs.lstatSync(commandsPath).isDirectory()) {
        logger.warn(`${emoji.warn} Skipping non-directory: ${commandsPath}`);
        continue;
      }

      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        try {
          const commandModule = await import(pathToFileURL(filePath).href);
          const command = commandModule.default;

          if (!command?.data || !command?.execute) {
            logger.warn(
              `${emoji.warn} Invalid command at ${filePath} — missing "data" or "execute"`
            );
            continue;
          }

          client.commands.set(command.data.name, command);
          logger.info(
            `${emoji.success} Loaded command: ${command.data.name}`.green
          );
        } catch (err) {
          logger.error(
            `${emoji.error} Failed to load command at ${filePath}: ${err.message}`
          );
        }
      }
    }

    const count = client.commands.size;
    logger.info(
      `${emoji.load} Total commands loaded: ${count} ${count === 0 ? "(⚠️ None loaded!)" : ""}`
    );
  } catch (err) {
    logger.error(`${emoji.error} Critical error loading commands: ${err.message}`);
    process.exit(1);
  }
};

export default loadCommands;
