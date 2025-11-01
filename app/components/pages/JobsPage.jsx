'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/card'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { Badge } from '@/app/components/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/select'
import { Building2, Briefcase, MapPin, Clock } from 'lucide-react'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterTag, setFilterTag] = useState('all')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
    fetchJobs()
  }, [searchTerm, filterLocation, filterTag])

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs?search=${searchTerm}&locationType=${filterLocation}&tag=${filterTag}`)
      const data = await response.json()
      // Pastikan data yang diterima adalah array sebelum mengupdate state
      if (Array.isArray(data)) {
        setJobs(data)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleApplyJob = async (jobId) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk melamar pekerjaan.')
      return
    }
    // Logic untuk apply job bisa ditambahkan di sini
    console.log('Applying for job', jobId)
  }

  return (
    <div className="w-full">
      <section className="py-16 bg-[#00A59C] text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Lowongan Magang</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">Temukan kesempatan magang yang sesuai dengan minat dan keahlianmu</p>
          
          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
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
            <p className="text-lg text-gray-700">
              Menampilkan <span className="font-bold text-[#00A59C]">{jobs.length}</span> lowongan magang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-[#00A59C]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800">{job.position}</CardTitle>
                        <CardDescription className="font-semibold text-gray-600">{job.companies?.name}</CardDescription>
                      </div>
                    </div>
                  </div>
                  {job.tag && (
                    <Badge className={job.tag === 'Berbayar' ? 'bg-[#FFC300] text-gray-900' : 'bg-[#00A59C] text-white'}>
                      {job.tag}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.locationType} - {job.companies?.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Briefcase className="h-4 w-4 mr-2 text-[#00A59C]" />
                      {job.salary || 'Kompetitif'}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-[#00A59C]" />
                      Tutup: {new Date(job.closingDate).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <Button onClick={() => handleApplyJob(job.id)} className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]">
                    Lamar Sekarang
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak ada lowongan ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
   