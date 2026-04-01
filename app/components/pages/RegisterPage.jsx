'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/select'
import { GraduationCap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Metadata ini akan ditangkap oleh Trigger SQL Anda di Supabase
        data: {
          full_name: fullName,
          role: 'MAHASISWA' 
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      router.push('/login'); // Arahkan ke halaman login
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
          <p className="text-gray-600 mb-8">Satu langkah lagi menuju karier impian Anda.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
                className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="mt-1" />
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
                minLength={6}
                className="mt-1" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]" disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun? <Link href="/login" className="font-semibold text-[#00A59C] hover:underline">Login di sini</Link>
          </p>
        </div>
        {/* Sisi Kanan - Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-bl from-[#FFC300] to-[#E6A200] p-12 text-gray-900 flex-col justify-center items-center text-center">
          <GraduationCap className="h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Bergabunglah dengan Komunitas Kami</h2>
          <p>Dapatkan akses ke ratusan peluang magang, bimbingan karier, dan acara eksklusif.</p>
        </div>
      </div>
    </div>
  )
}
