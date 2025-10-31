'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Users, Building2, TrendingUp, Briefcase, MapPin, Calendar, Search, Filter, Mail, Phone, MapPinned, GraduationCap, Target, Award, CheckCircle2, ArrowRight, Star, Clock } from 'lucide-react'
import CountUp from 'react-countup'

export default function CDCWebsite() {
  const [currentPage, setCurrentPage] = useState('home')
  const [jobs, setJobs] = useState([])
  const [latestJobs, setLatestJobs] = useState([])
  const [companies, setCompanies] = useState([])
  const [statistics, setStatistics] = useState({})
  const [testimonials, setTestimonials] = useState([])
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Images from vision_expert_agent
  const images = {
    hero: 'https://images.unsplash.com/photo-1589696709085-58e1b5e18338',
    about: 'https://images.pexels.com/photos/3862134/pexels-photo-3862134.jpeg',
    jobPortal: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643',
    partnership: 'https://images.unsplash.com/photo-1580893246395-52aead8960dc',
    success: 'https://images.unsplash.com/photo-1559443065-31b290d9c9c1'
  }

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    }

    // Fetch initial data
    fetchLatestJobs()
    fetchStatistics()
    fetchTestimonials()
    fetchNews()
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (currentPage === 'jobs') {
      fetchJobs()
    }
  }, [currentPage, searchTerm, filterLocation, filterTag])

  const fetchLatestJobs = async () => {
    try {
      const response = await fetch('/api/jobs/latest')
      const data = await response.json()
      setLatestJobs(data)
    } catch (error) {
      console.error('Error fetching latest jobs:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      let url = '/api/jobs?'
      if (searchTerm) url += `search=${searchTerm}&`
      if (filterLocation !== 'all') url += `locationType=${filterLocation}&`
      if (filterTag !== 'all') url += `tag=${filterTag}&`
      
      const response = await fetch(url)
      const data = await response.json()
      setJobs(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

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
        setIsLoggedIn(true)
        setUser(data.student)
        setIsLoginOpen(false)
        alert('Login berhasil!')
      } else {
        alert(data.error || 'Login gagal')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Terjadi kesalahan saat login')
    }
  }

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
        setIsLoggedIn(true)
        setUser(data.student)
        setIsRegisterOpen(false)
        alert('Registrasi berhasil!')
      } else {
        alert(data.error || 'Registrasi gagal')
      }
    } catch (error) {
      console.error('Register error:', error)
      alert('Terjadi kesalahan saat registrasi')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setCurrentPage('home')
  }

  const handleApplyJob = async (jobId) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk melamar pekerjaan')
      setIsLoginOpen(true)
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      })

      const data = await response.json()
      if (response.ok) {
        alert('Lamaran berhasil dikirim!')
      } else {
        alert(data.error || 'Gagal mengirim lamaran')
      }
    } catch (error) {
      console.error('Apply error:', error)
      alert('Terjadi kesalahan saat mengirim lamaran')
    }
  }

  // Navigation Header
  const Header = () => (
    <header className="sticky top-0 z-50 w-full border-b bg-[#003366] text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#FFC300]" />
          <div>
            <h1 className="text-xl font-bold">CDC Cakrawala</h1>
            <p className="text-xs text-gray-300">Career Development Center</p>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <button onClick={() => setCurrentPage('home')} className="hover:text-[#FFC300] transition-colors">Beranda</button>
          <button onClick={() => setCurrentPage('about')} className="hover:text-[#FFC300] transition-colors">Tentang Kami</button>
          <button onClick={() => setCurrentPage('programs')} className="hover:text-[#FFC300] transition-colors">Program & Layanan</button>
          <button onClick={() => setCurrentPage('jobs')} className="hover:text-[#FFC300] transition-colors">Lowongan Magang</button>
          <button onClick={() => setCurrentPage('companies')} className="hover:text-[#FFC300] transition-colors">Perusahaan Mitra</button>
          <button onClick={() => setCurrentPage('news')} className="hover:text-[#FFC300] transition-colors">Berita & Acara</button>
          <button onClick={() => setCurrentPage('contact')} className="hover:text-[#FFC300] transition-colors">Kontak</button>
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <span className="text-sm hidden md:block">Halo, {user?.fullName}</span>
              <Button onClick={handleLogout} variant="outline" className="bg-white text-[#003366] hover:bg-[#FFC300] hover:text-[#003366]">Logout</Button>
            </>
          ) : (
            <>
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white text-[#003366] hover:bg-[#FFC300] hover:text-[#003366]">Login</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>Masuk ke akun CDC Anda</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full bg-[#003366] hover:bg-[#00A59C]">Login</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFC300] text-[#003366] hover:bg-[#00A59C] hover:text-white">Daftar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrasi</DialogTitle>
                    <DialogDescription>Buat akun CDC baru</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="nim">NIM</Label>
                      <Input id="nim" name="nim" required />
                    </div>
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap</Label>
                      <Input id="fullName" name="fullName" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" name="password" type="password" required />
                    </div>
                    <div>
                      <Label htmlFor="major">Program Studi</Label>
                      <Select name="major" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Program Studi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Teknik Informatika">Teknik Informatika</SelectItem>
                          <SelectItem value="Sistem Informasi">Sistem Informasi</SelectItem>
                          <SelectItem value="Manajemen">Manajemen</SelectItem>
                          <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                          <SelectItem value="Teknik Sipil">Teknik Sipil</SelectItem>
                          <SelectItem value="Arsitektur">Arsitektur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-[#003366] hover:bg-[#00A59C]">Daftar</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </header>
  )

  // Home Page
  const HomePage = () => (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white" style={{
        backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.8)), url(${images.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Wujudkan Karier Impianmu</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Career Development Center Cakrawala University - Jembatan Menuju Kesuksesan Kariermu</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setCurrentPage('jobs')} size="lg" className="bg-[#FFC300] text-[#003366] hover:bg-[#00A59C] hover:text-white text-lg px-8">
              Cari Lowongan Magang <ArrowRight className="ml-2" />
            </Button>
            <Button onClick={() => setCurrentPage('programs')} size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#003366] text-lg px-8">
              Pelajari Layanan Kami
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-[#003366] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-[#003366] mb-2" />
                <CardTitle className="text-4xl font-bold text-[#003366]">
                  <CountUp end={statistics.totalAlumniPlaced || 0} duration={2} />
                </CardTitle>
                <CardDescription className="text-lg">Alumni Tersalurkan</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-t-4 border-[#FFC300] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Building2 className="h-12 w-12 text-[#FFC300] mb-2" />
                <CardTitle className="text-4xl font-bold text-[#003366]">
                  <CountUp end={statistics.totalCompanies || 0} duration={2} />
                </CardTitle>
                <CardDescription className="text-lg">Perusahaan Mitra</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-t-4 border-[#00A59C] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-[#00A59C] mb-2" />
                <CardTitle className="text-4xl font-bold text-[#003366]">
                  <CountUp end={statistics.placementRate || 0} duration={2} decimals={1} />%
                </CardTitle>
                <CardDescription className="text-lg">Tingkat Penempatan</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About CDC Section */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#003366] mb-6">Tentang CDC Cakrawala</h2>
              <p className="text-lg text-[#333333] mb-6">
                Career Development Center (CDC) Cakrawala University adalah pusat pengembangan karier yang berkomitmen untuk membantu mahasiswa dan alumni meraih kesuksesan dalam dunia kerja profesional.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366]">Bimbingan Karier Personal</h3>
                    <p className="text-[#333333]">Konsultasi one-on-one dengan konselor karier profesional</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366]">Program Magang Berkualitas</h3>
                    <p className="text-[#333333]">Akses ke lowongan magang di perusahaan terkemuka</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366]">Workshop & Training</h3>
                    <p className="text-[#333333]">Pelatihan soft skills dan hard skills untuk persiapan karier</p>
                  </div>
                </div>
              </div>
              <Button onClick={() => setCurrentPage('about')} className="mt-6 bg-[#003366] hover:bg-[#00A59C]">
                Pelajari Lebih Lanjut <ArrowRight className="ml-2" />
              </Button>
            </div>
            <div>
              <img src={images.about} alt="CDC Services" className="rounded-lg shadow-xl w-full h-[400px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-[#003366] mb-2">Lowongan Magang Terbaru</h2>
              <p className="text-lg text-[#333333]">Temukan kesempatan magang yang sesuai dengan passionmu</p>
            </div>
            <Button onClick={() => setCurrentPage('jobs')} className="bg-[#FFC300] text-[#003366] hover:bg-[#00A59C] hover:text-white">
              Lihat Semua Lowongan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJobs.slice(0, 6).map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow border-t-4 border-[#003366]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#F8F8F8] rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-[#003366]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.position}</CardTitle>
                        <CardDescription>{job.companies?.name}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-[#333333]">
                      <MapPin className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.locationType} - {job.companies?.location}
                    </div>
                    <div className="flex items-center text-sm text-[#333333]">
                      <Briefcase className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.salary || 'Kompetitif'}
                    </div>
                  </div>
                  {job.tag && (
                    <Badge className={job.tag === 'Berbayar' ? 'bg-[#FFC300] text-[#003366]' : 'bg-[#00A59C] text-white'}>
                      {job.tag}
                    </Badge>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleApplyJob(job.id)} className="w-full bg-[#003366] hover:bg-[#00A59C]">
                    Lamar Sekarang
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#003366] mb-4">Kisah Sukses Alumni</h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Dengarkan pengalaman alumni yang telah sukses berkarier melalui CDC Cakrawala University
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="border-t-4 border-[#FFC300] hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-[#003366] flex items-center justify-center text-white text-2xl font-bold">
                      {testimonial.studentName.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.studentName}</CardTitle>
                      <CardDescription>{testimonial.position}</CardDescription>
                      <CardDescription className="text-[#00A59C] font-semibold">{testimonial.companyName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-[#FFC300] fill-[#FFC300]" />
                    ))}
                  </div>
                  <p className="text-[#333333] italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Siap Memulai Perjalanan Kariermu?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan mahasiswa yang telah menemukan kesempatan karier melalui CDC Cakrawala
          </p>
          {!isLoggedIn && (
            <Button onClick={() => setIsRegisterOpen(true)} size="lg" className="bg-[#FFC300] text-[#003366] hover:bg-[#00A59C] hover:text-white text-lg px-8">
              Daftar Sekarang
            </Button>
          )}
          {isLoggedIn && (
            <Button onClick={() => setCurrentPage('jobs')} size="lg" className="bg-[#FFC300] text-[#003366] hover:bg-[#00A59C] hover:text-white text-lg px-8">
              Jelajahi Lowongan
            </Button>
          )}
        </div>
      </section>
    </div>
  )

  // About Page
  const AboutPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Tentang CDC Cakrawala University</h1>
          <p className="text-xl max-w-3xl mx-auto">Membangun jembatan antara pendidikan dan dunia kerja profesional</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold text-[#003366] mb-6 flex items-center">
                <Target className="h-10 w-10 text-[#FFC300] mr-3" />
                Visi Kami
              </h2>
              <p className="text-lg text-[#333333] leading-relaxed">
                Menjadi pusat pengembangan karier terdepan yang menghubungkan talenta terbaik dengan peluang karier berkualitas, serta menghasilkan profesional yang kompeten dan berdaya saing global.
              </p>
            </div>
            <div className="bg-[#F8F8F8] p-8 rounded-lg">
              <h2 className="text-4xl font-bold text-[#003366] mb-6 flex items-center">
                <Award className="h-10 w-10 text-[#00A59C] mr-3" />
                Misi Kami
              </h2>
              <ul className="space-y-4 text-[#333333]">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-2 mt-1 flex-shrink-0" />
                  <span>Menyediakan program bimbingan karier yang komprehensif dan personal</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-2 mt-1 flex-shrink-0" />
                  <span>Membangun kemitraan strategis dengan industri dan perusahaan terkemuka</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-2 mt-1 flex-shrink-0" />
                  <span>Menyelenggarakan program magang berkualitas untuk pengembangan kompetensi</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-2 mt-1 flex-shrink-0" />
                  <span>Mengadakan workshop dan pelatihan untuk meningkatkan employability</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#003366] mb-4">Tim CDC Kami</h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Tim profesional yang berdedikasi untuk kesuksesan karier Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Siti Nurhaliza, M.M.', position: 'Direktur CDC', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300' },
              { name: 'Ahmad Fauzi, S.Psi., M.Psi.', position: 'Kepala Bimbingan Karier', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300' },
              { name: 'Linda Wijaya, S.E., M.B.A.', position: 'Manajer Kemitraan Industri', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300' }
            ].map((member, idx) => (
              <Card key={idx} className="text-center hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto rounded-full bg-[#003366] mb-4 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-[#00A59C] font-semibold">{member.position}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  // Programs Page
  const ProgramsPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Program & Layanan</h1>
          <p className="text-xl max-w-3xl mx-auto">Berbagai program dan layanan untuk mendukung pengembangan karier Anda</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-t-4 border-[#FFC300] hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-[#FFC300] rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#003366]" />
                </div>
                <CardTitle className="text-2xl">Bimbingan Karier Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#333333] mb-4">
                  Konsultasi one-on-one dengan konselor karier profesional untuk membantu Anda menemukan jalur karier yang tepat.
                </p>
                <ul className="space-y-2 text-[#333333]">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Assessment minat dan bakat</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Perencanaan karier jangka panjang</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Review CV dan portfolio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-[#00A59C] hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-[#00A59C] rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Program Magang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#333333] mb-4">
                  Akses ke berbagai lowongan magang di perusahaan terkemuka untuk mengembangkan pengalaman profesional Anda.
                </p>
                <ul className="space-y-2 text-[#333333]">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Lowongan magang berbayar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Rekomendasi CDC untuk kandidat terbaik</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Monitoring dan evaluasi berkala</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-[#003366] hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-[#003366] rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-[#FFC300]" />
                </div>
                <CardTitle className="text-2xl">Workshop & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#333333] mb-4">
                  Berbagai workshop dan training untuk meningkatkan soft skills dan hard skills Anda.
                </p>
                <ul className="space-y-2 text-[#333333]">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Resume writing & cover letter</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Interview skills & personal branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Leadership & communication skills</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-[#FFC300] hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-16 w-16 bg-[#FFC300] rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-[#003366]" />
                </div>
                <CardTitle className="text-2xl">Job Fair & Career Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#333333] mb-4">
                  Event berkala yang menghubungkan mahasiswa dengan perusahaan secara langsung.
                </p>
                <ul className="space-y-2 text-[#333333]">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Job fair tahunan dengan 50+ perusahaan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Company visit & industry insight</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-[#00A59C] mr-2 mt-0.5 flex-shrink-0" />
                    <span>Networking sessions dengan alumni</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )

  // Jobs Page
  const JobsPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Lowongan Magang</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">Temukan kesempatan magang yang sesuai dengan minat dan keahlianmu</p>
          
          {/* Search and Filter */}
          <div className="bg-white text-[#333333] p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-[#003366]">Cari Posisi</Label>
                <Input
                  id="search"
                  placeholder="Cari posisi atau perusahaan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-[#003366]">Tipe Lokasi</Label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Lokasi</SelectItem>
                    <SelectItem value="WFO">Work From Office</SelectItem>
                    <SelectItem value="WFH">Work From Home</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tag" className="text-[#003366]">Kategori</Label>
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="Berbayar">Berbayar</SelectItem>
                    <SelectItem value="Rekomendasi CDC">Rekomendasi CDC</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-lg text-[#333333]">
              Menampilkan <span className="font-bold text-[#003366]">{jobs.length}</span> lowongan magang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow border-t-4 border-[#003366]">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-14 w-14 bg-[#F8F8F8] rounded-lg flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-[#003366]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.position}</CardTitle>
                        <CardDescription className="font-semibold">{job.companies?.name}</CardDescription>
                      </div>
                    </div>
                  </div>
                  {job.tag && (
                    <Badge className={job.tag === 'Berbayar' ? 'bg-[#FFC300] text-[#003366]' : 'bg-[#00A59C] text-white'}>
                      {job.tag}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-[#333333] text-sm mb-4 line-clamp-3">{job.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-[#333333]">
                      <MapPin className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.locationType} - {job.companies?.location}
                    </div>
                    <div className="flex items-center text-sm text-[#333333]">
                      <Briefcase className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.salary || 'Kompetitif'}
                    </div>
                    <div className="flex items-center text-sm text-[#333333]">
                      <Clock className="h-4 w-4 mr-2 text-[#00A59C]" />
                      Tutup: {new Date(job.closingDate).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleApplyJob(job.id)} className="w-full bg-[#003366] hover:bg-[#00A59C]">
                    Lamar Sekarang
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-[#003366] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#003366] mb-2">Tidak ada lowongan ditemukan</h3>
              <p className="text-[#333333]">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )

  // Companies Page
  const CompaniesPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Perusahaan Mitra</h1>
          <p className="text-xl max-w-3xl mx-auto">Perusahaan terkemuka yang menjadi mitra CDC Cakrawala University</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-xl transition-shadow border-t-4 border-[#00A59C]">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="h-16 w-16 bg-[#F8F8F8] rounded-lg flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-[#003366]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <Badge className="mt-1">{company.industrySector}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#333333] mb-4 line-clamp-3">{company.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-[#333333]">
                      <MapPinned className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {company.location}
                    </div>
                    {company.websiteUrl && (
                      <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00A59C] hover:underline">
                        Kunjungi Website
                      </a>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => setCurrentPage('jobs')} variant="outline" className="w-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white">
                    Lihat Lowongan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  // News Page
  const NewsPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Berita & Acara</h1>
          <p className="text-xl max-w-3xl mx-auto">Update terbaru tentang event, seminar, dan kegiatan CDC</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="Job Fair">Job Fair</TabsTrigger>
              <TabsTrigger value="Seminar">Seminar</TabsTrigger>
              <TabsTrigger value="Workshop">Workshop</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Card key={item.id} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2 bg-[#FFC300] text-[#003366]">{item.category}</Badge>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(item.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#333333] line-clamp-4">{item.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white">
                        Baca Selengkapnya
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )

  // Contact Page
  const ContactPage = () => (
    <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl max-w-3xl mx-auto">Kami siap membantu Anda dalam perjalanan karier</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#FFC300] rounded-lg flex items-center justify-center">
                        <MapPinned className="h-6 w-6 text-[#003366]" />
                      </div>
                      <div>
                        <CardTitle>Alamat</CardTitle>
                        <CardDescription className="text-[#333333]">
                          Jl. Cakrawala No. 123, Bandung, Jawa Barat 40123
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#00A59C] rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>Telepon</CardTitle>
                        <CardDescription className="text-[#333333]">
                          +62 22 1234 5678
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-[#003366] rounded-lg flex items-center justify-center">
                        <Mail className="h-6 w-6 text-[#FFC300]" />
                      </div>
                      <div>
                        <CardTitle>Email</CardTitle>
                        <CardDescription className="text-[#333333]">
                          cdc@cakrawala.ac.id
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-[#003366] mb-4">Jam Operasional</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2 text-[#333333]">
                      <div className="flex justify-between">
                        <span className="font-semibold">Senin - Jumat</span>
                        <span>08:00 - 16:00 WIB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Sabtu</span>
                        <span>09:00 - 13:00 WIB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Minggu</span>
                        <span>Tutup</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">Kirim Pesan</h2>
              <Card>
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subjek</Label>
                      <Input id="subject" placeholder="Subjek pesan" />
                    </div>
                    <div>
                      <Label htmlFor="message">Pesan</Label>
                      <textarea
                        id="message"
                        className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]"
                        placeholder="Tulis pesan Anda di sini..."
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#003366] hover:bg-[#00A59C]">
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )

  // Footer
  const Footer = () => (
    <footer className="bg-[#003366] text-white py-12">
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
            <p className="text-sm text-gray-300">
              Membangun jembatan antara pendidikan dan dunia kerja profesional
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => setCurrentPage('home')} className="hover:text-[#FFC300]">Beranda</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-[#FFC300]">Tentang Kami</button></li>
              <li><button onClick={() => setCurrentPage('programs')} className="hover:text-[#FFC300]">Program</button></li>
              <li><button onClick={() => setCurrentPage('jobs')} className="hover:text-[#FFC300]">Lowongan</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="hover:text-[#FFC300]">Bimbingan Karier</li>
              <li className="hover:text-[#FFC300]">Program Magang</li>
              <li className="hover:text-[#FFC300]">Workshop</li>
              <li className="hover:text-[#FFC300]">Job Fair</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Jl. Cakrawala No. 123</li>
              <li>Bandung, Jawa Barat 40123</li>
              <li>+62 22 1234 5678</li>
              <li>cdc@cakrawala.ac.id</li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-gray-600 mb-6" />
        
        <div className="text-center text-sm text-gray-300">
          <p>&copy; 2025 CDC Cakrawala University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <Header />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'programs' && <ProgramsPage />}
        {currentPage === 'jobs' && <JobsPage />}
        {currentPage === 'companies' && <CompaniesPage />}
        {currentPage === 'news' && <NewsPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>
      <Footer />
    </div>
  )
}
