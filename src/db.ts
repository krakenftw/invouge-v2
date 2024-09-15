import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sessions, users } from "./schema";
import * as schema from '@/schema';


const client = new Client({
    connectionString: process.env.DATABASE_URL,
});;


async function connect() {
    await client.connect()
}
connect()
export const db = drizzle(client, { schema });


export const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);