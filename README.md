# **ECHO Discord (discord bot package v1)**

A modular, scalable, and user-friendly Discord bot package built with JavaScript. This package is designed for ease of use, flexibility, and extensibility, making it suitable for developers at any level of experience.

Whether you're building your first Discord bot or looking for a solid foundation for an advanced bot, this package provides the tools and structure you need.

### **Features** 

- Modular Architecture: Organize your bot into commands, events, and components with clear separation of concerns.

- Dynamic Loading: Handlers for commands, events, and components are dynamically loaded to simplify development.

- Built-in Logging: Utility functions for structured and meaningful logs during bot operation.

- Environment Configuration: .env file support to securely manage sensitive data such as tokens and API keys.

- Ready-to-Use Setup: Minimal configuration required—get started with just a few commands.

- Extensibility: Add custom functionality effortlessly with modular files and a robust architecture.

### **Table of contents**

	1. GETTING STARTED 
		- Prerequisites 
		- Installation 
	2. PROJECT STRUCTURE
	    - src/bot
	    - src/commands
	    - src/events
	    - src/handlers/loaders
	3. SCRIPTS
	4. CONTRIBUTING 
	5. LICENCE 

#### **Getting started**

1. Prerequisites 

   Before getting started, ensure your system has the following installed:
   `Node.js (v18 or latest)`
   `npm (v8 or latest)`
   
1. Installation 

   Follow these steps to set up the bot 

    - Run the following command:
     `npx echo-discord`

    - This will scaffold the bot package in a new directory. Follow the prompts to set up your project.
     Navigate into the created directory (if needed):
     `cd your folder name`

   >All the needed packages will automatically installed 

    - Set up your .env file:
     `BOT_TOKEN= YOUR_BOT_TOKEN`
     `CLIENT_ID= YOUR_BOT_ID`
     `LOG_CHANNEL_ID= YOUR_LOG_CHANNEL_ID (optional)`
   
    - Run the bot 
     `npm start`

   

