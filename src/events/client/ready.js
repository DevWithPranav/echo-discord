import { Events, ActivityType } from 'discord.js';
import colors from 'colors';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log("🧩System".cyan, ">>".blue, `✅ Bot started on ${client.guilds.cache.size} servers.`.green);
    console.log("Bot".cyan, ">>".blue, `👤 Logged in as ${client.user.tag}`.green);

    const defaultStatuses = [
      "・🛠️┆Maintenance Mode",
      "・🚀┆Launching Soon",
      "・📚┆Learning Mode",
      "・🔗┆Connected",
      "・⚡┆High Performance",
      "・🔧┆Bug Fixes"
    ];

    const statusArray = process.env.DISCORD_STATUS
      ? process.env.DISCORD_STATUS
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      : defaultStatuses;

    const updateStatus = () => {
      try {
        const random = statusArray[Math.floor(Math.random() * statusArray.length)];
        client.user.setPresence({
          activities: [{ name: random, type: ActivityType.Playing }],
          status: "online"
        });

        console.log("✅Status".cyan, ">>".blue, `🎮 Updated to "${random}"`.green);
      } catch (err) {
        console.error("❌ Failed to update presence:", err);
      }
    };

    updateStatus(); // Set immediately on ready

    const interval = parseInt(process.env.STATUS_UPDATE_INTERVAL, 10) || 3600000; // 1 hour fallback

    setInterval(updateStatus, interval);
  }
};
