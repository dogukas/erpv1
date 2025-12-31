const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read Env
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function runReset() {
    console.log('1. Calling system_hard_reset_sales RPC...');
    const { error } = await supabase.rpc('system_hard_reset_sales');
    if (error) {
        console.error('Reset Error:', error);
        return;
    }
    console.log('✅ Sales history wiped clean.');

    console.log('2. Inserting clean test record (25,000 TL)...');

    // Get a company and customer first to link
    const { data: companies } = await supabase.from('companies').select('id').limit(1);
    const { data: customers } = await supabase.from('customers').select('id').limit(1);

    if (!companies?.length || !customers?.length) {
        console.error('❌ Cannot seed: Company or Customer not found.');
        return;
    }

    const { error: insertError } = await supabase.from('sales_orders').insert({
        company_id: companies[0].id,
        customer_id: customers[0].id,
        order_number: 'SO-CLEAN-001',
        total_amount: 25000.00,
        status: 'confirmed',
        order_date: new Date().toISOString()
    });

    if (insertError) {
        console.error('Insert Error:', insertError);
    } else {
        console.log('✅ New confirmed order inserted.');
    }
}

runReset();
