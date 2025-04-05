import dotenv from 'dotenv';
import client from './bot/botClientOptions.js';
import logger from './logger.js';
import loadHandlers from './bot/loadHandlers.js';
import loadEvents from './handlers/loaders/loadEvents.js';
import loadComponents from './handlers/loaders/loadComponents.js';

dotenv.config();

const gracefulShutdown = async (signal) => {
    logger.info(`System >> ${signal} received. Initiating graceful shutdown...`);

    try {
        await client.destroy();
        logger.info('Client destroyed successfully.');
    } catch (error) {
        logger.error('Error during shutdown:', error);
    } finally {
        process.exit(0);
    }
};

const startBot = async () => {
    try {
        console.log('\n\u001b[0m');
        console.log('System'.cyan, '>>'.blue, 'BOT Starting up...'.green);
        console.log('© Echo PVT | 2024 - 2025'.red);
        console.log('All rights reserved'.red);
        console.log('System'.cyan, '>>'.blue, 'VERSION 1.01.00'.red, 'Loaded'.green);
        console.log(`\u001b[0m`);

        await Promise.all([
            loadHandlers(),
            loadEvents(),
            loadComponents(),
        ]);

        const token = process.env.BOT_TOKEN;

        if (!token) {
            throw new Error('BOT_TOKEN is not defined in environment variables.');
        }

        await client.login(token);
        logger.info('Bot logged in successfully.');

        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    } catch (error) {
        logger.error('Fatal startup error:', error);
        process.exit(1);
    }
};

// Global process handlers
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise);
    logger.error('Reason:', reason);
    if (reason instanceof Error) {
        logger.error('Stack Trace:', reason.stack);
    }
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    logger.error('Stack Trace:', error.stack);
    process.exit(1);
});

process.on('warning', (warning) => {
    logger.warn('Node Warning:', warning);
});

startBot();
