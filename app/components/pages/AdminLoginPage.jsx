'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError(null);

    // 1. Coba login dengan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message === 'Invalid login credentials' ? 'Email atau password salah.' : authError.message);
      return;
    }

    if (authData.user) {
      // 2. Jika login berhasil, ambil ROLE dari tabel 'profiles'
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      setLoading(false);

      if (profileError) {
        setError("Login berhasil, tapi gagal mengambil profil: " + profileError.message);
      } else if (profileData) {
        // 3. Arahkan (Redirect) berdasarkan ROLE secara ketat (Khusus ADMIN)
        if (profileData.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else {
          // Jika BUKAN admin, tolak akses dan logout
          await supabase.auth.signOut();
          setError("Akses ditolak. Ini adalah halaman khusus Administrator.");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden m-4">
        {/* Sisi Kiri - Form */}
        <div className="w-full md:w-1/2 p-8 border-r border-gray-100">
          <div className="mb-8 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 transition-transform hover:scale-105">
              <ShieldCheck className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-800">CDC Admin Panel</span>
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login Administrator</h2>
          <p className="text-gray-600 mb-8">Masuk ke sistem manajemen CDC.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Admin</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="admin@cakrawala.ac.id" 
                className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500" 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
                className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500" 
              />
            </div>
            {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-md active:scale-95" disabled={loading}>
              {loading ? 'Memverifikasi...' : 'Login Admin'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6 pt-6 border-t border-gray-100">
            Bukan staf admin? <Link href="/login" className="font-semibold text-blue-600 hover:underline">Login Mahasiswa</Link>
          </p>
        </div>
        {/* Sisi Kanan - Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-700 to-red-900 p-12 text-white flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-red-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black opacity-20 blur-3xl"></div>
          
          <div className="animate-pulse-slow relative z-10">
            <ShieldCheck className="h-28 w-28 mb-6 text-white drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 relative z-10 drop-shadow-md">Portal Administrator</h2>
          <p className="text-red-100 text-lg relative z-10 drop-shadow-md">Area terbatas (Sangat Rahasia). Akses sistem kontrol utama Career Development Center Universitas Cakrawala.</p>
        </div>
      </div>
    </div>
  )
}
