import client from "../../bot/botClientOptions.js";
import logger from "../../logger.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import colors from "colors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadEvents = async () => {
  console.log("System".cyan, ">>".blue, "Loading Events...".green);

  const foldersPath = path.join(__dirname, '..', '..', "events");

  if (!fs.existsSync(foldersPath)) {
    console.log(
      "System".cyan,
      ">>".blue,
      "⚠️ [WARNING]".yellow,
      "Events folder not found.".yellow
    );
    return;
  }

  const eventFolders = fs.readdirSync(foldersPath);

  for (const folder of eventFolders) {
    const eventPath = path.join(foldersPath, folder);

    if (!fs.existsSync(eventPath)) {
      console.log(
        "System".cyan,
        ">>".blue,
        `⚠️ [WARNING] Event folder ${eventPath} does not exist.`.yellow
      );
      continue;
    }

    const eventFiles = fs
      .readdirSync(eventPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventPath, file);
      try {
        const event = await import(pathToFileURL(filePath).href);

        if ("default" in event) {
          const evt = event.default;

          if (evt.name && typeof evt.execute === "function") {
            if (evt.once) {
              console.log(
                "System".cyan,
                ">>".blue,
                `Registering event ${evt.name} to run once.`.green
              );
              client.once(evt.name, (...args) => evt.execute(...args, client));
            } else {
              console.log(
                "System".cyan,
                ">>".blue,
                `Registering event ${evt.name} to run on every occurrence.`
                  .green
              );
              client.on(evt.name, (...args) => evt.execute(...args, client));
            }
          } else {
            console.log(
              "System".cyan,
              ">>".blue,
              "⚠️ [WARNING]".yellow,
              `Event file ${filePath} is missing "name" or "execute".`.yellow
            );
          }
        } else {
          console.log(
            "System".cyan,
            ">>".blue,
            "⚠️ [WARNING]".yellow,
            `Event file ${filePath} does not have a default export.`.yellow
          );
        }
      } catch (err) {
        logger.error(`Failed to load event at ${filePath}:`, err);
      }
    }
  }

  console.log("System".cyan, ">>".blue, "Events Loaded".green);
  console.log(`\u001b[0m`);
};

export default loadEvents;
