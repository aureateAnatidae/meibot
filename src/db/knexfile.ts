import knex, { type Knex } from "knex";

// TODO: https://knexjs.org/guide/#log
export const config = {
    client: "better-sqlite3",
    connection: {
        filename: "./meibot.db",
    },
    useNullAsDefault: true,
};

export const knexDb: Knex = knex(config);
