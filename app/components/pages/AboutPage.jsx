'use client'

import { Separator } from '@/app/components/separator'
import { CheckCircle2, GraduationCap, Linkedin } from 'lucide-react'

export default function AboutPage() {
  return (
      <div className="w-full">
      <section className="py-16 bg-[#00A59C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Kenali CDC Cakrawala Lebih Dekat</h1>
          <p className="text-xl max-w-3xl mx-auto">Temukan Tujuan, Tugas, dan Komitmen Kami dalam Mencetak Generasi Unggul</p>
        </div>
      </section>

      {/* Apa Itu CDC Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Sisi Kiri: Teks */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Apa Itu Career Development Center?</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Career Development Center (CDC) adalah unit khusus di perguruan tinggi yang fokus membantu mahasiswa dalam pengembangan karier. Di sini, mahasiswa bisa mendapatkan berbagai layanan untuk mempersiapkan diri masuk ke dunia kerja.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Lewat program-programnya, CDC bantu mahasiswa mengenali potensi diri, memahami kebutuhan pasar kerja, dan membangun koneksi profesional yang relevan.
            </p>
          </div>
          {/* Sisi Kanan: Logo */}
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-br from-[#00A59C] to-[#003366] p-8 rounded-full shadow-lg">
              <GraduationCap className="h-32 w-32 text-white" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Tujuan dan Tugas CDC Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Tujuan CDC */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Tujuan Career Development Center</h3>
            <ul className="space-y-4">
              {[
                'Menyiapkan Mahasiswa untuk Dunia Kerja',
                'Membantu Mahasiswa Memahami Potensi Diri',
                'Menyediakan Akses ke Informasi Karier',
                'Membangun Jaringan dengan Dunia Industri',
                'Meningkatkan Daya Saing Lulusan',
                'Mendukung Perkembangan Perguruan Tinggi',
                'Memfasilitasi Transisi dari Dunia Pendidikan ke Dunia Kerja',
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Tugas CDC */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Tugas Career Development Center</h3>
            <ul className="space-y-4">
              {[
                'Fasilitator Pengembangan Karier',
                'Pusat Informasi Karier',
                'Pelatihan dan Pengembangan Keterampilan',
                'Bimbingan Karier',
                'Jaringan dan Kerja Sama dengan Industri',
                'Pusat Informasi dan Data Alumni',
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#00A59C] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tim Kami Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Tim <span className="text-[#00A59C]">Profesional Kami</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Tim profesional yang berdedikasi untuk kesuksesan karier Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Dr. Siti Nurhaliza, M.M.', position: 'Direktur CDC', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', color: 'bg-[#003366]', linkedin: 'https://linkedin.com/in/siti-nurhaliza' },
              { name: 'Ahmad Fauzi, S.Psi., M.Psi.', position: 'Kepala Bimbingan Karier', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', color: 'bg-[#00A59C]', linkedin: 'https://linkedin.com/in/ahmad-fauzi' },
              { name: 'Linda Wijaya, S.E., M.B.A.', position: 'Manajer Kemitraan Industri', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop', color: 'bg-[#003366]', linkedin: 'https://linkedin.com/in/linda-wijaya' }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="h-56 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className={`${member.color} text-white p-6 text-center`}>
                  <h4 className="text-xl font-bold">{member.name}</h4>
                  <p className="text-sm text-white/80 mt-1 mb-4">{member.position}</p>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                    <Linkedin className="h-5 w-5 text-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}