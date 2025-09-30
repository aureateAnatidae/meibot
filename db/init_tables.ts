import { ImnickTable } from "@db/Imnick";
import { knexDb } from "@db/knexfile";
import { UserTable } from "@db/User";
import type { Knex } from "knex";

import pino from "pino";

const log = pino();

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

export default async function init_tables() {
    const tables = [ImnickTable, UserTable];
    const trx = await knexDb.transaction();
    for (const table of tables) {
        await create_table_if_notexists(trx, table.table_name, table.initialize);
    }
    await trx.commit()
}
