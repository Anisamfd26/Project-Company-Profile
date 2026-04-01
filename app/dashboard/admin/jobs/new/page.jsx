'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { Textarea } from '@/app/components/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { ArrowLeft, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [job, setJob] = useState({
    company_name: '',
    company_description: '',
    company_logo_url: '',
    job_description: '',
    qualification: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 🔴 SECURITY CHECK: Verify session before posting
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setLoading(false);
      setError("Akses ditolak: Anda tidak memiliki sesi aktif. Silakan Logout dan Login kembali sebagai Admin.");
      return;
    }

    const { error: insertError } = await supabase
      .from('lowongan_magang')
      .insert([job]);

    setLoading(false);

    if (insertError) {
      setError(`Gagal menyimpan: ${insertError.message}`);
    } else {
      setSuccess('Lowongan berhasil ditambahkan!');
      setJob({
        company_name: '',
        company_description: '',
        company_logo_url: '',
        job_description: '',
        qualification: '',
        is_active: true,
      });
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#00A59C]/20 relative pb-16">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#00A59C] opacity-5 blur-3xl pointer-events-none"></div>
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="text-slate-500 hover:text-[#00A59C] hover:bg-[#00A59C]/10 transition-colors rounded-full px-4 -ml-4">
              <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00A59C] to-[#00D2C6] shadow-md shadow-[#00A59C]/30 flex items-center justify-center text-white">
              <Briefcase size={16} />
            </div>
            <span className="font-bold tracking-tight text-slate-800">Admin<span className="text-[#00A59C]">Portal</span></span>
          </div>
        </div>
      </nav>

      {/* Main Form Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Publikasi <span className="text-[#00A59C]">Lowongan</span></h1>
          <p className="text-lg text-slate-500">Tambahkan kesempatan magang baru untuk diakses oleh mahasiswa.</p>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 px-8 py-6 bg-slate-50/30">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800"><Briefcase className="text-[#00A59C] w-5 h-5"/> Detail Perusahaan & Posisi</CardTitle>
            <CardDescription className="text-slate-500">Pastikan informasi diisi dengan lengkap dan akurat.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-slate-700 font-semibold">Nama Perusahaan*</Label>
                  <Input id="company_name" name="company_name" value={job.company_name} onChange={handleChange} required className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="PT Contoh Nama..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_description" className="text-slate-700 font-semibold">Posisi yang Dibuka*</Label>
                  <Input id="job_description" name="job_description" value={job.job_description} onChange={handleChange} required className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="Frontend Developer Intern" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_description" className="text-slate-700 font-semibold">Deskripsi Singkat Perusahaan</Label>
                <Textarea id="company_description" name="company_description" value={job.company_description} onChange={handleChange} rows={3} className="rounded-xl border-slate-200 focus:bg-slate-50 resize-y shadow-sm" placeholder="Ceritakan sedikit tentang bidang industri perusahaan..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification" className="text-slate-700 font-semibold">Kualifikasi yang Dibutuhkan*</Label>
                <Textarea id="qualification" name="qualification" value={job.qualification} onChange={handleChange} required rows={5} className="rounded-xl border-slate-200 focus:bg-slate-50 resize-y shadow-sm" placeholder="1. Mahasiswa semester 5-7...&#10;2. Menguasai React JS...&#10;3. Berkomunikasi dengan baik..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_logo_url" className="text-slate-700 font-semibold">URL Logo Perusahaan (Opsional)</Label>
                <Input id="company_logo_url" name="company_logo_url" type="url" value={job.company_logo_url} onChange={handleChange} className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="https://example.com/logo.png" />
              </div>

              <div className="flex items-center space-x-3 p-5 bg-slate-50 rounded-xl border border-slate-200/60 mt-4 shadow-sm">
                <input type="checkbox" id="is_active" name="is_active" checked={job.is_active} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-[#00A59C] focus:ring-[#00A59C]" />
                <Label htmlFor="is_active" className="text-slate-700 font-bold cursor-pointer select-none">Seketika Publikasikan Lowongan Ini ke Publik</Label>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 text-sm text-[#00A59C] bg-[#00A59C]/10 p-4 rounded-xl border border-[#00A59C]/20 shadow-sm">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{success}</span>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-slate-50">
                <Button type="submit" disabled={loading} className="bg-[#00A59C] hover:bg-[#008F87] text-white rounded-xl shadow-lg shadow-[#00A59C]/20 px-8 py-6 h-auto text-md font-bold transition-transform active:scale-95">
                  {loading ? 'Menyimpan...' : 'Simpan & Publikasikan Lowongan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}