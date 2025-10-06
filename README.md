# MEICORD BOT

Based on discord.js, written in TypeScript, as an ES Module. I really really hate cjs.

With thanks to:

[@Gormyy](https://github.com/Gormyy)
> https://x.com/GormBuluu/status/1970908210329682337

## To run:

> No background in software? No friends with the know-how? Skip to the good part? **I encourage you to host it yourself since this bot requires access to all messages sent in the server** (does not store them), but you can install my version to your server with [this link](https://discord.com/oauth2/authorize?client_id=1420903496554647673). I make no guarantees on uptime, though.

Go to [the Discord developer portal](https://discord.com/developers/applications) and create a bot.
From "**Installation**", give it the scope
```
- applications.commands (should be included by default)
- Bot
```
and the permissions:
```
- Add Reactions
- Manage Nicknames
- Read Message History
```

Fill the appropriate values in a `.env` fulfilling values specified in `.env.example`.
Create an empty `meibot.db` file. It must be a file, not a directory. If a `meibot.db/` directory is inadvertently generated, delete it and create an empty `meibot.db` file.

To deploy, run `docker compose up`.

## Usage

Enable the nickname change feature for yourself by using the Discord command:
```bash
/config set nick-enabled true
# For more help:
/config help
```

## Troubleshooting

> It doesn't seem to change the nickname of the target user. The logs are saying I don't have the permissions, although I've configured them corrrectly.

Due to limitations in how Discord permissions work, bots (and admins) can't change the nickname of the server owner, since it's a higher role. (https://github.com/discordjs/discord.js/issues/518)
