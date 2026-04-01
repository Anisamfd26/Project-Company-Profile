const { Client } = require('pg');
const DATABASE_URL = 'postgresql://postgres.lvekfodhplhhghkcyavb:CwmCLAtvOZzBUacs@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';

const query = `
-- 1. Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'::public.user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old policies
DROP POLICY IF EXISTS "Admin can manage Lowongan." ON public.lowongan_magang;
DROP POLICY IF EXISTS "Admin can manage Berita/Acara." ON public.berita_acara;

-- 3. Recreate policies utilizing the function securely
CREATE POLICY "Admin can manage Lowongan." 
ON public.lowongan_magang 
FOR ALL 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can manage Berita/Acara." 
ON public.berita_acara 
FOR ALL 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());
`;

async function fixRLS() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    try {
        await client.connect();
        await client.query(query);
        console.log('✅ RLS Policies updated successfully!');
    } catch (err) {
        console.error('❌ Error updating RLS:', err);
    } finally {
        await client.end();
    }
}
fixRLS();
