'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

export default function CategoryDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('product_categories')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setCategory(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCategory()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!category) return <div className="p-8">Kategori bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/categories">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{category.name}</h1>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/categories/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kategori Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-gray-500">Kategori Adı</span>
                        <p className="text-lg">{category.name}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-500">Açıklama</span>
                        <p className="text-gray-700">{category.description || '-'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
