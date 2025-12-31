'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function ProductDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<any>(null)
    const [categoryName, setCategoryName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch product
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (productError) throw productError
                setProduct(productData)

                // Fetch category name if category_id exists
                if (productData.category_id) {
                    const { data: catData } = await supabase
                        .from('product_categories')
                        .select('name')
                        .eq('id', productData.category_id)
                        .single()

                    if (catData) setCategoryName(catData.name)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!product) return <div className="p-8">Ürün bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-gray-500">{product.sku}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/products/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Temel Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Ürün Adı</span>
                            <p className="text-lg">{product.name}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">SKU (Stok Kodu)</span>
                            <p className="text-lg">{product.sku}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Kategori</span>
                            <p className="text-lg">{categoryName}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Açıklama</span>
                            <p className="text-gray-700">{product.description || '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stok ve Fiyat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Birim Fiyat</span>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(product.price)}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Mevcut Stok</span>
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold">{product.stock_quantity}</p>
                                <span className="text-sm text-gray-400">adet</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
