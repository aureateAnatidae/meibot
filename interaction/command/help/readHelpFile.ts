import { promises } from "node:fs";

/**
 * Please ensure that the inputs to this function are sanitized.
 **/
export default async function readHelpFile(filename: string) {
    return await promises.readFile(`./interaction/command/help/${filename}.md`, "utf-8");
}
