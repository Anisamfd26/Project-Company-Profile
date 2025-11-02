'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { Textarea } from '@/app/components/textarea'; // Asumsi Anda memiliki komponen ini
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

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

    const { error: insertError } = await supabase
      .from('lowongan_magang')
      .insert([job]);

    setLoading(false);

    if (insertError) {
      setError(`Gagal menyimpan: ${insertError.message}`);
    } else {
      setSuccess('Lowongan berhasil ditambahkan!');
      // Reset form
      setJob({
        company_name: '',
        company_description: '',
        company_logo_url: '',
        job_description: '',
        qualification: '',
        is_active: true,
      });
      // Arahkan kembali ke dasbor setelah beberapa saat
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tambah Lowongan Baru</h1>
              <p className="text-lg text-gray-600">Publikasikan kesempatan magang untuk mahasiswa.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dasbor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Form Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detail Lowongan</CardTitle>
            <CardDescription>Isi semua informasi yang diperlukan di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name">Nama Perusahaan</Label>
                  <Input id="company_name" name="company_name" value={job.company_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="job_description">Posisi yang Dibuka (cth: Frontend Developer Intern)</Label>
                  <Input id="job_description" name="job_description" value={job.job_description} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="company_description">Deskripsi Singkat Perusahaan</Label>
                <Textarea id="company_description" name="company_description" value={job.company_description} onChange={handleChange} rows={3} />
              </div>

              <div>
                <Label htmlFor="qualification">Kualifikasi yang Dibutuhkan</Label>
                <Textarea id="qualification" name="qualification" value={job.qualification} onChange={handleChange} required rows={5} placeholder="Sebutkan kualifikasi yang dibutuhkan, pisahkan dengan baris baru untuk setiap poin." />
              </div>

              <div>
                <Label htmlFor="company_logo_url">URL Logo Perusahaan</Label>
                <Input id="company_logo_url" name="company_logo_url" type="url" value={job.company_logo_url} onChange={handleChange} placeholder="https://example.com/logo.png" />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" name="is_active" checked={job.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-[#00A59C] focus:ring-[#00A59C]" />
                <Label htmlFor="is_active">Aktifkan lowongan ini (bisa dilihat publik)</Label>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-[#00A59C] text-white">
                  {loading ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}