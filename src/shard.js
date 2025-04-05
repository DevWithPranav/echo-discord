import { ShardingManager } from "discord.js";
import { fileURLToPath } from "url";
import path from "path";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

// === Constants & Setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.clear();

// === Logging Helpers ===
const emoji = {
  startup: "🚀",
  ready: "✅",
  error: "❌",
  warning: "⚠️",
  reconnect: "🔄",
  shard: "🧩",
};

const logSystem = (message, color = "cyan") =>
  console.log(`${emoji.shard} System`.cyan, ">>".blue, message[color]);

const logError = (message) =>
  console.error(`${emoji.error} System`.cyan, ">>".blue, message.red);

// === Env Validation ===
if (!process.env.BOT_TOKEN) {
  logError("BOT_TOKEN is not defined in the .env file.");
  process.exit(1);
}

// === Initialize Sharding Manager ===
const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
  totalShards: "auto",
  token: process.env.BOT_TOKEN,
  respawn: true,
  silent: false,
});

logSystem(`${emoji.startup} Launching Shards...`, "green");

// === Shard Lifecycle Events ===
manager.on("shardCreate", (shard) => {
  logSystem(`🆕 Starting Shard #${shard.id}`, "yellow");

  shard.on("death", (process) => {
    logError(`💀 Shard #${shard.id} died (code ${process.exitCode}). Restarting...`);
  });

  shard.on("disconnect", (event) => {
    logError(`🔌 Shard #${shard.id} disconnected. Close event:`);
    console.error(event);
  });

  shard.on("reconnecting", () => {
    logSystem(`🔁 Shard #${shard.id} reconnecting...`, "cyan");
  });

  shard.on("ready", () => {
    logSystem(`✅ Shard #${shard.id} is ready!`, "green");
  });

  shard.on("resume", () => {
    logSystem(`🔄 Shard #${shard.id} resumed successfully.`, "green");
  });

  shard.on("message", (msg) => {
    logSystem(`📩 Shard #${shard.id} message: ${msg}`, "grey");
  });
});

// === Spawn the Shards ===
manager
  .spawn()
  .then(() => logSystem("🎉 All shards spawned successfully!", "green"))
  .catch((err) => {
    logError("Failed to spawn shards:");
    console.error(err);
    process.exit(1);
  });

// === Global Error Handling ===
process.on("unhandledRejection", (reason) => {
  logError("UNHANDLED REJECTION:");
  console.error(reason);
});

process.on("uncaughtException", (error) => {
  logError("UNCAUGHT EXCEPTION:");
  console.error(error);
  process.exit(1);
});

process.on("warning", (warn) => {
  logSystem(`${emoji.warning} Node Warning: ${warn.message}`, "yellow");
});
