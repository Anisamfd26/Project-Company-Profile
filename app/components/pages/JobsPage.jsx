'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/card'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { Badge } from '@/app/components/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/app/components/dialog' // Asumsi Anda memiliki komponen ini
import { Building2, Briefcase, FileText, Clock, CheckCircle } from 'lucide-react'

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
    fetchJobs()
  }, [searchTerm])

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('lowongan_magang')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        // Mencari di kolom 'job_description' ATAU 'company_name'
        query = query.or(`job_description.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false);
    }
  }

  const handlePreviewClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="w-full">
      <section className="py-16 bg-[#00A59C] text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-center">Lowongan Magang</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">Temukan kesempatan magang yang sesuai dengan minat dan keahlianmu</p>
          
          {/* Search and Filter */}
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="search" className="text-[#003366]">Cari Posisi atau Perusahaan</Label>
                <Input
                  id="search"
                  placeholder="Cari posisi atau perusahaan..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="mt-1"
                />
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
                      <img src={job.company_logo_url || 'https://via.placeholder.com/150'} alt={`${job.company_name} logo`} className="h-14 w-14 rounded-lg object-contain bg-gray-100 p-1" />
                      <div>
                        <CardTitle className="text-lg text-gray-800">{job.job_description}</CardTitle>
                        <CardDescription className="font-semibold text-gray-600">{job.company_name}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.company_description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <FileText className="h-4 w-4 mr-2 text-[#00A59C]" />
                      <span className="font-semibold">Kualifikasi:</span>&nbsp;
                      <span className="line-clamp-1">{job.qualification}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-[#00A59C]" />
                      Diposting: {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto pt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full" onClick={() => handlePreviewClick(job)}>
                    Lihat Detail
                  </Button>
                  <Button asChild className="w-full bg-[#00A59C] text-white">
                    <Link href={`/jobs/${job.id}/apply`}>Lamar Sekarang</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {!loading && jobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Tidak ada lowongan ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>

      {/* Job Preview Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <img src={selectedJob.company_logo_url || 'https://via.placeholder.com/150'} alt={`${selectedJob.company_name} logo`} className="h-20 w-20 rounded-lg object-contain bg-gray-100 p-2" />
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-800">{selectedJob.job_description}</DialogTitle>
                    <DialogDescription className="text-lg text-gray-600 font-medium">{selectedJob.company_name}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Perusahaan</h3>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{selectedJob.company_description || 'Tidak ada deskripsi perusahaan.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kualifikasi</h3>
                  <ul className="space-y-2">
                    {selectedJob.qualification.split('\n').map((q, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => setSelectedJob(null)}>
                  Tutup
                </Button>
                <Button asChild className="bg-[#00A59C] text-white">
                  <Link href={`/jobs/${selectedJob.id}/apply`}>Lamar Sekarang</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
   