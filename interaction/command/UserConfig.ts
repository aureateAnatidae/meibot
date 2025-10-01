import { addImnick, removeImnick } from "@db/Imnick";
import {
    type ApplicationCommand,
    type CacheType,
    type CommandInteraction,
    MessageFlags,
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
        const property = interaction.options.getString("property");
        const value = interaction.options.getString("value");

        switch (true) {
            case property === "imnick" && value === "true": {
                const member = interaction.member;
                await addImnick(member.user.id, member.guild.id);
                return;
            }
            case property === "imnick" && value === "false": {
                const member = interaction.member;
                await removeImnick(member.user.id, member.guild.id);
                return;
            }
        }
    },
    async execute(interaction: CommandInteraction<CacheType>) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "set": {
                await this.handleSetProperty(interaction);
                await interaction.reply({
                    content: "Successfully set property.",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }
            default:
                await interaction.reply({
                    content: "Invalid subcommand (should be impossible to reach)",
                    flags: MessageFlags.Ephemeral,
                });
                throw Error(`Unexpected subcommand passed to /config: ${subcommand}`);
        }
    },
};

export default UserConfig;
