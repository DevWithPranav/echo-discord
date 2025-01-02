import { REST, Routes } from 'discord.js';
import client from "../../bot/botClientOptions.js";
import colors from 'colors';
import dotenv from 'dotenv';
import loadCommands from './loadCommands.js';

dotenv.config();

const refreshCommands = async () => {
  await loadCommands();
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    console.log('System'.cyan, '>>'.blue, `Started refreshing ${client.commands.size} application (/) commands.`.green);

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_ID),
      { body: Array.from(client.commands.values()).map(cmd => cmd.data.toJSON()) }
    );

    console.log('System'.cyan, '>>'.blue, `Successfully reloaded ${client.commands.size} application (/) commands.`.green);
  } catch (error) {
    console.error(`[ERROR] Failed to refresh application commands: ${error.message}`);
  }
};

await refreshCommands();