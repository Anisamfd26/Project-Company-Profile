'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/app/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/table';
import { Badge } from '@/app/components/badge';
import { User, FileText, Briefcase, Edit } from 'lucide-react';
import Link from 'next/link';

export default function MahasiswaDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch user profile and details
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            full_name,
            email,
            mahasiswa_details (
              prodi,
              semester,
              status
            )
          `)
          .eq('id', user.id)
          .single();

        if (profileError) console.error('Error fetching profile:', profileError);
        
        // Fetch user applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('aplikasi_magang')
          .select(`
            id,
            status,
            applied_at,
            lowongan_magang ( company_name, job_description )
          `)
          .eq('mahasiswa_id', user.id)
          .order('applied_at', { ascending: false });

        if (applicationsError) console.error('Error fetching applications:', applicationsError);

        setProfile(profileData);
        setApplications(applicationsData || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Memuat dasbor...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">Gagal memuat profil. Silakan login kembali.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dasbor Mahasiswa</h1>
              <p className="text-lg text-gray-600">Selamat datang, {profile.full_name}!</p>
            </div>
            <Button asChild>
              <Link href="/jobs"><Briefcase className="mr-2 h-4 w-4" /> Cari Lowongan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profil Saya</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/edit"><Edit className="h-4 w-4 mr-1" /> Edit</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Nama:</strong> {profile.full_name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Prodi:</strong> {profile.mahasiswa_details[0]?.prodi || 'Belum diisi'}</p>
              <p><strong>Semester:</strong> {profile.mahasiswa_details[0]?.semester || 'Belum diisi'}</p>
              <p><strong>Status:</strong> <Badge>{profile.mahasiswa_details[0]?.status || 'N/A'}</Badge></p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Lamaran Magang</CardTitle>
              <CardDescription>Lacak status semua lamaran yang telah Anda kirim.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Tanggal Lamar</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length > 0 ? applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.lowongan_magang?.job_description}</TableCell>
                      <TableCell>{app.lowongan_magang?.company_name}</TableCell>
                      <TableCell>{new Date(app.applied_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell><Badge className={getStatusBadge(app.status)}>{app.status}</Badge></TableCell>
                    </TableRow>
                  )) : <TableRow><TableCell colSpan="4" className="text-center">Anda belum pernah melamar.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
