'use client';

import { useState } from 'react';
// Impor client Supabase untuk browser
import { supabase } from '@/lib/supabase/client'; 
import { useRouter } from 'next/navigation';

// Asumsi Anda memiliki komponen UI ini dari shadcn/ui
// (Pastikan Anda sudah menginstalnya: npx shadcn-ui@latest add button input label select card)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('MAHASISWA'); // Default role
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kirim data pendaftaran ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Kirim data tambahan (role & nama) ke Supabase
        // Ini akan ditangkap oleh trigger 'handle_new_user' yang Anda buat di SQL
        data: {
          full_name: fullName,
          role: role 
        }
      }
    });

    setLoading(false);

    if (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    } else {
      // Pendaftaran berhasil
      console.log('Pendaftaran berhasil:', data.user);
      // Supabase biasanya mengirim email konfirmasi jika Anda mengaktifkannya
      alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      router.push('/auth/login'); // Arahkan ke halaman login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-900">
            Daftar Akun Baru
          </CardTitle>
          <CardDescription className="text-center">
            Buat akun CDC untuk memulai perjalanan karier Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="contoh@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <Label htmlFor="role">Daftar Sebagai</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih peran Anda..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAHASISWA">Mahasiswa</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
                {error}
              </p>
            )}
            
            <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}