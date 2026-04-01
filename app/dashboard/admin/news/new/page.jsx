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
import { ArrowLeft, CheckCircle, AlertCircle, Newspaper, Calendar } from 'lucide-react';

export default function NewNewsPage() {
  const router = useRouter();
  const [news, setNews] = useState({
    title: '',
    category: '',
    event_date: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Format the date string if provided
    let eventDateToSubmit = null;
    if (news.event_date) {
        eventDateToSubmit = new Date(news.event_date).toISOString();
    }

    const payload = {
        title: news.title,
        category: news.category,
        content: news.content,
        image_url: news.image_url,
    };
    if (eventDateToSubmit) {
        payload.event_date = eventDateToSubmit;
    }

    const { error: insertError } = await supabase
      .from('berita_acara')
      .insert([payload]);

    setLoading(false);

    if (insertError) {
      setError(`Gagal menyimpan: ${insertError.message}`);
    } else {
      setSuccess('Berita/Acara berhasil ditambahkan!');
      setNews({
        title: '',
        category: '',
        event_date: '',
        content: '',
        image_url: '',
      });
      setTimeout(() => {
        router.push('/dashboard/admin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#00A59C]/20 relative pb-16">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-400 opacity-5 blur-3xl pointer-events-none"></div>
      
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
              <Newspaper size={16} />
            </div>
            <span className="font-bold tracking-tight text-slate-800">Admin<span className="text-[#00A59C]">Portal</span></span>
          </div>
        </div>
      </nav>

      {/* Main Form Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Terbitkan <span className="text-[#00A59C]">Berita/Acara</span></h1>
          <p className="text-lg text-slate-500">Buat pengumuman event atau artikel berita untuk mahasiswa.</p>
        </div>

        <Card className="border-0 shadow-sm ring-1 ring-slate-200/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 px-8 py-6 bg-slate-50/30">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800"><Newspaper className="text-amber-500 w-5 h-5"/> Konten Publikasi</CardTitle>
            <CardDescription className="text-slate-500">Artikel akan langsung tayang di portal berita utama.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-semibold">Judul Berita/Acara*</Label>
                <Input id="title" name="title" value={news.title} onChange={handleChange} required className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="Cth: Job Fair Cakrawala 2026..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700 font-semibold">Kategori Label</Label>
                  <Input id="category" name="category" value={news.category} onChange={handleChange} className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="Cth: Event / Pengumuman / Tips" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_date" className="text-slate-700 font-semibold flex items-center gap-1"><Calendar size={14}/> Tanggal Acara (Opsional)</Label>
                  <Input id="event_date" name="event_date" type="datetime-local" value={news.event_date} onChange={handleChange} className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 text-slate-600 shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-700 font-semibold">Isi Konten Berita*</Label>
                <Textarea id="content" name="content" value={news.content} onChange={handleChange} required rows={7} className="rounded-xl border-slate-200 focus:bg-slate-50 resize-y shadow-sm" placeholder="Tulis rincian informasi di sini..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-slate-700 font-semibold">Tautan Banner / Gambar Ilustrasi (Opsional)</Label>
                <Input id="image_url" name="image_url" type="url" value={news.image_url} onChange={handleChange} className="rounded-xl border-slate-200 focus:bg-slate-50 h-12 shadow-sm" placeholder="https://example.com/banner.jpg" />
              </div>

              {error && (
                <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 mt-4 shadow-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 text-sm text-[#00A59C] bg-[#00A59C]/10 p-4 rounded-xl border border-[#00A59C]/20 mt-4 shadow-sm">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{success}</span>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-slate-50">
                <Button type="submit" disabled={loading} className="bg-[#00A59C] hover:bg-[#008F87] text-white rounded-xl shadow-lg shadow-[#00A59C]/20 px-8 py-6 h-auto text-md font-bold transition-transform active:scale-95">
                  {loading ? 'Mempublikasikan...' : 'Terbitkan Sekarang'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
