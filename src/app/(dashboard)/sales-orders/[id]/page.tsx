'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SalesOrderDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState<any>(null)
    const [customerName, setCustomerName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch order
                const { data: orderData, error: orderError } = await supabase
                    .from('sales_orders')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (orderError) throw orderError
                setOrder(orderData)

                // Fetch customer name
                if (orderData.customer_id) {
                    const { data: custData } = await supabase
                        .from('customers')
                        .select('name')
                        .eq('id', orderData.customer_id)
                        .single()

                    if (custData) setCustomerName(custData.name)
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
    if (!order) return <div className="p-8">Sipariş bulunamadı.</div>

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        }
        const labels: Record<string, string> = {
            pending: 'Beklemede',
            confirmed: 'Onaylandı',
            shipped: 'Kargolandı',
            delivered: 'Teslim Edildi',
            cancelled: 'İptal',
        }
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/sales-orders">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{order.order_number}</h1>
                        <p className="text-gray-500">{customerName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/sales-orders/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Sipariş Detayları</span>
                            {getStatusBadge(order.status)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-sm font-medium text-gray-500 block mb-1">Müşteri</span>
                                <p className="text-lg font-medium">{customerName}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-500 block mb-1">Toplam Tutar</span>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(order.total_amount)}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
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
                                    <span className="text-xs font-medium text-gray-500 block">Teslim Tarihi</span>
                                    <span className="text-sm">{order.delivery_date ? formatDate(order.delivery_date) : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gelecekte buraya sipariş kalemleri (Items) veya notlar gelebilir */}
                <Card>
                    <CardHeader>
                        <CardTitle>Diğer Bilgiler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 italic text-sm">
                            Sipariş kalemleri tablosu yakında eklenecek...
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
