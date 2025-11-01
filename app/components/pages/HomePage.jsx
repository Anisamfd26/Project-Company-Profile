'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card'
import { Separator } from '@/app/components/separator'
import { Users, Building2, TrendingUp, Briefcase, ArrowRight, Star, Award, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import CountUp from 'react-countup'

export default function HomePage() {
  const [stats, setStats] = useState({ students: 0, companies: 0, programs: 0 })

  useEffect(() => {
    // In a real app, you'd fetch these stats from an API
    setStats({ students: 1250, companies: 150, programs: 25 })
  }, [])

  const heroImages = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Dummy data untuk Mahasiswa Eligible
  const eligibilityData = {
    totalEligible: 358,
    byMajor: [
      { name: 'Teknik Informatika', value: 120, color: '#00A59C' },
      { name: 'Sistem Informasi', value: 95, color: '#003366' },
      { name: 'Manajemen', value: 83, color: '#FFC300' },
      { name: 'Akuntansi', value: 60, color: '#5A677D' },
    ]
  };

  // Dummy data untuk Mahasiswa Intern
  const internData = {
    totalInterns: 280,
    bestInterns: [
      {
        name: 'Siti Rahayu',
        company: 'Global Finance Corp',
        position: 'Financial Analyst Intern',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        quote: 'Pengalaman magang yang luar biasa! Saya belajar banyak tentang analisis pasar dan bekerja dalam tim profesional.'
      },
      {
        name: 'Budi Santoso',
        company: 'Tech Innovators Inc.',
        position: 'Software Engineer Intern',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        quote: 'Melalui CDC, saya bisa menerapkan ilmu coding saya pada proyek nyata dan mendapat bimbingan langsung dari senior developer.'
      },
      {
        name: 'Ahmad Wijaya',
        company: 'Creative Media Works',
        position: 'Digital Marketing Intern',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        quote: 'Workshop dari CDC sangat membantu saya dalam mempersiapkan diri. Saya berhasil mengelola kampanye media sosial untuk klien besar.'
      }
    ],
    placementChart: [
      { name: 'Sudah Magang', value: 280, color: '#00A59C' },
      { name: 'Belum Magang', value: stats.students - 280, color: '#E0E0E0' },
    ]
  };

  // Dummy data untuk Logo Perusahaan Mitra
  const partnerLogos = [
    { name: 'Tech Innovators', logo: 'https://tailwindui.com/img/logos/158x48/tech-innovators-logo-gray-900.svg' },
    { name: 'Global Finance', logo: 'https://tailwindui.com/img/logos/158x48/global-finance-logo-gray-900.svg' },
    { name: 'Creative Media', logo: 'https://tailwindui.com/img/logos/158x48/creative-media-logo-gray-900.svg' },
    { name: 'Smart Solutions', logo: 'https://tailwindui.com/img/logos/158x48/smart-solutions-logo-gray-900.svg' },
    { name: 'Eco Business', logo: 'https://tailwindui.com/img/logos/158x48/eco-business-logo-gray-900.svg' },
    { name: 'Quantum Leap', logo: 'https://tailwindui.com/img/logos/158x48/quantum-leap-logo-gray-900.svg' },
    { name: 'Nexus Corp', logo: 'https://tailwindui.com/img/logos/158x48/nexus-corp-logo-gray-900.svg' },
    { name: 'Statamic', logo: 'https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg' },
  ];

  // Data untuk kriteria mahasiswa eligible
  const eligibilityCriteria = [
    { icon: CheckCircle, text: 'Aktif mengikuti Careerverse talk (Skor dihitung)' },
    { icon: CheckCircle, text: 'Mahasiswa aktif terdaftar di universitas' },
    { icon: CheckCircle, text: 'Berkomitmen mengikuti program sampai akhir' },
    { icon: CheckCircle, text: 'Lolos semua tahapan seleksi eligibility' },
    { icon: CheckCircle, text: 'Tidak memiliki masalah administrasi akademik' },
    { icon: CheckCircle, text: 'IPK Minimal 3.25 atau kehadiran kuliah > 75%' },
  ];

  // Duplikasi logo untuk efek scroll tak terbatas yang mulus
  const allLogos = [...partnerLogos, ...partnerLogos];
  const row1Logos = allLogos.slice(0, 8);
  const row2Logos = allLogos.slice(8, 16);


  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center h-screen text-white overflow-hidden"
      >
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00A59C] via-teal-800/80 to-transparent opacity-90"></div>
        <div className="relative container mx-auto px-4 text-left z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight max-w-2xl">
            Gerbang Menuju Karier Impian Anda
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            CDC Cakrawala hadir untuk menjembatani mahasiswa dengan dunia profesional melalui program magang, bimbingan karier, dan berbagai acara pengembangan diri.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
            <Link href="/jobs">
              <Button 
                className="bg-[#FFC300] text-gray-900 font-bold w-full sm:w-auto px-6 py-3 text-base transition-all duration-150 hover:opacity-95 active:scale-95 active:bg-[#FFC300]"
              >
                Lihat Lowongan Magang
              </Button>
            </Link>
            <Link href="/programs">
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white font-bold w-full sm:w-auto px-6 py-3 text-base transition-all duration-150 hover:bg-white/10 active:scale-95 active:bg-transparent"
              >
                Layanan Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Dampak Kami dalam Angka</h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Kami berkomitmen untuk memberikan hasil nyata bagi mahasiswa dan mitra kami.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Users className="h-12 w-12 text-[#00A59C] mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-[#00A59C]">
                <CountUp end={stats.students} duration={3} />+
              </h3>
              <p className="text-[#333333] mt-2">Mahasiswa Terbantu</p>
            </div>
            <div className="p-6">
              <Building2 className="h-12 w-12 text-[#00A59C] mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-[#00A59C]">
                <CountUp end={stats.companies} duration={3} />+
              </h3>
              <p className="text-[#333333] mt-2">Perusahaan Mitra</p>
            </div>
            <div className="p-6">
              <TrendingUp className="h-12 w-12 text-[#00A59C] mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-[#00A59C]">
                <CountUp end={stats.programs} duration={3} />+
              </h3>
              <p className="text-[#333333] mt-2">Program Pengembangan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Program <span className="text-[#00A59C]">Unggulan Kami</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Dirancang untuk mempersiapkan Anda menghadapi tantangan dunia kerja.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Bimbingan Karier', 
                icon: <Users className="h-8 w-8 text-white" />, 
                description: 'Dapatkan sesi konsultasi personal dengan konselor ahli untuk merancang peta jalan karier Anda, mulai dari review CV hingga simulasi wawancara.',
                color: 'bg-[#003366]'
              },
              { 
                title: 'Program Magang', 
                icon: <Briefcase className="h-8 w-8 text-white" />, 
                description: 'Akses eksklusif ke ratusan lowongan magang di perusahaan mitra terkemuka untuk mendapatkan pengalaman kerja nyata yang berharga.',
                color: 'bg-[#00A59C]'
              },
              { 
                title: 'Workshop & Training', 
                icon: <Star className="h-8 w-8 text-white" />, 
                description: 'Asah keahlian teknis dan soft skills Anda melalui serangkaian workshop intensif yang dibawakan langsung oleh para praktisi industri.',
                color: 'bg-[#00A59C]'
              },
              { 
                title: 'Job Fair', 
                icon: <Building2 className="h-8 w-8 text-white" />, 
                description: 'Temui rekruter dari puluhan perusahaan ternama secara langsung dalam acara job fair tahunan kami dan perluas jaringan profesional Anda.',
                color: 'bg-[#003366]'
              },
            ].map((program, index) => (
              <div key={index} className={`${program.color} text-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]`}>
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-white/20 backdrop-blur-sm">
                  {program.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-sm opacity-90">{program.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
          </div>
        </div>
      </section>

      <Separator />

      {/* Partner Companies Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Dipercaya oleh <span className="text-[#00A59C]">Perusahaan Terkemuka</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Kami bangga dapat bekerja sama dengan berbagai pemimpin industri untuk membuka jalan bagi karier Anda.
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          {/* Baris 1 & 3 */}
          {[row1Logos, row2Logos.slice(0, 6)].map((logoRow, rowIndex) => (
            <div key={rowIndex} className="w-full inline-flex flex-nowrap">
              <ul className={`flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none ${rowIndex === 1 ? 'animate-infinite-scroll-reverse' : 'animate-infinite-scroll'}`}>
                {logoRow.map((logo, index) => (
                  <li key={index}><img src={logo.logo} alt={logo.name} className="h-8" /></li>
                ))}
              </ul>
              <ul className={`flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none ${rowIndex === 1 ? 'animate-infinite-scroll-reverse' : 'animate-infinite-scroll'}`} aria-hidden="true">
                {logoRow.map((logo, index) => (
                  <li key={index}><img src={logo.logo} alt={logo.name} className="h-8" /></li>
                ))}
              </ul>
            </div>
          ))}
          {/* Baris 2 */}
          <div className="w-full inline-flex flex-nowrap">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll-reverse">
              {row2Logos.map((logo, index) => (<li key={index}><img src={logo.logo} alt={logo.name} className="h-8" /></li>))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll-reverse" aria-hidden="true">
              {row2Logos.map((logo, index) => (<li key={index}><img src={logo.logo} alt={logo.name} className="h-8" /></li>))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mahasiswa Eligible Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Statistik Mahasiswa Eligible</h2>
            <p className="text-lg text-[#333333] max-w-2xl mx-auto">
              Data mahasiswa yang telah memenuhi syarat untuk mengikuti program magang.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Sisi Kiri: Chart */}
            <div className="lg:col-span-2 h-80 bg-gray-50 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eligibilityData.byMajor} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="!bg-white !border-gray-300 !rounded-lg !shadow-lg" />
                  <Bar dataKey="value" name="Jumlah" radius={[4, 4, 0, 0]}>
                    {eligibilityData.byMajor.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Sisi Kanan: Statistik */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#003366] text-white p-6 rounded-xl text-center">
                <h3 className="text-lg font-semibold opacity-80">Total Mahasiswa Eligible</h3>
                <p className="text-5xl font-bold">{eligibilityData.totalEligible}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-2">Rincian per Prodi:</h4>
                <ul className="space-y-2">
                  {eligibilityData.byMajor.map(item => (
                    <li key={item.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        {item.name}
                      </span>
                      <span className="font-bold text-gray-800">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Menjadi Mahasiswa Eligible Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Cara Menjadi Mahasiswa <span className="text-[#00A59C]">Eligible</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Penuhi kriteria berikut untuk membuka akses ke program-program magang eksklusif kami.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {eligibilityCriteria.map((item, index) => (
              <div key={index} className="flex items-start">
                <item.icon className="h-6 w-6 text-[#00A59C] mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mahasiswa Intern Section */}
      <section className="py-16 bg-[#F8F8F8]">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sisi Kiri: Judul dan Teks */}
          <div className="lg:pr-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Kisah Sukses dari <span className="text-[#00A59C]">Program Kami</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Dengarkan langsung dari para mahasiswa yang telah merasakan manfaat program magang dan bimbingan karier dari CDC Cakrawala.
            </p>
            <p className="text-gray-600">
              Setiap testimoni adalah bukti nyata dari komitmen kami untuk menjembatani dunia akademik dengan industri, membuka pintu bagi para talenta muda untuk meraih karier impian mereka.
            </p>
          </div>

          {/* Sisi Kanan: Marquee Testimonial */}
          <div className="relative flex h-[450px] gap-6 overflow-hidden">
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className="w-1/3 space-y-6">
                <div className={colIndex % 2 === 0 ? 'animate-marquee-up' : 'animate-marquee-down'}>
                  {[...internData.bestInterns, ...internData.bestInterns].map((intern, index) => (
                    <div key={`${colIndex}-${index}`} className={`${index % 2 === 0 ? 'bg-[#003366]' : 'bg-[#00A59C]'} text-white p-6 rounded-xl shadow-lg mb-6`}>
                      <div className="flex items-center mb-3">
                        <img src={intern.photo} alt={intern.name} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white/50" />
                        <div>
                          <p className="font-bold text-base">{intern.name}</p>
                          <p className="text-xs opacity-80">{intern.position}</p>
                        </div>
                      </div>
                      <p className="text-sm opacity-90 italic">"{intern.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F8F8] via-transparent to-[#F8F8F8]"></div>
          </div>
        </div>
      </section>

      {/* Chart Penempatan - Dipindahkan ke sini atau bisa dihapus jika tidak diperlukan lagi */}
      <section className="py-16 bg-white">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Persentase Penempatan Magang</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={internData.placementChart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} labelLine={false}>
                  {internData.placementChart.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Siap Memulai Karier Anda?</h2>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto mb-8">
            Temukan ratusan peluang magang dari perusahaan-perusahaan terbaik yang menjadi mitra kami.
          </p>
          <Link href="/jobs">
            <Button size="lg" className="bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]">
              Jelajahi Lowongan Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}