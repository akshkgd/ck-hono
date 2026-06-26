import pg from 'pg';
import 'dotenv/config';
async function main() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("DATABASE_URL environment variable is not defined");
        process.exit(1);
    }
    const match = dbUrl.match(/\/([^/]+)$/);
    if (!match) {
        console.error("Could not parse database name from DATABASE_URL");
        process.exit(1);
    }
    const dbName = match[1];
    const defaultDbUrl = dbUrl.substring(0, dbUrl.lastIndexOf('/')) + '/postgres';
    console.log(`Connecting to default database to verify/create '${dbName}'...`);
    const pool = new pg.Pool({ connectionString: defaultDbUrl });
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database '${dbName}' does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created successfully.`);
        }
        else {
            console.log(`Database '${dbName}' already exists.`);
        }
        client.release();
    }
    catch (err) {
        console.error("Failed to initialize database:", err);
        process.exit(1);
    }
    finally {
        await pool.end();
    }
}
main();
