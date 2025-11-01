'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { GraduationCap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.student))
        alert('Login berhasil!')
        router.push('/')
        router.refresh() // Untuk me-refresh layout dan header
      } else {
        alert(data.error || 'Login gagal')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Terjadi kesalahan saat login')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Sisi Kiri - Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#00A59C] to-[#003366] p-12 text-white flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-10 w-10 text-[#FFC300]" />
              <h1 className="text-2xl font-bold">CDC Cakrawala</h1>
            </div>
            <p className="text-lg">Gerbang Anda menuju karier impian. Selamat datang kembali!</p>
          </div>
          <p className="text-sm opacity-80">&copy; 2025 CDC Cakrawala University</p>
        </div>

        {/* Sisi Kanan - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Masuk untuk melanjutkan.</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="email@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="••••••••" className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]">Login</Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun? <Link href="/register" className="font-semibold text-[#00A59C] hover:underline">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}