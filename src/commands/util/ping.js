import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(client, interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            throw new Error('Simulated error for testing'); // Simulate an error
        } catch (error) {
            const errorHandler = await import('../../events/client/errCreate.js');
            await errorHandler.default.execute(client, error, 'ping', interaction);
        }
    },
};
