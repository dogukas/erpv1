'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar, Truck } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function DeliveryNoteDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [note, setNote] = useState<any>(null)
    const [orderNumber, setOrderNumber] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('delivery_notes')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setNote(data)

                if (data.sales_order_id) {
                    const { data: orderData } = await supabase
                        .from('sales_orders')
                        .select('order_number')
                        .eq('id', data.sales_order_id)
                        .single()

                    if (orderData) setOrderNumber(orderData.order_number)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchNote()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!note) return <div className="p-8">İrsaliye bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/delivery-notes">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{note.note_number}</h1>
                        <p className="text-gray-500">Sipariş Ref: {orderNumber}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/delivery-notes/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sevk Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Sevk Tarihi</span>
                                <span className="text-sm">{formatDate(note.delivery_date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Durum</span>
                                <span className="text-sm capitalize">{note.status}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Taşıma Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Şoför Adı</span>
                            <p className="text-lg">{note.driver_name || '-'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Araç Plaka</span>
                            <p className="text-lg">{note.vehicle_plate || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
