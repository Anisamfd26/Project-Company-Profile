// test_db.js
const { Client } = require('pg');

// *******************************************************************
// PERHATIAN:
// 1. GANTI [PASSWORD_BARU_ANDA] dengan password Anda yang AKTIF di Supabase.
// 2. Kita menggunakan IP Pooler (18.140.126.126) dan port 6543 untuk menghindari masalah DNS.
// *******************************************************************
const DATABASE_URL = 'postgresql://postgres:[PASSWORD_BARU_ANDA]@18.140.126.126:6543/postgres?sslmode=require';

async function testConnection() {
    console.log('--- UJI KONEKSI POSTGRES ---');
    console.log(`Mencoba terhubung ke: 18.140.126.126:6543/postgres`);

    const client = new Client({
        connectionString: DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('✅ BERHASIL! Koneksi Database Sukses.');
        console.log('Ini berarti: Password Anda BENAR dan Jaringan Anda TIDAK memblokir Supabase.');
        
        // Coba query sederhana
        const res = await client.query('SELECT 1 as result');
        if (res.rows[0].result === 1) {
            console.log('✅ Query Uji Coba Berhasil Dijalankan.');
        }

    } catch (err) {
        console.log('❌ GAGAL! Terjadi Error Koneksi Database.');
        
        if (err.code === '28P01') {
            console.log('\n*** ERROR AUTENTIKASI ***');
            console.log('Penyebab: Password SALAH. (Cek Database Password di Supabase Settings Anda).');
        } else if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
             console.log('\n*** ERROR JARINGAN / HOSTNAME ***');
             console.log('Penyebab: Hostname tidak ditemukan. (Cek URL Supabase Anda, atau matikan VPN/Firewall).');
        } else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
            console.log('\n*** ERROR FIREWALL / JARINGAN ***');
            console.log('Penyebab: Koneksi ditolak atau Timeout. (Jaringan atau Firewall Anda kemungkinan memblokir port 6543).');
        } else {
             console.log('\n*** ERROR UMUM ***');
             console.error('Pesan Error Detail:', err.message);
        }

    } finally {
        await client.end().catch(e => console.error("Error saat menutup koneksi:", e.message));
        console.log('--- UJI SELESAI ---');
    }
}

testConnection();