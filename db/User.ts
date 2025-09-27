declare module 'knex/types/tables' {
    /** Type for the `User` entity.
    * Each user should be able to opt-in and opt-out to the nickname change gimmick by guild.
    * The user's presence in this database is their opt-in.
    * Opting out should remove that user from the database.
    * 
    * Upon changing the user's name, the next message should change the user's name
    * back to their original name. That original name is stored in this database.
    * 
    * If this bot changed the nickname of a user already and the message triggers the bot 
    * to change the user's nickname another time based on the following message,
    * then the original name stored in this database should NOT change.
    * 
    * If the user's nickname has changed immediately after this bot changes their username,
    * then this bot SHOULD NOT change that user's nickname.
    * 
    * i.e. A message SHALL change the nickname of the author to a gimmick username, iff:
    *   1. The random chance is fulfilled and the message matches the regex
    *   2. The user has opted in (matching id in this database)
    *   3. The user's base_nick is NULL (that is, no gimmick has occurred)
    * 
    * In addition, a message SHALL change the nickname of the author to the 'base_nick' iff:
    *   1. Either condition may be fulfilled:
    *       1.1 The message does not match the regex
    *       1.2 The message matches the regex, but the random chance is not fulfilled
    *   2. The user has opted in (matching id in this database)
    *   3. The user's current nickname matches `gimmick_nick` i.e. was set by this bot
    *       3.1 If it does not match the `gimmick_nick` entry in this database, the base_nick
    *           and gimmick_nick SHOULD both be set to NULL.
    * 
    **/
    interface User {
        id: string,
        guild_id: string,
        base_nick: string | null,
        gimmick_nick: string | null
    }
    interface Tables {
        User: User;
    }
}

