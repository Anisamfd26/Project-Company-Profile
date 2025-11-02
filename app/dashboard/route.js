import { supabaseAdmin } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Tambahkan otentikasi di sini untuk memeriksa apakah pengguna adalah ADMIN
  // Untuk saat ini, kita langsung ambil datanya menggunakan service_role
  
  // Gunakan client admin untuk mengambil data dari sisi server
  const { data: applications, error } = await supabaseAdmin
    .from('aplikasi_magang') // Nama tabel yang Anda buat di Supabase
    .select(`
      id,
      status,
      alasan_apply,
      portfolio_submitted_url,
      applied_at,
      profiles ( id, full_name, email ),
      lowongan_magang ( id, company_name, job_description )
    `); // Ini adalah contoh join query

  if (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications });
}