export interface Imnick {
    imnick_id: number;
    base_nick: string;
    gimmick_nick: string;
}

export const ImnickTable = {
    table_name: "Imnick",
    initialize(table) {
        table.increments("imnick_id").primary();
        table.string("base_nick").nullable();
        table.string("gimmick_nick").nullable();
    },
};

export function addImnick(id: string, guild_id: string) {}

export function removeImnick();
