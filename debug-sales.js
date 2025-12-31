const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read env vars
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
    fs.writeFileSync('debug-output.txt', 'ERROR: Could not read Supabase credentials');
    process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    log('--- DIAGNOSTIC START ---');
    log('Timestamp: ' + new Date().toISOString());

    // 2. Call RPC
    log('\n[1] Calling get_dashboard_stats RPC...');
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_dashboard_stats');
    if (rpcError) {
        log('RPC Error: ' + JSON.stringify(rpcError));
    } else {
        log('RPC Result: ' + JSON.stringify(rpcData, null, 2));
    }

    // 3. Raw Query (Manual Sum)
    log('\n[2] Fetching confirmed orders manually...');
    const { data: orders, error: queryError } = await supabase
        .from('sales_orders')
        .select('order_number, status, total_amount')
        .in('status', ['confirmed', 'completed', 'approved', 'paid', 'shipped', 'delivered']);

    if (queryError) {
        log('Query Error: ' + JSON.stringify(queryError));
    } else {
        log(`Found ${orders.length} confirmed orders:`);
        let manualSum = 0;
        orders.forEach(o => {
            log(` - ${o.order_number} (${o.status}): ${o.total_amount}`);
            manualSum += Number(o.total_amount || 0);
        });
        log(`Manual Sum: ${manualSum}`);

        if (rpcData && Math.abs(manualSum - (rpcData.revenue || 0)) < 0.01) {
            log('\n✅ PASS: RPC matches Manual Sum.');
        } else {
            log('\n❌ FAIL: RPC does NOT match Manual Sum.');
        }
    }

    // 4. Check Pending Orders
    const { data: pending } = await supabase
        .from('sales_orders')
        .select('total_amount')
        .eq('status', 'pending');

    const pendingSum = pending?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
    log(`\n[3] Pending Orders Sum: ${pendingSum} (Should NOT be in revenue)`);

    log('--- DIAGNOSTIC END ---');

    fs.writeFileSync('debug-output.txt', output);
}

diagnose();
