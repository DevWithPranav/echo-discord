import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import colors from "colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emoji = {
  system: "🧩",
  success: "✅",
  warn: "⚠️",
  error: "❌",
  lightning: "⚡",
};

const loadEvents = async () => {
  console.log(`${emoji.system} System`.cyan, ">>".blue, "Loading Events...".green);

  const basePath = path.join(__dirname, "..", "..", "events");

  if (!fs.existsSync(basePath)) {
    console.log(`${emoji.warn} System`.cyan, ">>".blue, "Events folder not found.".yellow);
    return;
  }

  const folders = fs.readdirSync(basePath);

  for (const folder of folders) {
    const folderPath = path.join(basePath, folder);

    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
      logger.warn(`${emoji.warn} Skipping ${folderPath} — not a valid directory`);
      continue;
    }

    const eventFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(folderPath, file);

      try {
        const imported = await import(pathToFileURL(filePath).href);
        const event = imported?.default;

        if (!event || !event.name || typeof event.execute !== "function") {
          logger.warn(`${emoji.warn} Invalid event in ${filePath} — missing "name" or "execute()"`);
          continue;
        }

        const handler = (...args) => event.execute(...args, client);

        if (event.once) {
          client.once(event.name, handler);
          console.log(`${emoji.lightning} Registered [once] event: ${event.name}`.green);
        } else {
          client.on(event.name, handler);
          console.log(`${emoji.success} Registered event: ${event.name}`.green);
        }

      } catch (err) {
        logger.error(`${emoji.error} Failed to load event at ${filePath}: ${err.message}`);
      }
    }
  }

  console.log(`${emoji.system} System`.cyan, ">>".blue, "Events Loaded ✅".green);
  console.log(`\u001b[0m`);
};

export default loadEvents;
