'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/app/components/button'
import { Separator } from '@/app/components/separator'
import { GraduationCap } from 'lucide-react'
import './globals.css'

// We can create a context for auth later, for now, let's keep it simple in the layout.
export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/admin-login' || pathname?.startsWith('/dashboard')

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    // Redirect to home or refresh
    window.location.href = '/'
  }

  const Header = () => (
    <header className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${isScrolled ? 'shadow-md border-b' : 'border-b-transparent'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#FFC300]" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">CDC Cakrawala</h1>
            <p className="text-xs text-gray-500">Career Development Center</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-[#FFC300] transition-colors">Beranda</Link>
          <Link href="/about" className="hover:text-[#FFC300] transition-colors">Tentang Kami</Link>
          <Link href="/jobs" className="hover:text-[#FFC300] transition-colors">Lowongan Magang</Link>        
          <Link href="/news" className="hover:text-[#FFC300] transition-colors">Berita & Acara</Link>
          <Link href="/contact" className="hover:text-[#FFC300] transition-colors">Kontak</Link>
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <span className="text-sm hidden md:block">Halo, {user?.fullName}</span>
              <Button onClick={handleLogout} variant="outline" className="border-[#00A59C] text-[#00A59C] hover:bg-[#00A59C] hover:text-white">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-[#00A59C] text-[#00A59C] hover:bg-[#00A59C] hover:text-white">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#FFC300] text-gray-900 hover:bg-amber-400">Daftar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-[#FFC300]" />
              <div>
                <h3 className="text-xl font-bold">CDC Cakrawala</h3>
                <p className="text-xs text-gray-300">Career Development Center</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Membangun jembatan antara pendidikan dan dunia kerja profesional
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[#FFC300]">Beranda</Link></li>
              <li><Link href="/about" className="hover:text-[#FFC300]">Tentang Kami</Link></li>
              <li><Link href="/programs" className="hover:text-[#FFC300]">Program</Link></li>
              <li><Link href="/jobs" className="hover:text-[#FFC300]">Lowongan</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-[#FFC300]">Bimbingan Karier</li>
              <li className="hover:text-[#FFC300]">Program Magang</li>
              <li className="hover:text-[#FFC300]">Workshop</li>
              <li className="hover:text-[#FFC300]">Job Fair</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Jl. Cakrawala No. 123</li>
              <li>Bandung, Jawa Barat 40123</li>
              <li>+62 22 1234 5678</li>
              <li>cdc@cakrawala.ac.id</li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-gray-700 mb-6" />
        
        <div className="text-center text-sm text-gray-400">
          <p>&copy; 2025 CDC Cakrawala University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
          {!isAuthPage && <Header />}
          <main className="flex-1 bg-white">
            {children}
          </main>
          {!isAuthPage && <Footer />}
        </div>
      </body>
    </html>
  )
}