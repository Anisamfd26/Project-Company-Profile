'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/card'
import { Users, Briefcase, Calendar, Award, CheckCircle2 } from 'lucide-react'

export default function ProgramsPage() {
return (
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
}
 