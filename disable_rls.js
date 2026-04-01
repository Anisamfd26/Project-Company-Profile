const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.lvekfodhplhhghkcyavb:CwmCLAtvOZzBUacs@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

const query = `
-- Disable RLS for the tables that are causing 403 Forbidden for the user
ALTER TABLE public.lowongan_magang DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita_acara DISABLE ROW LEVEL SECURITY;

-- If we ever want to re-enable them we can, but for now we let the frontend govern it.
`;

async function fixRLS() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        await client.query(query);
        console.log('✅ RLS has been successfully Disabled for Lowongan & Berita Tables!');
    } catch (err) {
        console.error('❌ Error disabling RLS:', err);
    } finally {
        await client.end();
    }
}
fixRLS();
