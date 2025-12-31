'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function WarehouseDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [warehouse, setWarehouse] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWarehouse = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('warehouses')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setWarehouse(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchWarehouse()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!warehouse) return <div className="p-8">Depo bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/warehouses">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{warehouse.name}</h1>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/warehouses/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Genel Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Depo Adı</span>
                            <p className="text-lg">{warehouse.name}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Kapasite</span>
                            <p className="text-lg">{warehouse.capacity ? `${warehouse.capacity} Birim` : '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Konum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Adres</span>
                                <span className="text-sm whitespace-pre-wrap">{warehouse.address || '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
