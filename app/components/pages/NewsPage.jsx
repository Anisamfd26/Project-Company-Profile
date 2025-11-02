'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/app/components/button'
import { Badge } from '@/app/components/badge'
import { Tabs, TabsList, TabsTrigger } from '@/app/components/tabs'
import { Calendar, Newspaper } from 'lucide-react'


export default function NewsPage() {
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('berita_acara')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setNews(data || []);
        setFilteredNews(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [])

  const handleTabChange = (category) => {
    if (category === 'all') {
      setFilteredNews(news)
    } else {
      setFilteredNews(news.filter(item => item.category === category))
    }
  }

  return (
    <div className="w-full">
      <section className="py-16 bg-[#00A59C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Berita & Acara</h1>
          <p className="text-xl max-w-3xl mx-auto">Update terbaru tentang event, seminar, dan kegiatan CDC</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4 md:w-1/2 mx-auto mb-12">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="Job Fair">Job Fair</TabsTrigger>
              <TabsTrigger value="Seminar">Seminar</TabsTrigger>
              <TabsTrigger value="Workshop">Workshop</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full text-center py-16">Memuat berita...</div>
              ) : (
                filteredNews.map((item) => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-lg h-96">
                    <img src={item.image_url || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800'} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <Badge className="w-fit mb-2 bg-[#FFC300] text-gray-900">{item.category}</Badge>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <div className="flex items-center text-sm opacity-80">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(item.event_date || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white hover:text-black">
                          Baca Selengkapnya
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {!loading && filteredNews.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak Ada Berita Ditemukan</h3>
                <p className="text-gray-500">Tidak ada berita atau acara dalam kategori ini.</p>
              </div>
            )}
          </Tabs>
        </div>
      </section>
    </div>
  )
}
    