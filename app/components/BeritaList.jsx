'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function BeritaList() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBerita() {
      setLoading(true);
      
      // Ambil data dari tabel 'berita_acara'
      // Ini aman karena RLS Policy Anda mengizinkan SELECT oleh publik
      const { data, error } = await supabase
        .from('berita_acara')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Ambil 5 berita terbaru

      if (error) {
        console.error('Error fetching berita:', error);
        setError(error.message);
      } else {
        setBerita(data);
      }
      setLoading(false);
    }

    fetchBerita();
  }, []);

  if (loading) {
    return <p>Memuat berita terbaru...</p>;
  }

  if (error) {
    return <p className="text-red-500">Gagal memuat berita: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Berita & Acara Terbaru</h2>
      {berita.length === 0 ? (
        <p>Belum ada berita.</p>
      ) : (
        <ul className="list-disc pl-5">
          {berita.map((item) => (
            <li key={item.id} className="mb-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.content?.substring(0, 100)}...</p>
              <span className="text-xs text-gray-400">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}