import { knexDb } from "@db/knexfile";
import pino from "pino";

const log = pino();
/** Type for the `User` entity..
 * Each user should be able to opt-in and opt-out to the nickname change gimmick by guild.
 * The user's imnick == NULL determines their opt-in/out status.
 * Opting out should prevent the nickname gimmick from affecting that user.
 *
 * Upon changing the user's name, the next message should change the user's name
 * back to their original name. That original name, as well as the new name,
 * is stored in the "Imnick" table (one-to-one relation).
 *
 * If this bot changed the nickname of a user already and the message triggers the bot
 * to change the user's nickname another time based on the following message,
 * then the original name stored in the "Imnick" table should NOT change.
 *
 * If the user's nickname has changed immediately after this bot changes their username,
 * then this bot SHOULD NOT change that user's nickname.
 *
 * i.e. A message SHALL change the nickname of the author to a gimmick username, iff:
 *   1. The random chance is fulfilled and the message matches the regex
 *   2. The user has opted in (relation to the `Imnick` table is NOT NULL)
 *   3. The User's matching `Imnick` base_nick is NULL (that is, no gimmick has occurred)
 *
 * In addition, a message SHALL change the nickname of the author to the 'base_nick' iff:
 *   1. Either condition may be fulfilled:
 *       1.1 The message does not match the regex
 *       1.2 The message matches the regex, but the random chance is not fulfilled
 *   2. The user has opted in (relation to the `Imnick` table is NOT NULL)
 *   3. The user's current nickname matches `gimmick_nick` i.e. was set by this bot
 *       3.1 If it does not match the `gimmick_nick` entry in the `Imnick` table, the
 *      `base_nick` and `gimmick_nick` SHOULD both be set to NULL.
 *
 **/
export type User = {
    user_id: string;
    guild_id: string;
    imnick_id: number;
};

export const UserTable = {
    table_name: "User",
    initialize(table) {
        table.string("user_id", 16, { primary_key: true }).checkLength(">", 0);
        table.string("guild_id", 16, { primary_key: true }).checkLength(">", 0);
        // table.foreign("imnick_id").references("imnick_id").inTable("Imnick");
    },
};

export function addUser(id: string, guild_id: string): Promise<boolean> {
    knexDb("User")
        .insert({ user_id: id, guild_id: guild_id })
        .then((index) => {
            log.info(`Created entity in User table at index ${index[0]}`);
            return true;
        })
        .catch((err) => {
            log.error("Failed to create entity in User table.", err);
            throw err;
        });
}
// export async function removeUser(id: string): boolean {}
// export async function getUser(id: string): User {}
