import { executeSqlFile, pool } from "../server/db";
async function run() {
    await executeSqlFile("db/schema/schema.sql");
    // eslint-disable-next-line no-console
    console.log("Schema created.");
    await pool.end();
}
run().catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await pool.end();
    process.exit(1);
});
