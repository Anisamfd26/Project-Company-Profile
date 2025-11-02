'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { GraduationCap, LogIn } from 'lucide-react'

export default function LoginPage() {
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
        .eq('id', authData.user.id) // Cocokkan ID pengguna yang login
        .single(); // Ambil satu baris saja

      setLoading(false);

      if (profileError) {
        setError("Login berhasil, tapi gagal mengambil profil: " + profileError.message);
      } else if (profileData) {
        // 3. Arahkan (Redirect) berdasarkan ROLE
        if (profileData.role === 'ADMIN') {
          router.push('/dashboard/admin');
        } else if (profileData.role === 'MAHASISWA') {
          router.push('/dashboard/mahasiswa');
        } else {
          router.push('/'); // Fallback
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden m-4">
        {/* Sisi Kiri - Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8 text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-[#00A59C]" />
              <span className="text-2xl font-bold text-gray-800">CDC Cakrawala</span>
            </Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-600 mb-8">Masuk untuk melanjutkan.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="mt-1" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]" disabled={loading}>
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun? <Link href="/register" className="font-semibold text-[#00A59C] hover:underline">Daftar di sini</Link>
          </p>
        </div>
        {/* Sisi Kanan - Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#003366] to-[#005f73] p-12 text-white flex-col justify-center items-center text-center">
          <div className="animate-pulse-slow">
            <GraduationCap className="h-24 w-24 mb-6 text-white/80" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Selamat Datang Kembali!</h2>
          <p className="text-white/80">Kami senang melihat Anda lagi. Mari lanjutkan perjalanan karier Anda bersama kami.</p>
        </div>
      </div>
    </div>
  )
}
