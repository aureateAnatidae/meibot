/** Tests for the `Imnick` entity.
 * Each user should be able to opt-in and opt-out to the nickname change gimmick by guild.
 * If a user in a guild has no matching user and guild id in this table, then the user has opted
 * out. Opting out should prevent the nickname gimmick from affecting that user.
 *
 * Upon changing the user's name, the next message should change the user's name
 * back to their original name. That original name, as well as the new name,
 * is stored in the "Imnick" table.
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
 *   2. The user has opted in (user.id and guild.id match a composite user_id and guild_id in
 *      the `Imnick` table)
 *   3. The user's matching `Imnick` base_nick is NULL (that is, no gimmick has occurred)
 *
 * In addition, a message SHALL change the nickname of the author to the 'base_nick' iff:
 *   1. Either condition may be fulfilled:
 *       1.1 The message does not match the regex
 *       1.2 The message matches the regex, but the random chance is not fulfilled
 *   2. The user has opted in (user.id and guild.id match a composite user_id and guild_id in
 *      the `Imnick` table)
 *   3. The user's current nickname matches `gimmick_nick` i.e. was set by this bot
 *       3.1 If it does not match the `gimmick_nick` entry in the `Imnick` table, the
 *      `base_nick` and `gimmick_nick` SHOULD both be set to NULL.
 *
 **/

import { addImnick, removeImnick } from "@db/Imnick";
import init_tables, { teardown } from "@db/init_tables";
import { test_knexDb } from "@db/tests/common";
import { User } from "discord.js";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("discord.js");

test("/set-property", () => {
    beforeAll(async () => {
        await teardown(test_knexDb);
    });

    beforeEach(async () => {
        await init_tables(test_knexDb);
    });

    afterEach(async () => {
        await teardown(test_knexDb);
    });

    describe("Add user to Imnick", () => {
        test("New user to Imnick in a new guild", () => {});
    });
});
