import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import generator from "generate-password";
import dotenv from "dotenv";
dotenv.config();

export default {
  name: "errorHandler",
  async execute(client, err, command, interaction) {
    console.error("❌ Error occurred:", err);

    const errorCode = generator.generate({
      length: 10,
      numbers: true,
    });

    const errorEmbed = new EmbedBuilder()
      .setTitle(`🚨 Error Code: ${errorCode}`)
      .setColor("Red")
      .addFields(
        {
          name: "✅ Guild",
          value: `${interaction.guild?.name || "Unknown"} (${interaction.guild?.id || "N/A"})`,
        },
        {
          name: "💻 Command/ID",
          value: `${command || "Unknown"}`,
        },
        {
          name: "💬 Error Message",
          value: `\`\`${err.message || "No message"}\`\``,
        },
        {
          name: "📃 Stack Trace",
          value: `\`\`${err.stack?.slice(0, 1018) || "No stack trace available"}\`\``,
        }
      )
      .setTimestamp();

    const userEmbed = new EmbedBuilder()
      .setTitle("❗ Command Failed")
      .setColor("Red")
      .setDescription("There was an error executing this command.")
      .addFields(
        {
          name: "🧾 Error Code",
          value: `\`${errorCode}\``,
          inline: true,
        },
        {
          name: "📩 What to do?",
          value: "Contact support using the button below.",
          inline: true,
        }
      );

    const supportRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🛠️ Support Server")
        .setURL("https://discord.gg/wqAfJVN9hZ")
        .setStyle(ButtonStyle.Link)
    );

    // Notify the user
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          embeds: [userEmbed],
          components: [supportRow],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [userEmbed],
          components: [supportRow],
          ephemeral: true,
        });
      }
    } catch (userReplyErr) {
      console.warn("⚠️ Failed to notify user:", userReplyErr.message);
    }

    // Log to error channel
    const errorChannelId = process.env.BOT_ERROR_LOG_CHANNEL;
    if (errorChannelId) {
      const channel = client.channels.cache.get(errorChannelId);

      if (channel?.isTextBased()) {
        try {
          await channel.send({ embeds: [errorEmbed] });
        } catch (sendErr) {
          console.error("❌ Failed to send to error log channel:", sendErr.message);
        }
      } else {
        console.warn(`⚠️ Error log channel (${errorChannelId}) is not text-based or not accessible.`);
      }
    } else {
      console.warn("⚠️ BOT_ERROR_LOG_CHANNEL is not set in .env");
    }
  },
};
