#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

async function main() {
  try {
    console.log("Welcome to the Echo App Creator!");

    // Prompt the user for where to create the app
    const { folderOption } = await inquirer.prompt([
      {
        type: "list",
        name: "folderOption",
        message: "Where do you want to create the app?",
        choices: ["In a new folder", "In the current folder"],
      },
    ]);

    let targetPath;

    if (folderOption === "In a new folder") {
      const { folderName } = await inquirer.prompt([
        {
          type: "input",
          name: "folderName",
          message: "Enter the name of your folder:",
          default: "echo-app",
        },
      ]);

      targetPath = path.resolve(process.cwd(), folderName);

      if (fs.existsSync(targetPath)) {
        console.log("Folder already exists. Please choose a different name.");
        return;
      }

      fs.ensureDirSync(targetPath);
    } else {
      targetPath = process.cwd();
      const files = fs.readdirSync(targetPath);
      if (files.length > 0) {
        const { confirm } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirm",
            message: "The current folder is not empty. Continue anyway?",
            default: false,
          },
        ]);

        if (!confirm) {
          console.log("Aborting. Please choose an empty directory.");
          return;
        }
      }
    }

    // Resolve template paths
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templateSrcPath = path.resolve(__dirname, "src");
    const envExamplePath = path.resolve(__dirname, ".env");
    const packageJsonPath = path.resolve(__dirname, "package.json");

    // Validate template source path
    if (!fs.existsSync(templateSrcPath)) {
      console.error(`Template src folder not found at ${templateSrcPath}`);
      return;
    }

    // Copy the `src` folder
    console.log("Copying the template files...");
    await fs.copy(templateSrcPath, path.join(targetPath, "src"));

    // Copy `.env`
    if (fs.existsSync(envExamplePath)) {
      await fs.copy(envExamplePath, path.join(targetPath, ".env"));
    } else {
      console.warn(`.env file not found at ${envExamplePath}`);
    }

    // Copy `package.json`
    if (fs.existsSync(packageJsonPath)) {
      await fs.copy(packageJsonPath, path.join(targetPath, "package.json"));
    } else {
      console.warn(`package.json file not found at ${packageJsonPath}`);
    }

    // Install dependencies
    console.log("Installing dependencies...");
    exec(`cd ${targetPath} && npm install`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during installation: ${error.message}`);
        return;
      }

      if (stderr) {
        console.warn(`Warnings during installation: ${stderr}`);
      }

      console.log(stdout);
      console.log("Your Echo App is ready!");
      console.log(`Navigate to your app folder: cd ${path.relative(process.cwd(), targetPath)}`);
      console.log("Start the app: npm run dev");
    });
  } catch (err) {
    console.error("An error occurred:", err.message);
  }
}

main();
