'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PurchaseOrderDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<any>(null)
    const [vendorName, setVendorName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return
            try {
                const { data: orderData, error: orderError } = await supabase
                    .from('purchase_orders')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (orderError) throw orderError
                setOrder(orderData)

                if (orderData.vendor_id) {
                    const { data: vendData } = await supabase
                        .from('vendors')
                        .select('name')
                        .eq('id', orderData.vendor_id)
                        .single()

                    if (vendData) setVendorName(vendData.name)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!order) return <div className="p-8">Sipariş bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/purchase-orders">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{order.order_number}</h1>
                        <p className="text-gray-500">{vendorName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/purchase-orders/${id}/edit`}>
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
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Durum</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-sm font-medium capitalize">
                                {order.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Tedarikçi</span>
                            <p className="text-lg">{vendorName}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Toplam Tutar</span>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tarihler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Sipariş Tarihi</span>
                                <span className="text-sm">{formatDate(order.order_date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Beklenen Teslim</span>
                                <span className="text-sm">{order.expected_date ? formatDate(order.expected_date) : '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
