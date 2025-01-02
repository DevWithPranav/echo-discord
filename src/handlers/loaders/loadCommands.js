import { Collection } from 'discord.js';
import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import colors from 'colors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();
const foldersPath = path.resolve(__dirname, '..', '..', 'commands');

const loadCommands = async () => {
  try {
    if (!fs.existsSync(foldersPath)) {
      throw new Error(`Commands folder not found at: ${foldersPath}`);
    }

    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      if (!fs.lstatSync(commandsPath).isDirectory()) {
        logger.warn(`Skipping ${commandsPath} - not a directory`);
        continue;
      }

      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
          const command = await import(pathToFileURL(filePath).href);
          
          if (!command.default?.data || !command.default?.execute) {
            logger.warn(`Invalid command at ${filePath} - missing data or execute property`);
            continue;
          }

          client.commands.set(command.default.data.name, command.default);
          logger.info(`Loaded command: ${command.default.data.name}`);
        } catch (error) {
          logger.error(`Failed to load command at ${filePath}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    logger.error(`Critical error loading commands: ${error.message}`);
    process.exit(1);
  }
};

export default loadCommands;