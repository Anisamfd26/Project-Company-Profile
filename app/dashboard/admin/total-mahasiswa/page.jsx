'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/app/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/table';
import { ArrowLeft } from 'lucide-react';

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        mahasiswa_details ( prodi, semester )
      `)
      .eq('role', 'MAHASISWA')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error);
      alert('Gagal memuat data mahasiswa.');
    } else {
      setStudents(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Kelola Mahasiswa</h1>
              <p className="text-lg text-gray-600">Lihat semua mahasiswa yang terdaftar.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dasbor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Daftar Semua Mahasiswa</CardTitle>
            <CardDescription>Total {students.length} mahasiswa ditemukan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="4" className="text-center">Memuat data...</TableCell></TableRow>
                ) : students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.mahasiswa_details[0]?.prodi || 'N/A'}</TableCell>
                      <TableCell>{student.mahasiswa_details[0]?.semester || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan="4" className="text-center">Tidak ada mahasiswa yang terdaftar.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

