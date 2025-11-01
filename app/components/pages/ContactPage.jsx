'use client'

import { Button } from '@/app/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/card'
import { Input } from '@/app/components/input'
import { Label } from '@/app/components/label'
import { Mail, MapPinned, Phone } from 'lucide-react'


export default function ContactPage() {
    return (
         <div className="w-full">
      <section className="py-16 bg-[#00A59C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl max-w-3xl mx-auto">Kami siap membantu Anda dalam perjalanan karier</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPinned, title: 'Alamat', detail: 'Jl. Cakrawala No. 123, Bandung, Jawa Barat 40123', color: 'bg-[#003366]' },
                  { icon: Phone, title: 'Telepon', detail: '+62 22 1234 5678', color: 'bg-[#00A59C]' },
                  { icon: Mail, title: 'Email', detail: 'cdc@cakrawala.ac.id', color: 'bg-[#003366]' },
                ].map((item, index) => (
                  <div key={index} className={`${item.color} text-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 flex items-center gap-4`}>
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-base opacity-90">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Jam Operasional</h3>
                <Card className="bg-white">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-semibold">Senin - Jumat</span>
                        <span>08:00 - 16:00 WIB</span>
                      </div>
                      <hr/>
                      <div className="flex justify-between">
                        <span className="font-semibold">Sabtu</span>
                        <span>09:00 - 13:00 WIB</span>
                      </div>
                      <hr/>
                      <div className="flex justify-between">
                        <span className="font-semibold">Minggu</span>
                        <span className="text-red-500 font-medium">Tutup</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama lengkap" className="mt-1"/>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@example.com" className="mt-1"/>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subjek</Label>
                      <Input id="subject" placeholder="Subjek pesan" className="mt-1"/>
                    </div>
                    <div>
                      <Label htmlFor="message">Pesan</Label>
                      <textarea
                        id="message"
                        className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A59C] mt-1"
                        placeholder="Tulis pesan Anda di sini..."
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#00A59C] text-white transition-transform duration-150 hover:opacity-95 active:scale-95 active:bg-[#00A59C]">
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

}
   