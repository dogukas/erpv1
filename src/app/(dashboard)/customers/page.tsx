import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CustomersTable } from './customers-table'

async function getCustomers() {
    const supabase = await createClient()

    const { data: customers, error } = await supabase
        .from('customers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching customers:', error)
        return []
    }

    return customers || []
}

export default async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Müşteriler</h1>
                    <p className="text-gray-600">Tüm müşterilerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/customers/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Müşteri
                    </Link>
                </Button>
            </div>

            <CustomersTable data={customers} />
        </div>
    )
}
