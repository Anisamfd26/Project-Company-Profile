'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/app/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/table';
import { Badge } from '@/app/components/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/select';
import { Label } from '@/app/components/label';
import { Users, Briefcase, FileText, PlusCircle, Download } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    pendingApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk preview modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = useCallback(async () => {
      setLoading(true);

      // Fetch stats
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'MAHASISWA');

      const { count: jobCount } = await supabase
        .from('lowongan_magang')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: appCount } = await supabase
        .from('aplikasi_magang')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      // Fetch recent applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('aplikasi_magang')
        .select(`
          id,
          status,
          applied_at,
          profiles ( full_name ),
          lowongan_magang ( company_name, job_description )
        `)
        .order('applied_at', { ascending: false })
        .limit(5);

      if (applicationsError) {
        console.error('Error fetching recent applications:', applicationsError);
      }

      setStats({
        totalStudents: studentCount || 0,
        totalJobs: jobCount || 0,
        pendingApplications: appCount || 0,
      });
      setRecentApplications(applicationsData || []);
      setLoading(false);
    }
  , []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = [
    { title: 'Total Mahasiswa', value: stats.totalStudents, icon: Users, color: 'text-blue-500' },
    { title: 'Lowongan Aktif', value: stats.totalJobs, icon: Briefcase, color: 'text-green-500' },
    { title: 'Lamaran Pending', value: stats.pendingApplications, icon: FileText, color: 'text-yellow-500' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePreviewClick = async (appId) => {
    setIsPreviewLoading(true);
    setSelectedApp(null);

    const { data, error } = await supabase
      .from('aplikasi_magang')
      .select(`
        *,
        profiles (full_name, email, mahasiswa_details (*)),
        lowongan_magang (job_description, company_name)
      `)
      .eq('id', appId)
      .single();

    if (error || !data) {
      alert('Gagal memuat detail lamaran.');
    } else {
      setSelectedApp(data);
      setNewStatus(data.status);
    }
    setIsPreviewLoading(false);
  };

  const handleClosePreview = () => {
    setSelectedApp(null);
    setNewStatus('');
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;

    setIsUpdating(true);
    const { error } = await supabase
      .from('aplikasi_magang')
      .update({ status: newStatus })
      .eq('id', selectedApp.id);

    if (error) {
      alert(`Gagal memperbarui status: ${error.message}`);
    } else {
      alert('Status berhasil diperbarui!');
      // Update status di UI secara langsung
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
      // Refresh data tabel di background
      fetchData();
    }
    setIsUpdating(false);
  };

  // Helper untuk mendapatkan detail dari preview app
  const applicant = selectedApp?.profiles;
  const applicantDetails = applicant?.mahasiswa_details?.[0];
  const job = selectedApp?.lowongan_magang;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dasbor Admin</h1>
              <p className="text-lg text-gray-600">Selamat datang kembali, Admin!</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/admin/jobs/new"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Lowongan</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/admin/news/new"><PlusCircle className="mr-2 h-4 w-4" /> Buat Berita</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((item) => (
            <Link href={`/dashboard/admin/${item.title.toLowerCase().replace(' ', '-')}`} key={item.title}>
              <Card className="hover:bg-gray-50 transition-colors duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : item.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lamaran Magang Terbaru</CardTitle>
            <CardDescription>5 lamaran terakhir yang masuk dari mahasiswa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="5" className="text-center">Memuat data...</TableCell></TableRow>
                ) : recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.profiles?.full_name || 'N/A'}</TableCell>
                      <TableCell>{app.lowongan_magang?.job_description || 'N/A'}</TableCell>
                      <TableCell>{new Date(app.applied_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(app.status)}>{app.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handlePreviewClick(app.id)}>
                          Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan="5" className="text-center">Belum ada lamaran.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Application Preview Dialog */}
      <Dialog open={!!selectedApp || isPreviewLoading} onOpenChange={(isOpen) => !isOpen && handleClosePreview()}>
        <DialogContent className="sm:max-w-3xl">
          {isPreviewLoading && <div className="p-8 text-center">Memuat detail lamaran...</div>}
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Detail Lamaran</DialogTitle>
                <DialogDescription>
                  Lamaran untuk posisi <span className="font-semibold">{job.job_description}</span> oleh <span className="font-semibold">{applicant.full_name}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-4">
                {/* Kolom Kiri */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Info Pelamar</h3>
                  <p><strong>Nama:</strong> {applicant.full_name}</p>
                  <p><strong>Email:</strong> {applicant.email}</p>
                  <p><strong>No. HP:</strong> {applicantDetails?.no_hp || 'N/A'}</p>
                  <p><strong>Prodi:</strong> {applicantDetails?.prodi || 'N/A'}</p>
                  <p><strong>Semester:</strong> {applicantDetails?.semester || 'N/A'}</p>
                  
                  <h3 className="font-semibold text-lg pt-4">Alasan Melamar</h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{selectedApp.alasan_apply}</p>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Status & Aksi</h3>
                  <div>
                    <p className="text-sm font-medium mb-1">Status Saat Ini:</p>
                    <Badge className={getStatusBadge(selectedApp.status)}>{selectedApp.status}</Badge>
                  </div>

                  {selectedApp.portfolio_submitted_url && (
                    <div>
                      <p className="text-sm font-medium mb-1">Portofolio/CV:</p>
                      <Button asChild variant="outline" className="w-full">
                        <a href={selectedApp.portfolio_submitted_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Buka Dokumen
                        </a>
                      </Button>
                    </div>
                  )}

                  <hr className="my-4"/>

                  <div>
                    <Label htmlFor="status" className="text-sm font-medium">Ubah Status Lamaran</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="status" className="mt-1">
                        <SelectValue placeholder="Pilih status baru..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWED">Direview</SelectItem>
                        <SelectItem value="ACCEPTED">Diterima</SelectItem>
                        <SelectItem value="REJECTED">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="sm:justify-end gap-2">
                <Button type="button" variant="secondary" onClick={handleClosePreview}>Tutup</Button>
                <Button onClick={handleStatusUpdate} disabled={isUpdating || newStatus === selectedApp.status} className="bg-[#00A59C] text-white">
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}