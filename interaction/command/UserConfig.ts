import { addUser } from "@db/User";
import {
    type ApplicationCommand,
    type CacheType,
    type CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import pino from "pino";

const log = pino();

// 'If you opt in, there\'s a 10% chance your name will change when you type a message starting with "im" or "i\'m"! You can also opt-out of this feature.'
const UserConfig: ApplicationCommand = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the behaviour of meibot for yourself.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set")
                .setDescription("Set property")
                .addStringOption((option) =>
                    option
                        .setName("property")
                        .setDescription("Property to modify")
                        .setRequired(true)
                        .addChoices({ name: "imnick", value: "imnick" }),
                )
                .addStringOption((option) =>
                    option
                        .setName("value")
                        .setDescription("New value for the specified property")
                        .setRequired(true),
                ),
        ),
    async handleSetProperty(interaction: CommandInteraction<CacheType>) {
        return;
    },
    async execute(interaction: CommandInteraction<CacheType>) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "set":
                console.log(interaction);
                await interaction.reply({
                    content: `Card successfully`,
                    ephemeral: true,
                });
                return;
            default:
                await interaction.reply({
                    content: `Card successfully`,
                    ephemeral: true,
                });
                throw Error(`Unexpected subcommand passed to /config: ${subcommand}`);
        }
    },
};

export default UserConfig;
