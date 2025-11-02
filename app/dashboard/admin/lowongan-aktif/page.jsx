
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { Input } from '@/app/components/input';
import { Label } from '@/app/components/label';
import { Textarea } from '@/app/components/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState({
    company_name: '',
    company_description: '',
    company_logo_url: '',
    job_description: '',
    qualification: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!params.id) return;
    const { data, error } = await supabase
      .from('lowongan_magang')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      alert('Gagal menemukan data lowongan.');
      router.push('/dashboard/admin/lowongan-aktif');
    } else {
      setJob(data);
    }
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

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

    const { error: updateError } = await supabase
      .from('lowongan_magang')
      .update(job)
      .eq('id', params.id);

    setLoading(false);

    if (updateError) {
      setError(`Gagal memperbarui: ${updateError.message}`);
    } else {
      setSuccess('Lowongan berhasil diperbarui!');
      setTimeout(() => {
        router.push('/dashboard/admin/lowongan-aktif');
      }, 2000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat data lowongan...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">Edit Lowongan</h1>
          <p className="text-lg text-gray-600">Perbarui detail untuk: {job.job_description}</p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Detail Lowongan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name">Nama Perusahaan</Label>
                  <Input id="company_name" name="company_name" value={job.company_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="job_description">Posisi yang Dibuka</Label>
                  <Input id="job_description" name="job_description" value={job.job_description} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="company_description">Deskripsi Singkat Perusahaan</Label>
                <Textarea id="company_description" name="company_description" value={job.company_description} onChange={handleChange} rows={3} />
              </div>
              <div>
                <Label htmlFor="qualification">Kualifikasi</Label>
                <Textarea id="qualification" name="qualification" value={job.qualification} onChange={handleChange} required rows={5} />
              </div>
              <div>
                <Label htmlFor="company_logo_url">URL Logo Perusahaan</Label>
                <Input id="company_logo_url" name="company_logo_url" type="url" value={job.company_logo_url} onChange={handleChange} />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_active" name="is_active" checked={job.is_active} onChange={handleChange} className="h-4 w-4" />
                <Label htmlFor="is_active">Aktifkan lowongan ini</Label>
              </div>
              {error && <div className="text-red-600">{error}</div>}
              {success && <div className="text-green-600">{success}</div>}
              <div className="flex justify-between items-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/admin/lowongan-aktif"><ArrowLeft className="mr-2 h-4 w-4" /> Batal</Link>
                </Button>
                <Button type="submit" disabled={loading} className="bg-[#00A59C] text-white">
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

