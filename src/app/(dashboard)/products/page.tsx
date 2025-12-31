import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductsTable } from './products-table'

async function getProducts() {
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return products || []
}

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Ürünler</h1>
                    <p className="text-gray-600">Tüm ürünlerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ürün
                    </Link>
                </Button>
            </div>

            <ProductsTable data={products} />
        </div>
    )
}
