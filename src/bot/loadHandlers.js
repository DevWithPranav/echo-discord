import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import colors from 'colors';
import logger from '../logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadHandlers = async () => {
  console.log('System'.cyan, '>>'.blue, 'Loading Handlers...'.green);

  const handlersRootPath = path.join(__dirname, '..', 'handlers');

  if (!fs.existsSync(handlersRootPath)) {
    console.warn(
      'System'.cyan,
      '>>'.blue,
      '⚠️ [WARNING]'.yellow,
      `Handlers folder not found at: ${handlersRootPath}`.yellow
    );
    return;
  }

  const handlerFolders = fs.readdirSync(handlersRootPath);

  for (const folder of handlerFolders) {
    const handlerFolderPath = path.join(handlersRootPath, folder);

    if (!fs.existsSync(handlerFolderPath) || !fs.lstatSync(handlerFolderPath).isDirectory()) {
      continue;
    }

    const handlerFiles = fs
      .readdirSync(handlerFolderPath)
      .filter(file => file.endsWith('.js'));

    for (const file of handlerFiles) {
      const fullFilePath = path.join(handlerFolderPath, file);

      try {
        await import(pathToFileURL(fullFilePath).href);
        console.log('System'.cyan, '>>'.blue, `Loaded handler: ${folder}/${file}`.green);
      } catch (err) {
        logger.error(`Failed to load handler at ${fullFilePath}: ${err.stack || err.message}`);
      }
    }
  }

  console.log('System'.cyan, '>>'.blue, 'Handlers Loaded'.green);
  console.log('\u001b[0m');
};

export default loadHandlers;
