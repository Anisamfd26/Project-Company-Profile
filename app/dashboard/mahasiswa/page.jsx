'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/app/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/table';
import { Badge } from '@/app/components/badge';
import { User, FileText, Briefcase, Edit, LogOut, GraduationCap, LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MahasiswaDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEWED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">Memuat dasbor...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">Gagal memuat profil. Silakan login kembali.</div>;
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
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">CDC <span className="text-[#00A59C]">Student</span></span>
          </Link>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-800 bg-slate-50 p-2 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Navigasi Utama</p>
          <Link href="/dashboard/mahasiswa" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00A59C]/10 text-[#00A59C] font-semibold transition-colors">
            <LayoutDashboard size={20} /> Ruang Mahasiswa
          </Link>
          <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Briefcase size={20} /> Jelajahi Lowongan
          </Link>
          <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <User size={20} /> Edit Profil Saya
          </Link>
        </div>

        <div className="p-4 border-t border-slate-50 shrink-0">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00A59C] font-bold text-lg">{profile.full_name?.charAt(0) || 'M'}</div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-slate-800 truncate">{profile.full_name}</span>
                  <span className="text-xs text-slate-500 truncate">{profile.mahasiswa_details[0]?.prodi || 'Mahasiswa'}</span>
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
          <span className="ml-4 font-bold text-slate-800 tracking-tight">Ruang Mahasiswa</span>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full relative">
          <section className="pt-10 pb-8 px-6 lg:px-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#00A59C] opacity-5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-amber-400 opacity-5 blur-3xl pointer-events-none"></div>
            
            <div className="container mx-auto relative z-10 w-full max-w-6xl">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 md:px-10 rounded-[2rem] shadow-sm ring-1 ring-slate-100/50 border border-slate-100">
                <div>
                  <p className="text-[#00A59C] font-semibold tracking-wide text-sm mb-2 uppercase">Selamat Datang</p>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Halo, {profile.full_name}! 👋</h1>
                  <p className="text-slate-500 text-lg">Kelola profil akademik dan pantau perjalanan karir magangmu.</p>
                </div>
                <Button asChild className="bg-[#00A59C] hover:bg-[#008F87] text-white shadow-lg shadow-[#00A59C]/20 rounded-full px-8 py-6 text-md font-semibold transition-transform hover:-translate-y-1 active:scale-95 shrink-0">
                  <Link href="/jobs"><Briefcase className="mr-3 h-5 w-5" /> Jelajahi Lowongan</Link>
                </Button>
              </div>
            </div>
          </section>

          <main className="container mx-auto px-6 lg:px-10 pb-12 w-full max-w-6xl grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-1">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-5 bg-slate-50/30">
                  <CardTitle className="text-xl font-bold flex items-center gap-2"><User className="text-[#00A59C] w-5 h-5"/> Profil Saya</CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-[#00A59C] hover:bg-[#00A59C]/10 rounded-full shadow-none border-0 ring-1 ring-[#00A59C]/20">
                    <Link href="/profile/edit"><Edit className="h-4 w-4 mr-1" /> Edit</Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-5 text-slate-600">
                  <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Lengkap</span> <span className="font-semibold text-slate-900">{profile.full_name}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Terdaftar</span> <span className="font-semibold text-slate-900">{profile.email}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Program Studi</span> <span className="font-semibold text-slate-900">{profile.mahasiswa_details[0]?.prodi || 'Belum diisi'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Semester Saat Ini</span> <span className="font-semibold text-slate-900">{profile.mahasiswa_details[0]?.semester || 'Belum diisi'}</span></div>
                  <div className="flex flex-col gap-1 pt-2 border-t border-slate-50"><span className="text-xs font-semibold text-slate-400 uppercase mb-2">Status Mahasiswa</span> <div><Badge variant="outline" className={`px-3 py-1 font-bold ${profile.mahasiswa_details[0]?.status === 'AKTIF' ? 'bg-[#00A59C]/10 text-[#00A59C] border-[#00A59C]/30' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{profile.mahasiswa_details[0]?.status || 'N/A'}</Badge></div></div>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-2">
              <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white h-full pb-6">
                <CardHeader className="border-b border-slate-50 px-6 py-5 bg-slate-50/30">
                  <CardTitle className="text-xl font-bold flex items-center gap-2"><FileText className="text-amber-500 w-5 h-5"/> Riwayat Lamaran</CardTitle>
                  <CardDescription className="text-slate-400">Lacak status progresif untuk semua lamaran yang telah Anda kirimkan.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-slate-100 border-b-2">
                        <TableHead className="px-6 py-4 font-semibold text-slate-500">Posisi Diharapkan</TableHead>
                        <TableHead className="font-semibold text-slate-500">Perusahaan</TableHead>
                        <TableHead className="font-semibold text-slate-500">Tanggal Lamar</TableHead>
                        <TableHead className="text-right px-6 font-semibold text-slate-500">Status Info</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.length > 0 ? applications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50">
                          <TableCell className="font-semibold text-slate-800 px-6 py-4 whitespace-nowrap">{app.lowongan_magang?.job_description}</TableCell>
                          <TableCell className="text-slate-600">{app.lowongan_magang?.company_name}</TableCell>
                          <TableCell className="text-slate-500 whitespace-nowrap font-medium">{new Date(app.applied_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</TableCell>
                          <TableCell className="text-right px-6"><Badge variant="outline" className={`${getStatusBadge(app.status)} shadow-sm whitespace-nowrap px-3 py-1 font-semibold`}>{app.status}</Badge></TableCell>
                        </TableRow>
                      )) : <TableRow><TableCell colSpan="4" className="text-center py-16 text-slate-400 font-medium">Anda belum pernah melamar ke perusahaan mana pun.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
