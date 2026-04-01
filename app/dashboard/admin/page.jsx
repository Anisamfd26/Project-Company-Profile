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
import { Users, Briefcase, FileText, PlusCircle, Download, LogOut, LayoutDashboard, Menu, X, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin-login');
  };

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    pendingApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          alasan_apply,
          portfolio_submitted_url,
          profiles ( full_name, email, mahasiswa_details (prodi, semester, no_hp) ),
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
    { title: 'Total Mahasiswa', value: stats.totalStudents, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Lowongan Aktif', value: stats.totalJobs, icon: Briefcase, color: 'bg-green-100 text-green-600' },
    { title: 'Lamaran Pending', value: stats.pendingApplications, icon: FileText, color: 'bg-amber-100 text-amber-600' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  if (loading && recentApplications.length === 0) {
    return <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">Memuat dasbor...</div>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-[#00A59C]/20 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-50 shrink-0">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A59C] to-[#00D2C6] shadow-lg shadow-[#00A59C]/30 flex items-center justify-center text-white">
              <LayoutDashboard size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Admin<span className="text-[#00A59C]">Portal</span></span>
          </Link>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-800 bg-slate-50 p-2 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Navigasi Utama</p>
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00A59C]/10 text-[#00A59C] font-semibold transition-colors">
            <LayoutDashboard size={20} /> Ikhtisar Dasbor
          </Link>
          <Link href="/dashboard/admin/jobs/new" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Briefcase size={20} /> Kelola Lowongan
          </Link>
          <Link href="/dashboard/admin/news/new" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Newspaper size={20} /> Kelola Berita
          </Link>
        </div>

        <div className="p-4 border-t border-slate-50 shrink-0">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00A59C] font-bold text-lg">A</div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-800 truncate">Administrator</span>
                  <span className="text-xs text-slate-500 truncate">Super Admin</span>
                </div>
             </div>
             <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-xl px-4" onClick={handleLogout}>
               <LogOut className="w-5 h-5 mr-3" /> Keluar Sistem
             </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F8FAFC]">
        {/* Mobile Hamburger Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-6 lg:hidden shrink-0 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-slate-800 tracking-tight">Admin Portal</span>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full relative">
          <section className="pt-10 pb-8 px-6 lg:px-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#00A59C] opacity-5 blur-3xl pointer-events-none"></div>
            
            <div className="container mx-auto relative z-10 w-full max-w-6xl">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 md:px-10 rounded-[2rem] shadow-sm ring-1 ring-slate-100/50 border border-slate-100">
                <div>
                  <p className="text-[#00A59C] font-semibold tracking-wide text-sm mb-2 uppercase">Ruang Kendali</p>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Ikhtisar Panel ✨</h1>
                  <p className="text-slate-500 text-lg">Kelola operasional CDC dengan efisien dan terpusat.</p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Button asChild className="bg-[#00A59C] hover:bg-[#008F87] text-white shadow-lg shadow-[#00A59C]/20 rounded-full px-6 py-6 text-md font-semibold transition-transform hover:-translate-y-1 active:scale-95">
                    <Link href="/dashboard/admin/jobs/new"><PlusCircle className="mr-2 h-5 w-5" /> Lowongan Baru</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full px-6 py-6 text-md font-semibold border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-1">
                    <Link href="/dashboard/admin/news/new"><Newspaper className="mr-2 h-5 w-5" /> Buat Berita</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <main className="container mx-auto px-6 lg:px-10 pb-12 w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((item, index) => (
                <Card key={index} className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-5 bg-slate-50/30">
                    <CardTitle className="text-sm font-semibold text-slate-500 tracking-wider uppercase">{item.title}</CardTitle>
                    <div className={`p-2 rounded-xl shadow-sm ring-1 ring-slate-100/50 ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-6 pb-8">
                    <div className="text-5xl font-black text-slate-800 tracking-tight">{loading ? '...' : item.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white mb-12">
              <CardHeader className="border-b border-slate-50 px-6 py-5 bg-slate-50/30">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-[#00A59C] w-5 h-5"/> Lamaran Magang Terbaru</CardTitle>
                <CardDescription className="text-slate-400">Pemantauan interaktif untuk 5 aktivitas lamaran terakhir.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-slate-100 border-b-2">
                      <TableHead className="px-6 py-4 font-semibold text-slate-500">Mahasiswa</TableHead>
                      <TableHead className="font-semibold text-slate-500">Posisi</TableHead>
                      <TableHead className="font-semibold text-slate-500">Tanggal</TableHead>
                      <TableHead className="font-semibold text-slate-500">Status</TableHead>
                      <TableHead className="text-right px-6 font-semibold text-slate-500">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan="5" className="text-center py-10 text-slate-400 font-medium">Memuat data...</TableCell></TableRow>
                    ) : recentApplications.length > 0 ? (
                      recentApplications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                          <TableCell className="font-semibold text-slate-800 px-6 py-4 whitespace-nowrap">{app.profiles?.full_name || 'N/A'}</TableCell>
                          <TableCell className="text-slate-600">{app.lowongan_magang?.job_description || 'N/A'}</TableCell>
                          <TableCell className="text-slate-500 whitespace-nowrap font-medium">{new Date(app.applied_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusBadge(app.status)} shadow-sm whitespace-nowrap px-3 py-1 font-semibold`}>{app.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button variant="outline" size="sm" onClick={() => handlePreviewClick(app.id)} className="rounded-full shadow-none border border-slate-200 hover:bg-[#00A59C]/10 hover:text-[#00A59C] hover:border-[#00A59C]/30 transition-colors">
                              Lihat Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan="5" className="text-center py-16 text-slate-400 font-medium italic">Belum ada lamaran yang masuk.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Application Preview Dialog */}
        <Dialog open={!!selectedApp || isPreviewLoading} onOpenChange={(isOpen) => !isOpen && handleClosePreview()}>
          <DialogContent className="sm:max-w-3xl rounded-3xl overflow-hidden p-0 border-0 shadow-2xl">
            {isPreviewLoading && <div className="p-16 text-center text-slate-500 font-medium flex flex-col items-center justify-center h-64">Memuat informasi mendalam...</div>}
            {selectedApp && (
              <>
                <div className="bg-[#00A59C]/5 border-b border-[#00A59C]/10 p-8 pb-6 shadow-sm">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-800">Detail Lamaran</DialogTitle>
                    <DialogDescription className="text-slate-500 mt-2 text-md">
                      Pendaftaran untuk posisi <span className="font-semibold text-slate-700">{job.job_description}</span> di <span className="font-semibold text-slate-700">{job.company_name}</span>
                    </DialogDescription>
                  </DialogHeader>
                </div>
                
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 max-h-[65vh] overflow-y-auto">
                  {/* Kolom Kiri */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><User className="text-[#00A59C] w-5 h-5"/> Data Pelamar</h3>
                      <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 font-medium text-sm">Nama</span> <span className="font-semibold text-slate-800 text-right">{applicant.full_name}</span></div>
                        <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 font-medium text-sm">Email</span> <span className="font-semibold text-slate-800 text-right break-all">{applicant.email}</span></div>
                        <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 font-medium text-sm">No. Telepon</span> <span className="font-semibold text-slate-800 text-right">{applicantDetails?.no_hp || '-'}</span></div>
                        <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500 font-medium text-sm">Program Studi</span> <span className="font-semibold text-slate-800 text-right">{applicantDetails?.prodi || '-'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 font-medium text-sm">Semester</span> <span className="font-semibold text-slate-800 text-right">{applicantDetails?.semester || '-'}</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-3">Pesan Pengantar</h3>
                      <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-yellow-50/50 border border-yellow-100 p-5 rounded-2xl">
                        {selectedApp.alasan_apply || <span className="italic text-slate-400">Tidak ada pesan yang dicantumkan.</span>}
                      </div>
                    </div>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-4">Status & Kelengkapan</h3>
                      <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Saat Ini</p>
                          <Badge variant="outline" className={`${getStatusBadge(selectedApp.status)} px-3 py-1 font-bold text-sm shadow-sm`}>{selectedApp.status}</Badge>
                        </div>

                        {selectedApp.portfolio_submitted_url && (
                          <div className="pt-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dokumen CV / Portofolio</p>
                            <Button asChild variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50">
                              <a href={selectedApp.portfolio_submitted_url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4 text-[#00A59C]" /> Unduh Dokumen
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <Label htmlFor="status" className="font-bold text-slate-800 font-lg block mb-3">Otorisasi Status Baru</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger id="status" className="bg-white border-slate-200 rounded-xl h-12 shadow-sm font-semibold">
                            <SelectValue placeholder="Pilih status lamaran..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                            <SelectItem value="PENDING" className="font-medium cursor-pointer py-3 rounded-lg hover:bg-slate-50 focus:bg-slate-50">Tandai PENDING</SelectItem>
                            <SelectItem value="REVIEWED" className="font-medium text-blue-700 cursor-pointer py-3 rounded-lg hover:bg-blue-50 focus:bg-blue-50">Tandai SEDANG DIREVIEW</SelectItem>
                            <SelectItem value="ACCEPTED" className="font-medium text-green-700 cursor-pointer py-3 rounded-lg hover:bg-green-50 focus:bg-green-50">Terima Lamaran (ACCEPTED)</SelectItem>
                            <SelectItem value="REJECTED" className="font-medium text-red-700 cursor-pointer py-3 rounded-lg hover:bg-red-50 focus:bg-red-50">Tolak Lamaran (REJECTED)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border-t border-slate-100 p-6 px-8 rounded-b-3xl">
                  <DialogFooter className="sm:justify-end gap-3 w-full">
                    <Button type="button" variant="outline" onClick={handleClosePreview} className="rounded-xl px-6 border-slate-200">Tutup</Button>
                    <Button onClick={handleStatusUpdate} disabled={isUpdating || newStatus === selectedApp.status} className="bg-[#00A59C] hover:bg-[#008F87] text-white rounded-xl shadow-lg shadow-[#00A59C]/20 px-8 transition-transform active:scale-95">
                      {isUpdating ? 'Memproses...' : 'Simpan Pembaruan Status'}
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}