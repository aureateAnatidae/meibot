import { knexDb } from "@db/knexfile";
import pino from "pino";

const log = pino();

export interface Imnick {
    user_id: string;
    guild_id: string;
    base_nick: string | null;
    gimmick_nick: string | null;
}

export const ImnickTable = {
    table_name: "Imnick",
    initialize(table) {
        table.primary(["user_id", "guild_id"]);
        table.string("user_id");
        table.string("guild_id");

        table.string("base_nick").nullable();
        table.string("gimmick_nick").nullable();
    },
};

/**
 * The user opts-in to the imnick feature. Should create a new record in the Imnick table.
 *
 **/
export function addImnick(user_id: string, guild_id: string) {
    return knexDb("Imnick")
        .insert({ user_id, guild_id })
        .onConflict()
        .ignore()
        .then((result) => {
            log.debug(`Successfully inserted ${user_id}:${guild_id} into Imnick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to insert record into Imnick");
            throw err;
        });
}

/**
 * The user opts-out of the imnick feature. Should delete a record in the Imnick table.
 *
 **/
export function removeImnick(user_id: string, guild_id: string) {
    return knexDb("Imnick")
        .where({ user_id, guild_id })
        .del()
        .then((result) => {
            log.debug(`Successfully removed ${user_id}:${guild_id} from Imnick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to delete record from Imnick");
            throw err;
        });
}

/**
 * If the user and guild id exist in the Imnick table, update the record.
 *
 **/
export function updateImnick(
    user_id: string,
    guild_id: string,
    base_nick: string | null,
    gimmick_nick: string | null,
) {
    return knexDb("Imnick")
        .where({ user_id, guild_id })
        .update({ base_nick, gimmick_nick })
        // .returning(["base_nick", "gimmick_nick"])
        .then((result) => {
            log.debug(`Successfully updated ${user_id}:${guild_id} in Imnick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to update record in Imnick");
            throw err;
        });
}

/**
 * If the user and guild id exist in the Imnick table, return the record.
 *
 **/
export function getImnick(user_id: string, guild_id: string) {
    return knexDb("Imnick")
        .first("base_nick", "gimmick_nick")
        .where({ user_id, guild_id })
        .then((result) => {
            log.debug(`Successfully retrieved ${user_id}:${guild_id} from Imnick`);
            return result;
        })
        .catch((err) => {
            log.error(err, "Failed to retrieve record from Imnick");
            throw err;
        });
}
