import { config } from "@db/knexfile";
import knex, { type Knex } from "knex";

import pino from "pino";

const log = pino();

const knexDb: Knex = knex(config);
export default async function init_tables() {
    const exists = await knexDb.schema.hasTable("User");
    if (!exists) {
        log.info("`User` table not found. Creating table for `User`.");
        knexDb.schema.createTable("User", (table) => {
            table.string("id");
            table.string("guild_id");
            table.string("base_nick");
            table.string("gimmick_nick");
        });
    } else {
        log.info(
            "Database already contains `User` table. Skipping initialization.",
        );
    }
}
