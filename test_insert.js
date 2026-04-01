const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://lvekfodhplhhghkcyavb.supabase.co";
const SUPABASE_ANON = "sb_publishable_QQDhawEc_ivB22vh0K1UMw_J7OILylF";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function run() {
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@cakrawala.ac.id',
    password: 'AdminPassword123!'
  });
  
  if (authErr) { console.error('Auth Error:', authErr); return; }
  console.log('✅ Logged in as:', auth.user.email);
  
  const { data, error } = await supabase.from('lowongan_magang').insert([{
    company_name: 'Test Co',
    job_description: 'Test Job',
    qualification: 'Test QA',
    is_active: true
  }]).select();
  
  if (error) {
     console.log('❌ Insert Error:', error);
  } else {
     console.log('✅ Insert Result:', data);
  }
}
run();
