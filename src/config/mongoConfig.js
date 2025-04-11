import dotenv from 'dotenv';
dotenv.config();

export default {
    mongoURI: process.env.MONGO_URI,
    mongoDBName: process.env.MONGO_DB_NAME || 'discordBotDB',
    mongoLogChannel: process.env.MONGO_LOG_CHANNEL_ID, // Discord channel ID for Mongo logs
};