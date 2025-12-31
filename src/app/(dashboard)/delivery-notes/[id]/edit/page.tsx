'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditDeliveryNotePage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        note_number: '',
        sales_order_id: '',
        delivery_date: '',
        driver_name: '',
        vehicle_plate: '',
        status: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch orders for referencing
                const { data: ordersData } = await supabase
                    .from('sales_orders')
                    .select('id, order_number')
                    .order('order_number')

                if (ordersData) setOrders(ordersData)

                // Fetch note
                const { data, error } = await supabase
                    .from('delivery_notes')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        note_number: data.note_number,
                        sales_order_id: data.sales_order_id || '',
                        delivery_date: data.delivery_date,
                        driver_name: data.driver_name || '',
                        vehicle_plate: data.vehicle_plate || '',
                        status: data.status,
                    })
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('delivery_notes')
                .update({
                    note_number: formData.note_number,
                    sales_order_id: formData.sales_order_id || null,
                    delivery_date: formData.delivery_date,
                    driver_name: formData.driver_name,
                    vehicle_plate: formData.vehicle_plate,
                    status: formData.status,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/delivery-notes')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Yükleniyor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/delivery-notes">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">İrsaliye Düzenle</h1>
                    <p className="text-gray-600">{formData.note_number}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>İrsaliye Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="note_number">İrsaliye No *</Label>
                                <Input
                                    id="note_number"
                                    value={formData.note_number}
                                    onChange={(e) => setFormData({ ...formData, note_number: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sales_order_id">Sipariş Referansı</Label>
                                <Select
                                    value={formData.sales_order_id}
                                    onValueChange={(value) => setFormData({ ...formData, sales_order_id: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sipariş seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orders.map((o) => (
                                            <SelectItem key={o.id} value={o.id}>{o.order_number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="delivery_date">Sevk Tarihi *</Label>
                            <Input
                                id="delivery_date"
                                type="date"
                                value={formData.delivery_date}
                                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="driver_name">Şoför Adı</Label>
                                <Input
                                    id="driver_name"
                                    value={formData.driver_name}
                                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_plate">Araç Plaka</Label>
                                <Input
                                    id="vehicle_plate"
                                    value={formData.vehicle_plate}
                                    onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                disabled={saving}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Hazırlanıyor</SelectItem>
                                    <SelectItem value="in_transit">Yolda</SelectItem>
                                    <SelectItem value="delivered">Teslim Edildi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 mt-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <Button type="button" variant="outline" asChild disabled={saving}>
                        <Link href="/delivery-notes">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
