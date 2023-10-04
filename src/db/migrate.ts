const {Client} = require("pg")
const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");

require('dotenv').config()

const host = process.env.PG_HOST
const port = process.env.PG_PORT
const user = process.env.PG_USER
const password = process.env.PG_PASS
const database = process.env.PG_DB

const client = new Client({
    host,
    port: Number(port),
    user,
    password,
    database,
});

const migrateInit = async () => {
    await client.connect();
    const db = drizzle(client)

    migrate(db, { migrationsFolder: "./src/db/migrations" })
        .then(() => {
            console.log("Migrations complete!");
            process.exit(0);
        })
        .catch((err: any) => {
            console.error("Migrations failed!", err);
            process.exit(1);
        });
}


migrateInit()
