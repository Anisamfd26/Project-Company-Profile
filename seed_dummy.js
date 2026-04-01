const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.lvekfodhplhhghkcyavb:CwmCLAtvOZzBUacs@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

const jobs = [
    {
        company_name: 'PT Tokopedia',
        company_description: 'Perusahaan teknologi yang menaungi e-commerce terbesar di Indonesia.',
        company_logo_url: 'https://logo.clearbit.com/tokopedia.com',
        job_description: 'Software Engineer Intern',
        qualification: '1. Mahasiswa Teknik Informatika / Ilmu Komputer\n2. Memahami konsep Data Structure & Algorithm\n3. Bersedia WFO di Jakarta Selatan 2x seminggu',
        is_active: true
    },
    {
        company_name: 'Gojek (GoTo Group)',
        company_description: 'Decacorn pertama Indonesia yang bergerak di bidang layanan on-demand, fintech, dan e-commerce.',
        company_logo_url: 'https://logo.clearbit.com/gojek.com',
        job_description: 'UI/UX Product Designer Intern',
        qualification: '1. Portofolio design (Figma/Framer)\n2. Memahami User-Centered Design\n3. Kreatif dan memiliki inisiatif tinggi',
        is_active: true
    },
    {
        company_name: 'Traveloka',
        company_description: 'Lifestyle superapp di Asia Tenggara, menawarkan tiket penerbangan, hotel, dan lain-lain.',
        company_logo_url: 'https://logo.clearbit.com/traveloka.com',
        job_description: 'Data Analyst Intern',
        qualification: '1. Menguasai SQL dan Python\n2. Mampu membuat visualisasi data dengan Tableau/Looker\n3. Analitis dan teliti',
        is_active: true
    },
    {
        company_name: 'Ruangguru',
        company_description: 'Perusahaan startup teknologi pendidikan (ed-tech) terbesar di Asia Tenggara.',
        company_logo_url: 'https://logo.clearbit.com/ruangguru.com',
        job_description: 'Digital Marketing Intern',
        qualification: '1. Menyukai social media marketing\n2. Cepat tanggap terhadap trend terkini\n3. Mahasiswa ilmu komunikasi atau bisnis',
        is_active: true
    },
    {
        company_name: 'Shopee Indonesia',
        company_description: 'Platform e-commerce terdepan di Asia Tenggara dan Taiwan.',
        company_logo_url: 'https://logo.clearbit.com/shopee.com',
        job_description: 'Frontend Developer Intern',
        qualification: '1. Memiliki pengalaman menggunakan React/Next.js\n2. Menguasai HTML, CSS, JavaScript (ES6)\n3. Mahir menggunakan Git',
        is_active: true
    }
];

const news = [
    {
        title: 'Job Fair Nasional CDC Cakrawala 2026',
        category: 'Acara',
        event_date: '2026-05-15 09:00:00',
        content: 'IKUTI Bursa Kerja Nasional Terbesar tahun ini yang diselenggarakan oleh CDC Cakrawala. Job Fair ini akan mendatangkan lebih dari 50+ perusahaan teknologi ternama termasuk unicorn dan decacorn Indonesia. Jangan lupa bawa ratusan fotokopi CV kalian dan daftarkan diri segera melalui portal utama CDC!',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
    },
    {
        title: '5 Tips Ampuh Lolos Wawancara Magang di Startup',
        category: 'Tips',
        event_date: null,
        content: 'Wawancara magang di Startup sering kali memakan tekanan besar. Para recruiter startup mencari kandidat yang bukan hanya pintar secara akademis, tapi punya inisiatif tinggi dan budaya "agility". Berikut adalah 5 cara kamu bisa memperlihatkan value diri kamu di mata tim rekruitmen...',
        image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
    },
    {
        title: 'Seminar: Merintis Karir di Era Artificial Intelligence',
        category: 'Acara',
        event_date: '2026-04-20 13:00:00',
        content: 'Pernah takut pekerjaan kita akan diambil alih oleh AI seperti ChatGPT? Di seminar eksklusif CDC Cakrawala kali ini, kita akan membahas cara beradaptasi dengan teknologi dan memanfaatkan AI sebagai asisten utama kita di dunia kerja profesional.',
        image_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80'
    },
    {
        title: 'Kunjungan Industri Mahasiswa ke Kantor Google Indonesia',
        category: 'Berita',
        event_date: null,
        content: 'Sebanyak 30 mahasiswa terpilih dari Fakultas Ilmu Komputer baru saja diundang untuk datang eksklusif ke kantor Google Indonesia (Google Office) yang terletak di Pacific Century Place, SCBD. Mahasiswa disambut langsung oleh tim HR Google dan diajak melihat budaya kerja secara nyata.',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
    },
    {
        title: 'Mengapa UI/UX Designer Menjadi Posisi Magang Paling Dicari?',
        category: 'Tips',
        event_date: null,
        content: 'Era digital menuntut semua perusahaan memiliki aplikasi. Akibatnya, Lowongan Product Designer dan UI/UX melonjak tajam dalam 3 tahun terakhir! Bagi kalian yang tertarik pindah karir atau berfokus ke Human-Computer Interaction, yuk bangun portofolio UI/UX yang kokoh mulai dari semester 3.',
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80'
    }
];

async function seed() {
    console.log('Menghubungkan ke Database untuk injeksi data Dummy berkualitas...');
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        // Kosongkan tabel (hapus data lama) opsional:
        // Kita tidak akan truncate karena beresiko menghapus rekam jejak.
        // Langsung insert saja

        console.log('Menyuntikkan 5 Lowongan Magang...');
        for (const j of jobs) {
            await client.query(
                `INSERT INTO public.lowongan_magang (company_name, company_description, company_logo_url, job_description, qualification, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [j.company_name, j.company_description, j.company_logo_url, j.job_description, j.qualification, j.is_active]
            );
        }

        console.log('Menyuntikkan 5 Berita & Acara...');
        for (const n of news) {
            await client.query(
                `INSERT INTO public.berita_acara (title, category, event_date, content, image_url)
                 VALUES ($1, $2, $3, $4, $5)`,
                [n.title, n.category, n.event_date, n.content, n.image_url]
            );
        }

        console.log('✅ INJEKSI DATA DUMMY SELESAI BERSERTA GAMBAR!');
    } catch (err) {
        console.error('Terjadi error:', err);
    } finally {
        await client.end();
    }
}

seed();
