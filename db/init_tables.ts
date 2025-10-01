import { ImnickTable } from "@db/Imnick";
import { knexDb } from "@db/knexfile";
import type { Knex } from "knex";

import pino from "pino";

const log = pino();

const tables = [ImnickTable];

export async function create_table_if_notexists(
    db: Knex,
    tableName: string,
    callback: (tableBuilder: Knex.CreateTableBuilder) => any,
): Promise<Knex.SchemaBuilder> {
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
        log.info(`${tableName} table not found. Creating table for ${tableName}.`);
        await db.schema.createTable(tableName, callback);
        log.info(`${tableName} table successfully initialized.`);
    } else {
        log.info(
            `Database already contains ${tableName} table. Skipping initialization.`,
        );
    }
}

export default async function init_tables(db: Knex = knexDb) {
    const trx = await db.transaction();
    for (const table of tables) {
        await create_table_if_notexists(trx, table.table_name, table.initialize);
    }
    await trx.commit();
}

export async function teardown(db: Knex = knexDb) {
    if (process.env.NODE_ENV === "production") {
        log.error(
            "`teardown` was called on a production database -- no action will be performed",
        );
        return;
    }
    for (const table of tables) {
        const tableExists = await db.schema.hasTable(table);
        if (tableExists) {
            await db.schema.dropTable(table);
        }
    }
    log.info("Successfully performed `teardown` on database");
}
