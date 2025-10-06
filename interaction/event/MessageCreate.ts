import { getImnick, updateImnick } from "@db/Imnick";
import { Events, type GuildMember, type Message } from "discord.js";
import pino from "pino";

const log = pino();

const im_regex = /^(?:im|i'm) (.{3,30})(?:\s|$)/i;
const youre_regex = /^(?:youre|you're) (.{3,30})(?:\s|$)/i;

const MessageCreate = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;
        const im_nick = im_regex.exec(message.content)?.[1];
        const youre_nick = youre_regex.exec(message.content)?.[1];

        if (Math.random() < 0.1 && (im_nick || (message.reference && youre_nick))) {
            if (im_nick) {
                try {
                    const guild_member: GuildMember = await message.guild.members.fetch({
                        user: message.author,
                    });

                    await nickname_change(guild_member, im_nick);
                } catch (err) {
                    log.error(err, `Failed to change nickname of user ${message.author.id}`);
                }
            } else if (message.reference && youre_nick) {
                try {
                    const referenced_message: Message = await message.channel.messages.fetch(
                        message.reference.messageId,
                    );

                    const guild_member: GuildMember = await message.guild.members.fetch({
                        user: referenced_message.author,
                    });

                    if (!guild_member.user.bot) {
                        await nickname_change(guild_member, youre_nick);
                    }
                } catch (err) {
                    log.error(
                        err,
                        `Failed to change nickname of user referenced by ${message.author.id}`,
                    );
                }
            }
        } else {
            try {
                await nickname_reset(message);
            } catch (err) {
                log.error(err, `Failed to reset nickname of user ${message.author.id}`);
            }
        }
    },
};

/** https://x.com/GormBuluu/status/1970908210329682337?t=RkCx95wszqy_0lyDvd952Q&s=19
 * w/ credit to https://github.com/Gormyy
 *
 * Can be optimized to use only a single SQL query.
 * But it's not a concern, and premature optimization is sin.
 * Optimize it when you'll never touch this feature again.
 **/
async function nickname_change(guild_member: GuildMember, new_gimmick_nick: string) {
    // If the user triggers this event from base_nick == null, then save their current nickname
    // so that we can reset it afterwards.
    // If the user triggers this event and already has a base_nick, then keep that base_nick.
    // If the user changed their nickname manually after being given a gimmick nickname,
    // then that becomes the new base_nick.

    const user_id = guild_member.user.id;
    const guild_id = guild_member.guild.id;

    const current_record = await getImnick(user_id, guild_id);
    if (!current_record) {
        log.debug("User has no matching record in Imnick (has not opted in)");
        return;
    }
    const { base_nick, gimmick_nick } = current_record;

    const current_nick = guild_member.nickname ?? guild_member.user.globalName;
    const new_base_nick = () => {
        if (base_nick == null) {
            return current_nick;
        } else if (current_nick !== gimmick_nick) {
            return current_nick;
        } else {
            return base_nick;
        }
    };

    await updateImnick(user_id, guild_id, new_base_nick(), new_gimmick_nick);
    await guild_member.setNickname(new_gimmick_nick);

    log.debug(`Changed nickname of user ${user_id}`);
    return;
}

async function nickname_reset(message: Message) {
    const user_id = message.author.id;
    const guild_id = message.guild.id;

    const current_record = await getImnick(user_id, guild_id);
    if (!current_record) {
        log.debug("User has no matching record in Imnick (has not opted in)");
        return;
    }
    const { base_nick, gimmick_nick } = current_record;
    if (!base_nick) {
        log.debug("Imnick has not occurred to the user. Skipping");
        return;
    }

    const guild_member: GuildMember = await message.guild.members.fetch({
        user: message.author,
    });

    // If the user triggers this event from base_nick != null, then change their username to
    // base_nick and reset the record in the Imnick table (base_nick = null, gimmick_nick = null).
    // If the user changed their username manually after being given a gimmick nickname,
    // then reset the record in the Imnick table (base_nick = null, gimmick_nick = null)
    // and do not change the nickname.
    const current_nick = guild_member.nickname ?? guild_member.user.globalName;

    if (gimmick_nick && gimmick_nick !== current_nick) {
        log.warn("User changed nickname between Imnick trigger and nickname reset. Reset record");
    } else if (base_nick) {
        await guild_member.setNickname(base_nick);
        log.debug(`Resetted nickname of user ${message.author.id}`);
    }

    await updateImnick(user_id, guild_id, null, null);
    return;
}

export default MessageCreate;
