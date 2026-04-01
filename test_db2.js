const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.lvekfodhplhhghkcyavb:CwmCLAtvOZzBUacs@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function testConnection() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        const res = await client.query('SELECT id, email, role FROM profiles');
        console.log('Semua Profil:');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
testConnection();
