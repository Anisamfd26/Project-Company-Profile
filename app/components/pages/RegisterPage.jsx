'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/select'
import { GraduationCap } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nim = formData.get('nim')
    const fullName = formData.get('fullName')
    const email = formData.get('email')
    const password = formData.get('password')
    const major = formData.get('major')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim, fullName, email, password, major })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.student))
        alert('Registrasi berhasil!')
        router.push('/')
        router.refresh()
      } else {
        alert(data.error || 'Registrasi gagal')
      }
    } catch (error) {
      console.error('Register error:', error)
      alert('Terjadi kesalahan saat registrasi')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Sisi Kiri - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
          <p className="text-gray-600 mb-8">Satu langkah lagi menuju karier impian Anda.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="nim">NIM</Label>
              <Input id="nim" name="nim" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" name="fullName" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="major">Program Studi</Label>
              <Select name="major" required>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Program Studi" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
                  <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                  <SelectItem value="Manajemen">Manajemen</SelectItem>
                  <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]">Daftar</Button>
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