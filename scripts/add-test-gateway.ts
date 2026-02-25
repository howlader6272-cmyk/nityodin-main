import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function main() {
  const { data, error } = await supabase
    .from('payment_gateways')
    .insert([
      {
        name: 'Test Gateway (UddoktaPay Sandbox)',
        api_base_url: 'https://sandbox.uddoktapay.com/api',
        public_key: 'test_public_key',
        secret_key_encrypted: 'test_secret_key',
        currency: 'BDT',
        environment: 'sandbox',
        is_active: true,
        is_default: false
      }
    ])
    .select();

  if (error) {
    console.error('Error adding test gateway:', error);
  } else {
    console.log('Test gateway added successfully:', data);
  }
}

main();
