import { Events, type Message } from "discord.js";

const MessageCreate = {
    name: Events.MessageCreate,
    execute(message: Message) {
        nickname_change(message);
    },
};

const im_regex = /^(?:im|i'm) (.{3,30})(?:\s|$)/i;
/** https://x.com/GormBuluu/status/1970908210329682337?t=RkCx95wszqy_0lyDvd952Q&s=19
/* w/ credit to https://github.com/Gormyy
/*
**/
function nickname_change(message: Message) {
    if (Math.random() < 0.1) {
        const new_nickname = im_regex.exec(message.content)[1];
        if (new_nickname) {
            message.guild.members
                .fetch({ user: message.author })
                .then((guild_user) => guild_user.setNickname(new_nickname))
                .catch(console.error);
        }
    }
}

export default MessageCreate;
