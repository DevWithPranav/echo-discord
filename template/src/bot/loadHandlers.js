import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import colors from 'colors';
import logger from '../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadHandlers = async () => {
    console.log('System'.cyan, '>>'.blue, 'Loading Handlers...'.green);
    const foldersPath = path.join(__dirname, '..', 'handlers');

    if (!fs.existsSync(foldersPath)) {
        throw new Error(`Handlers folder not found at: ${foldersPath}`);
    }

    const handlersFolders = fs.readdirSync(foldersPath);

    for (const folder of handlersFolders) {
        const handlersPath = path.join(foldersPath, folder);
        
        if (!fs.lstatSync(handlersPath).isDirectory()) {
            continue;
        }

        const handlersFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

        for (const file of handlersFiles) {
            const filePath = path.join(handlersPath, file);
            try {
                await import(pathToFileURL(filePath).toString());
                console.log('System'.cyan, '>>'.blue, `Loaded handler: ${file}`.green);
            } catch (err) {
                logger.error(`Failed to load handler at ${filePath}: ${err.message}`);
            }
        }
    }
    
    console.log('System'.cyan, '>>'.blue, 'Handlers Loaded'.green);
    console.log('\u001b[0m');
};

export default loadHandlers;