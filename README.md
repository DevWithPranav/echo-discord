# ⚙️ Discord Bot Framework - Advanced Template

A modular, scalable, and developer-friendly **Discord bot framework** built with modern `discord.js`, focused on maintainability, performance, and flexibility. Now includes **MongoDB integration**, advanced logging, and structured error handling.

---

## 🌟 Features

- 🧠 **Modular Architecture** – Clean separation of commands, events, components, and handlers.
- 🔌 **MongoDB Integration** – Centralized MongoDB connection with models and Discord logging support.
- 🧹 **Auto Handler Loader** – Dynamically loads all slash commands, events, and components.
- 🔄 **Event-driven System** – Simple file-based lifecycle and interaction handling.
- 🧪 **Central Error Handler** – Uniform error capture and reporting.
- 📄 **Detailed Logging** – Console, file-based, and Discord channel logging with support for log levels.
- 💬 **Status Rotation** – Customizable rotating status messages from `.env`.

---

## 📁 Project Structure

```
discord-bot/
├── logs/                          # All log files (auto-generated)
├── node_modules/
├── src/
│   ├── bot/
│   │   ├── botClientOptions.js    # Discord client config
│   │   └── loadHandlers.js        # Load all handler types
│   ├── commands/
│   │   └── util/
│   │       └── ping.js            # Example slash command
│   ├── components/                # Buttons, modals, selects
│   ├── config/
│   │   └── mongo.config.js        # MongoDB configuration
│   ├── database/
│   │   └── models/
│   │       └── User.js            # Example Mongoose model
│   ├── events/
│   │   └── client/
│   │       ├── errCreate.js       # Central error handler
│   │       └── ready.js           # Bot is ready
│   ├── handlers/
│   │   └── loaders/
│   │       ├── deployCommands.js  # Slash command deployer
│   │       ├── loadCommands.js    # Load command files
│   │       ├── loadComponents.js  # Load UI components
│   │       └── loadEvents.js      # Load event files
│   ├── logger.js                  # Logging utility
│   ├── mongoConnect.js            # MongoDB connection logic
│   ├── shared.js
│   └── index.js                   # Main entry point
├── .env                           # Environment config
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. 📦 Install the Template

```bash
npx echo-discord-template
cd discord-bot
npm install
```

---

### 2. 🔐 Configure `.env`

```env
##############################
# 🤖 Bot Configuration
##############################

# Your Discord bot token (REGENERATE this if leaked)
BOT_TOKEN=your-token-here

# Your bot's user ID
DISCORD_ID=

# Bot behavior mode
NODE_ENV=development

# Discord channel ID to log bot errors
BOT_ERROR_LOG_CHANNEL=

# Bot presence status (rotates through these values)
DISCORD_STATUS=・🛠️┆Maintenance Mode,・🚀┆Launching Soon,・📚┆Learning Mode,・🔗┆Connected,・⚡┆High Performance,・🔧┆Bug Fixes

# Time interval for updating status (in milliseconds)
STATUS_UPDATE_INTERVAL=100000


##############################
# 📦 MongoDB Configuration
##############################

# MongoDB connection URI
MONGO_URI=mongodb://localhost:27017/

# Database name used by the bot
MONGO_DB_NAME=echo-bot

# Channel ID where MongoDB connection status logs (optional)
MONGO_LOG_CHANNEL_ID=


##############################
# 📝 Logging Configuration
##############################

# Log level: error, warn, info, debug
LOG_LEVEL=debug

# Path to store log files
LOG_PATH=./logs

# Used to tag logs or service metrics
SERVICE_NAME=echo-bot

```

---

### 3. 🧠 Add a Command Example

```js
// src/commands/util/ping.js
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(client, interaction) {
        await interaction.reply({ content: '🏓 Pong!', ephemeral: true });
    },
};
```

---

### 4. ▶️ Start Your Bot

```bash
npm start
```

Behind the scenes:
- Initializes the Discord client
- Connects to MongoDB
- Loads all handlers, commands, and components
- Logs status updates and errors to files and Discord

---

## 🔗 MongoDB Usage

Your MongoDB connection is set up in `mongoConnect.js` and loaded via `index.js`. Models can be placed under:

```bash
src/database/models/
```

Example model: `User.js`

```js
// src/database/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    username: { type: String },
    joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
```

Use this in commands or events to store user data.

---

## 🔄 Auto Handlers

| File                | Description                                  |
|---------------------|----------------------------------------------|
| `loadCommands.js`   | Loads slash commands dynamically             |
| `loadEvents.js`     | Attaches event listeners                     |
| `loadComponents.js` | Loads modals, buttons, selects               |
| `deployCommands.js` | Deploys slash commands to Discord            |

---

## ⚠️ Error Handling

Handled centrally in `errCreate.js`, all exceptions are:
- Logged using `logger.js`
- Sent to a Discord error channel (if configured in `.env`)
- Categorized (e.g., interaction errors, database errors, etc.)

---

## 🧰 Development Tips

- Use `logger.info()` / `logger.error()` for structured logging.
- Modularize reusable components under `components/`.
- Always wrap async functions in `try/catch` and pass errors to the error handler.

---

## 🙌 Contributing

1. Fork the repo  
2. Create a branch: `git checkout -b feature/AmazingFeature`  
3. Commit your changes: `git commit -m 'Add AmazingFeature'`  
4. Push to your fork: `git push origin feature/AmazingFeature`  
5. Create a Pull Request

---

## 🧾 Bug Reporting

Found an issue? Please provide:
- A clear description
- Steps to reproduce
- Logs or screenshots
- Environment info (Node version, OS, etc.)

---

## 📜 License

Licensed under the MIT License.  
See `LICENSE` for details.

---

## 💬 Support

- GitHub Issues
- Discord Server *(coming soon)*
- Online Documentation *(coming soon)*

---

Made with ❤️ by the Echo Discord Framework community.

