'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/app/components/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/app/components/card'
import { Badge } from '@/app/components/badge'
import { Building2, MapPinned } from 'lucide-react'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch('/api/companies')
        const data = await response.json()
        setCompanies(data)
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }

    fetchCompanies()
  }, [])

    return (
        <div className="w-full">
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Perusahaan Mitra</h1>
          <p className="text-xl max-w-3xl mx-auto">Perusahaan terkemuka yang menjadi mitra CDC Cakrawala University</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <Link href="/jobs" className="w-full">
                    <Button variant="outline" className="w-full border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white">
                      Lihat Lowongan
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
 }
    