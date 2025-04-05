import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(client, interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      // Simulate error for testing purposes
      throw new Error('Simulated error for testing');

      // Uncomment the line below if you want the real "Pong!" reply
      // await interaction.editReply({ content: '🏓 Pong!' });
    } catch (error) {
      console.error(`❌ Error in /ping:`, error);

      const errorHandler = await import('../../events/client/errCreate.js');
      await errorHandler.default.execute(client, error, 'ping', interaction);
    }
  },
};
