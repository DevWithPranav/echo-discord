import { Events, PermissionsBitField } from 'discord.js';
import errorHandler from './errCreate.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        await handleCommand(interaction, client);
      } else if (interaction.isButton()) {
        await handleComponent(interaction, client, "button");
      } else if (interaction.isAnySelectMenu()) {
        await handleComponent(interaction, client, "select menu");
      } else if (interaction.isModalSubmit()) {
        await handleComponent(interaction, client, "modal");
      }
    } catch (error) {
      console.error("❌ Error handling interaction:", error);
      const id = interaction.commandName || interaction.customId || "Unknown";
      await errorHandler.execute(client, error, id, interaction);
    }
  }
};

async function handleCommand(interaction, client) {
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Command "${interaction.commandName}" not found.`);
    return await sendErrorReply(interaction, `🚫 Command \`${interaction.commandName}\` not found.`);
  }

  const missing = checkPermissions(interaction, command.requiredPermissions || []);
  if (missing.length > 0) {
    return await sendErrorReply(
      interaction,
      `❗ Missing permissions: \`${missing.join(', ')}\`.`
    );
  }

  try {
    await command.execute(client, interaction);
  } catch (err) {
    console.error(`🔥 Error in command "${interaction.commandName}":`, err);
    throw err;
  }
}

async function handleComponent(interaction, client, type) {
  const handler = client.components.get(interaction.customId);

  if (!handler) {
    console.warn(`⚠️ ${type} "${interaction.customId}" not found.`);
    return await sendErrorReply(interaction, `🔍 ${type} \`${interaction.customId}\` not found.`);
  }

  try {
    await handler.execute(interaction);
  } catch (err) {
    console.error(`🔥 Error in ${type} "${interaction.customId}":`, err);
    throw err;
  }
}

function checkPermissions(interaction, requiredPermissions) {
  const bot = interaction.guild?.members?.me;
  if (!bot) {
    console.warn("⚠️ Could not fetch bot member from guild.");
    return [];
  }

  return requiredPermissions.filter(perm => 
    !bot.permissions.has(PermissionsBitField.Flags[perm])
  );
}

async function sendErrorReply(interaction, content) {
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content, ephemeral: true });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  } catch (err) {
    console.error("⚠️ Failed to reply with error message:", err);
  }
}
