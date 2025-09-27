import { knex } from "knex";


// TODO: https://knexjs.org/guide/#log
export const config = {
    client: "better-sqlite3",
    connection: {
        filename: "./meibot.db",
    },
};
