// test_db.js
const { Client } = require('pg');

// *******************************************************************
// DATA DARI PROJECT BARU KAMU:
// URL: lvekfodhplhhghkcyavb.supabase.co
// Password: CwmCLAtvOZzBUacs
// *******************************************************************

// Format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
const DATABASE_URL = 'postgresql://postgres.lvekfodhplhhghkcyavb:CwmCLAtvOZzBUacs@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function testConnection() {
    console.log('--- UJI KONEKSI SUPABASE (POSTGRES) ---');
    console.log(`Mencoba terhubung ke project: lvekfodhplhhghkcyavb`);

    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Penting untuk koneksi ke Supabase dari luar
        }
    });

    try {
        await client.connect();
        console.log('✅ BERHASIL! Koneksi Database Supabase Sukses.');
        
        // Coba query sederhana untuk cek tabel
        const res = await client.query('SELECT current_database(), now()');
        console.log('Waktu Server Database:', res.rows[0].now);
        console.log('✅ Query Berhasil Dijalankan.');

    } catch (err) {
        console.log('❌ GAGAL! Terjadi Error Koneksi.');
        console.error('Pesan Error Detail:', err.message);
        
        if (err.message.includes('password authentication failed')) {
            console.log('\nSOLUSI: Password "CwmCLAtvOZzBUacs" sepertinya belum aktif atau salah ketik.');
        }
    } finally {
        await client.end();
        console.log('--- UJI SELESAI ---');
    }
}

testConnection();