import { knexDb } from "@db/knexfile";
import pino from "pino";

const log = pino();

export interface nick {
    user_id: string;
    guild_id: string;
    base_nick: string | null;
    gimmick_nick: string | null;
}

export const NickTable = {
    table_name: "Nick",
    initialize(table) {
        table.primary(["user_id", "guild_id"]);
        table.string("user_id");
        table.string("guild_id");

        table.string("base_nick").nullable();
        table.string("gimmick_nick").nullable();
    },
};

/**
 * The user opts-in to the nick feature. Should create a new record in the Nick table.
 *
 **/
export function addNick(user_id: string, guild_id: string) {
    return knexDb("Nick")
        .insert({ user_id, guild_id })
        .onConflict()
        .ignore()
        .then((result) => {
            log.debug(`Successfully inserted ${user_id}:${guild_id} into Nick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to insert record into Nick");
            throw err;
        });
}

/**
 * The user opts-out of the nick feature. Should delete a record in the Nick table.
 *
 **/
export function removeNick(user_id: string, guild_id: string) {
    return knexDb("Nick")
        .where({ user_id, guild_id })
        .del()
        .then((result) => {
            log.debug(`Successfully removed ${user_id}:${guild_id} from Nick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to delete record from Nick");
            throw err;
        });
}

/**
 * If the user and guild id exist in the Nick table, update the record.
 *
 **/
export function updateNick(
    user_id: string,
    guild_id: string,
    base_nick: string | null,
    gimmick_nick: string | null,
) {
    return knexDb("Nick")
        .where({ user_id, guild_id })
        .update({ base_nick, gimmick_nick })
        .then((result) => {
            log.debug(`Successfully updated ${user_id}:${guild_id} in Nick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to update record in Nick");
            throw err;
        });
}

/**
 * If the user and guild id exist in the Nick table, return the record.
 *
 **/
export function getNick(user_id: string, guild_id: string) {
    return knexDb("Nick")
        .first("base_nick", "gimmick_nick")
        .where({ user_id, guild_id })
        .then((result) => {
            log.debug(`Successfully retrieved ${user_id}:${guild_id} from Nick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to retrieve record from Nick");
            throw err;
        });
}
