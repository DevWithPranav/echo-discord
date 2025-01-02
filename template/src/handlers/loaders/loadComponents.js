import { Collection } from "discord.js";
import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import colors from "colors";

// Ensure components collection is initialized on the client
client.components = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadComponents = async () => {
  console.log("System".cyan, ">>".blue, "Loading Components...".green);

  const foldersPath = path.join(__dirname,'..', '..', "components");

  // Check if the components directory exists
  if (!fs.existsSync(foldersPath)) {
    console.log(
      "System".cyan,
      ">>".blue,
      "⚠️ [WARNING]".yellow,
      "Components folder not found.".yellow
    );
    return;
  }

  const componentFolders = fs.readdirSync(foldersPath);

  for (const folder of componentFolders) {
    const componentsPath = path.join(foldersPath, folder);

    // Check if the folder exists before processing
    if (!fs.existsSync(componentsPath)) {
      console.log(
        "System".cyan,
        ">>".blue,
        `⚠️ [WARNING] Components folder ${componentsPath} does not exist.`.yellow
      );
      continue;
    }

    const componentFiles = fs
      .readdirSync(componentsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of componentFiles) {
      const filePath = path.join(componentsPath, file);
      try {
        const component = await import(pathToFileURL(filePath).href);

        if ("default" in component) {
          const cmp = component.default;

          if (cmp.customId && typeof cmp.execute === "function") {
            client.components.set(cmp.customId, cmp);
            console.log(
              "System".cyan,
              ">>".blue,
              `Component ${cmp.customId} loaded successfully.`.green
            );
          } else {
            console.log(
              "System".cyan,
              ">>".blue,
              "⚠️ [WARNING]".yellow,
              `Component file ${filePath} is missing "customId" or "execute".`.yellow
            );
          }
        } else {
          console.log(
            "System".cyan,
            ">>".blue,
            "⚠️ [WARNING]".yellow,
            `Component file ${filePath} does not have a default export.`.yellow
          );
        }
      } catch (err) {
        logger.error(`Failed to load component at ${filePath}:`, err);
      }
    }
  }

  console.log("System".cyan, ">>".blue, "Components Loaded.".green);
  console.log(`\u001b[0m`);
};

export default loadComponents;
