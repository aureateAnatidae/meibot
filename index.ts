import { event_handlers } from "@events";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Registers each event's signal to its respective `execute` on the client.
for (const event of event_handlers) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => {
            event.execute(...args);
        });
    }
}

client.login(process.env.DISCORD_TOKEN);
