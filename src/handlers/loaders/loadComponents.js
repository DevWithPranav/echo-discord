import { Collection } from "discord.js";
import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import colors from "colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emoji = {
  load: "📦",
  success: "✅",
  warn: "⚠️",
  error: "❌",
  system: "🛠️",
};

// Initialize component collection
client.components = new Collection();

const loadComponents = async () => {
  console.log(`${emoji.system} System`.cyan, ">>".blue, "Loading Components...".green);

  const basePath = path.join(__dirname, "..", "..", "components");

  if (!fs.existsSync(basePath)) {
    console.log(`${emoji.warn} System`.cyan, ">>".blue, "Components folder not found.".yellow);
    return;
  }

  const folders = fs.readdirSync(basePath);

  for (const folder of folders) {
    const folderPath = path.join(basePath, folder);
    if (!fs.lstatSync(folderPath).isDirectory()) {
      logger.warn(`${emoji.warn} Skipping ${folderPath} — not a directory`);
      continue;
    }

    const componentFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

    for (const file of componentFiles) {
      const filePath = path.join(folderPath, file);

      try {
        const imported = await import(pathToFileURL(filePath).href);
        const component = imported?.default;

        if (!component || !component.customId || typeof component.execute !== "function") {
          logger.warn(
            `${emoji.warn} Skipped invalid component: ${filePath} — missing "customId" or "execute()"`
          );
          continue;
        }

        client.components.set(component.customId, component);
        console.log(
          `${emoji.success} Loaded component: ${component.customId}`.green
        );
      } catch (err) {
        logger.error(`${emoji.error} Failed to load component at ${filePath}: ${err.message}`);
      }
    }
  }

  const total = client.components.size;
  console.log(
    `${emoji.load} Components loaded: ${total} ${total === 0 ? "(⚠️ none)" : ""}`.green
  );
  console.log("\u001b[0m");
};

export default loadComponents;
