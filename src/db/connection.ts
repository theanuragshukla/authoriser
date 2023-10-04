import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
require('dotenv').config()
const host = process.env.PG_HOST
const port = process.env.PG_PORT
const user = process.env.PG_USER
const password = process.env.PG_PASS
const database = process.env.PG_DB

const pool = new Pool({
    host,
    port: Number(port),
    user,
    password,
    database,
});

const db = () => drizzle(pool)

export default db()
