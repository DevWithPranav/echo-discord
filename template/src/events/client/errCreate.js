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
    console.error("Error occurred:", err);

    const errorCode = generator.generate({
      length: 10,
      numbers: true,
    });

    const errorEmbed = new EmbedBuilder()
      .setTitle(`🚨・Error: ${errorCode}`)
      .addFields(
        {
          name: "✅┇Guild",
          value: `${interaction.guild?.name || "Unknown"} (${
            interaction.guild?.id || "N/A"
          })`,
        },
        { name: "💻┇Command/ID", value: `${command}` },
        { name: "💬┇Error Message", value: `\`\`${err.message}\`\`` },
        {
          name: "📃┇Stack Trace",
          value: `\`\`${
            err.stack?.substr(0, 1018) || "No stack trace available"
          }\`\``,
        }
      )
      .setColor("Red")
      .setTimestamp();

    const userErrorEmbed = new EmbedBuilder()
      .setTitle("Error")
      .setDescription("There was an error executing this command.")
      .setColor("Red")
      .addFields(
        { name: "Error Code", value: `\`${errorCode}\``, inline: true },
        {
          name: "What Now?",
          value: "Contact the developers using the support server.",
          inline: true,
        }
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support Server")
        .setURL("https://discord.gg/wqAfJVN9hZ")
        .setStyle(ButtonStyle.Link)
    );

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          embeds: [userErrorEmbed],
          components: [row],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          embeds: [userErrorEmbed],
          components: [row],
          ephemeral: true,
        });
      }
    } catch (replyError) {
      console.warn("Failed to send error embed to user:", replyError.message);
    }

    const errorChannelId = process.env.BOT_ERROR_LOG_CHANNEL;
    if (errorChannelId) {
      const errorChannel = client.channels.cache.get(errorChannelId);
      if (errorChannel?.isTextBased()) {
        try {
          await errorChannel.send({ embeds: [errorEmbed] });
        } catch (logError) {
          console.error(
            "Failed to log error in the error channel:",
            logError.message
          );
        }
      } else {
        console.warn(
          `Error channel (${errorChannelId}) is not accessible or is not text-based.`
        );
      }
    }
  },
};
