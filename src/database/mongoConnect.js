import mongoose from 'mongoose';
import colors from 'colors';
import config from '../config/mongoConfig.js';
import logger from '../logger.js';

export default async function connectToDatabase(client) {
    try {
        if (!config.mongoURI) throw new Error('Mongo URI is not defined in environment variables');

        await mongoose.connect(config.mongoURI, {
            dbName: config.mongoDBName,
        });

        const successMsg = `✅ Connected to MongoDB: ${config.mongoDBName}`;
        //logger.info(successMsg);
        console.log('Database'.cyan, '>>'.blue, successMsg.green);

        if (client && config.mongoLogChannel) {
            const channel = await client.channels.fetch(config.mongoLogChannel).catch(() => null);
            if (channel && channel.isTextBased()) {
                channel.send(`📦 **MongoDB Connected:** \`${config.mongoDBName}\``);
            }
        }
    } catch (error) {
        const errorMsg = `❌ MongoDB connection error: ${error.message}`;
        logger.error(errorMsg);
        console.error('Database'.cyan, '>>'.blue, errorMsg.red);

        if (client && config.mongoLogChannel) {
            const channel = await client.channels.fetch(config.mongoLogChannel).catch(() => null);
            if (channel && channel.isTextBased()) {
                channel.send(`🚨 **MongoDB Connection Error:** \`${error.message}\``);
            }
        }
    }
}