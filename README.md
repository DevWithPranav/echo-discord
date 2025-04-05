
# ⚙️ Discord Bot Framework - Advanced Template

A modular, scalable, and developer-friendly **Discord bot framework** built with modern `discord.js`, focused on maintainability, performance, and flexibility.

---

## 🌟 Features

- 🧠 **Modular Architecture** – Cleanly separated commands, events, components, and utilities.
- 🧩 **Auto Handler Loader** – Dynamically loads commands, components, and event files.
- 🔄 **Event-driven System** – Easily attach lifecycle and user events via simple files.
- 📦 **Environment-Based Configuration** – Configure status text, token, and logging behavior via `.env`.
- 🧪 **Built-in Error Handler** – Centralized error catching with support for custom logging.
- 💡 **Easy Extensibility** – Add more handlers or plugin support with minimal changes.
- 📄 **Detailed Logs** – Logs written to both the console and structured files under `/logs`.

---

## 📁 Project Structure

```
discord-bot/
├── logs/                          # All log files (auto-generated)
├── node_modules/
├── src/
│   ├── bot/                       # Bot startup logic
│   │   ├── botClientOptions.js    # Discord client configuration
│   │   └── loadHandlers.js        # Loads all handler modules
│   ├── commands/
│   │   └── util/
│   │       └── ping.js            # Example ping command
│   ├── components/               # Button, modal, and select menu logic
│   ├── events/
│   │   └── client/
│   │       ├── errCreate.js       # Error handler
│   │       ├── interactionCreate.js  # Handles interactions (commands, buttons, modals)
│   │       └── ready.js           # Bot ready event
│   ├── handlers/
│   │   └── loaders/
│   │       ├── deployCommands.js  # Slash command deployer
│   │       ├── loadCommands.js    # Command loader
│   │       ├── loadComponents.js  # Component loader
│   │       └── loadEvents.js      # Event loader
│   ├── logger.js                  # Logging helper
│   ├── shard.js                   # Sharding support
│   └── bot.js                     # Client export
├── .env                           # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── README.md                      # This file
```

---

## 🚀 Getting Started

### 1. 📦 Install the Template

```bash
npx echo-discord-template
cd discord-bot
npm install
```

### 2. 🔑 Configure Your `.env`

```env
BOT_TOKEN=your-discord-token
DISCORD_ID=your-discord-app-id
BOT_ERROR_LOG_CHANNEL=log-channel-id
DISCORD_STATUS=🔧 Maintenance,⚡ Online,📚 Learning
STATUS_UPDATE_INTERVAL=3600000 # in ms (1 hour default)
NODE_ENV=development
```

### 3. 💬 Add Commands

Create your commands in `src/commands/` using the `SlashCommandBuilder`:

```js
// src/commands/util/ping.js
import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(client, interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};
```

---

## ▶️ Run Your Bot

```bash
npm start
```

Behind the scenes, this will:
- Create a configured Discord client from `botClientOptions.js`
- Dynamically load all commands, events, and components via `loadHandlers.js`
- Register slash commands with Discord (via `deployCommands.js`)
- Log meaningful startup info and status changes

---

## 🔄 Handlers

Handlers are responsible for dynamically loading specific aspects of your bot:

| Handler              | Description                                 |
|----------------------|---------------------------------------------|
| `loadCommands.js`    | Loads all slash commands into memory        |
| `loadEvents.js`      | Loads all event listeners (`Events.Client`) |
| `loadComponents.js`  | Loads all buttons, modals, and selects      |
| `deployCommands.js`  | Registers slash commands with Discord API   |

---

## 🧪 Error Logging

Errors during command or component execution are captured by `errCreate.js` and logged both to console and optionally to a Discord channel defined in `.env`:

```env
BOT_ERROR_LOG_CHANNEL=your-channel-id
```

---

## 🛠 Tips for Development

- Use `console.log()` during early development. Switch to structured logging in production using `logger.js`.
- Commands can use `.deferReply()` and `.followUp()` for long operations.
- Components (buttons, selects, modals) are dynamically matched by their `customId`.

---

## 🧩 Contributing

1. Fork the repo  
2. Create your branch: `git checkout -b feature/AmazingFeature`  
3. Commit: `git commit -m 'Add AmazingFeature'`  
4. Push: `git push origin feature/AmazingFeature`  
5. Open a Pull Request

---

## 🐛 Issues & Suggestions

Found a bug or have a feature request?  
Open an issue and include:
- 🔍 Clear description
- 🧪 Steps to reproduce
- 💥 Expected behavior vs actual
- 🖼 Screenshots if applicable

---

## 📜 License

This project is licensed under the MIT License.  
See the `LICENSE` file for details.

---

## 💬 Support

- [x] GitHub Issues (for bug reports & suggestions)
- [ ] Discord Community – coming soon
- [ ] Docs site – coming soon

---

Made with ❤️ by the Discord Bot Package community.
