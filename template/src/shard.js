import { ShardingManager } from "discord.js";
import { fileURLToPath } from "url";
import path from "path";
import colors from "colors";
import dotenv from 'dotenv';
dotenv.config();

// Helper functions
const logSystem = (message, color = "cyan") =>
  console.log("System".cyan, ">>".blue, message[color]);

const logError = (message) =>
  console.error("System".cyan, ">>".blue, message.red);

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
if (!process.env.BOT_TOKEN) {
  logError("BOT_TOKEN is not defined in the .env file");
  process.exit(1); // Exit if no token is provided
}

// Initialize ShardingManager
const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
  totalShards: "auto", // Automatically calculate the number of shards
  token: process.env.BOT_TOKEN, // Securely load token
  respawn: true, // Automatically respawn shards on exit
  silent: false, // Display shard output in the console
});

console.clear();

// Handle Shard Events
manager.on("shardCreate", (shard) => {
  logSystem(`Starting Shard #${shard.id}...`, "green");

  shard.on("death", (process) => {
    logError(
      `Shard #${shard.id} died with exit code ${process.exitCode}. Restarting...`
    );
  });

  shard.on("disconnect", (event) => {
    logError(`Shard #${shard.id} disconnected. Socket close event:`);
    console.log(event);
  });

  shard.on("reconnecting", () => {
    logSystem(`Shard #${shard.id} is reconnecting...`, "yellow");
  });

  shard.on("ready", () => {
    logSystem(`Shard #${shard.id} is ready!`, "green");
  });

  shard.on("resume", () => {
    logSystem(`Shard #${shard.id} has resumed successfully.`, "green");
  });

  shard.on("message", (message) => {
    logSystem(`Message received from Shard #${shard.id}: ${message}`, "grey");
  });
});

// Spawn Shards
manager
  .spawn()
  .then(() => logSystem("All shards spawned successfully!", "green"))
  .catch((error) => {
    logError("Error spawning shards:");
    console.error(error);
    process.exit(1);
  });

// Global Error Handling
process.on("unhandledRejection", (error) => {
  logError("Unhandled Promise Rejection:");
  console.error(error);
});

process.on("warning", (warn) => {
  logSystem(`Warning: ${warn.message}`, "yellow");
});
