# MEICORD BOT

Based on discord.js, written in TypeScript, as an ES Module. I really really hate cjs.

With thanks to:

[@Gormyy](https://github.com/Gormyy)
> https://x.com/GormBuluu/status/1970908210329682337

## To run:

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

## Troubleshooting

> It doesn't seem to change the nickname of the target user. The logs are saying I don't have the permissions, although I've configured them corrrectly.

Due to limitations in how Discord permissions work, bots (and admins) can't change the nickname of the server owner, since it's a higher role. (https://github.com/discordjs/discord.js/issues/518)
