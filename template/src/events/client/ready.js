import { Events, ActivityType } from 'discord.js';
import colors from 'colors';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log('System'.cyan, '>>'.blue, `Bot started on ${client.guilds.cache.size} servers`.green);
        console.log('Bot'.cyan, '>>'.blue, `Ready! Logged in as ${client.user.tag}`.green);

        // Retrieve the status text from the environment or use a default list
        const defaultStatus = [
            `・🛠️┆Maintenance Mode`,
            `・🚀┆Launching Soon`,
            `・📚┆Learning Mode`,
            `・🔗┆Connected`,
            `・⚡┆High Performance`,
            `・🔧┆Bug Fixes`
        ];

        const statusTextArray = process.env.DISCORD_STATUS
            ? process.env.DISCORD_STATUS.split(',').map(text => text.trim()).filter(Boolean)
            : defaultStatus;

        // Function to update the bot's presence
        const updateStatus = () => {
            try {
                const randomStatus = statusTextArray[Math.floor(Math.random() * statusTextArray.length)];
                client.user.setPresence({
                    activities: [{ name: randomStatus, type: ActivityType.Playing }],
                    status: 'online'
                });
                console.log('Status Update'.cyan, '>>'.blue, `Set status to "${randomStatus}"`.green);
            } catch (error) {
                console.error('Error updating status:', error);
            }
        };

        // Update the status immediately on ready
        updateStatus();

        // Retrieve update interval from environment or default to 1 hour
        const updateInterval = parseInt(process.env.STATUS_UPDATE_INTERVAL, 10) || 3600000; // Default: 1 hour

        // Schedule periodic updates
        setInterval(updateStatus, updateInterval);
    }
};
