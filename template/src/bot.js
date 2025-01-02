import client from './bot/botClientOptions.js'
import dotenv from 'dotenv'
import logger from './logger.js'
import loadHandlers from './bot/loadHandlers.js';
import loadEvents from './handlers/loaders/loadEvents.js';
import loadComponents from './handlers/loaders/loadComponents.js';
dotenv.config()


const startBot = async () => {
    try {
        console.log('System'.cyan, '>>'.blue, 'BOT Starting up.....'.green);
        console.log(`\u001b[0m`);
        console.log('© Echo PVT | 2024 - 2024'.red);
        console.log('All rights reserved'.red);
        console.log('System'.cyan, '>>'.blue, 'VERSION 1.00.00'.red, 'Loaded'.green);
        console.log(`\u001b[0m`);

        await loadHandlers();
        await loadEvents();
        await loadComponents();

        client.login(process.env.BOT_TOKEN).catch((error) => {
            logger.error('Error logging in:', error);
            process.exit(1);
        });

        process.on('SIGINT', async () => {
            console.log('System'.cyan, '>>'.blue, 'SIGINT signal received:'.red, 'shutting down.'.green);
            try {
                await client.destroy();
            } catch (error) {
                logger.error('Error during shutdown:', error);
            } finally {
                process.exit(0);
            }
        });

        process.on('SIGTERM', async () => {
            console.log('System'.cyan, '>>'.blue, 'SIGTERM signal received:'.red, 'shutting down.'.green);
            try {
                await client.destroy();
            } catch (error) {
                logger.error('Error during shutdown:', error);
            } finally {
                process.exit(0);
            }
        });

    } catch (error) {
        logger.error('Error starting bot:', error);
        process.exit(1);
    }
};

startBot();

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection:', { promise, reason });
    if (reason instanceof Error) {
        logger.error('Stack Trace:', reason.stack);
    }
});

process.on('warning', (warn) => {
    logger.warn('Warning:', warn);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});