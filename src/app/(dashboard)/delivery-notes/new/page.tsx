'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewDeliveryNotePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        note_number: '',
        sales_order_id: '',
        delivery_date: '',
        driver_name: '',
        vehicle_plate: '',
        status: 'pending',
    })

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase.from('sales_orders').select('id, order_number').order('order_number')
            if (data) setOrders(data)
        }
        fetchOrders()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Kullanıcı bulunamadı')
            }

            const { data: userCompany, error: companyError } = await supabase
                .from('user_companies')
                .select('company_id')
                .eq('user_id', user.id)
                .eq('is_default', true)
                .single()

            if (companyError || !userCompany) {
                throw new Error('Şirket bilgisi bulunamadı.')
            }

            const { error } = await supabase.from('delivery_notes').insert({
                company_id: userCompany.company_id,
                note_number: formData.note_number,
                sales_order_id: formData.sales_order_id || null,
                delivery_date: formData.delivery_date,
                driver_name: formData.driver_name,
                vehicle_plate: formData.vehicle_plate,
                status: formData.status,
            })

            if (error) throw error

            router.push('/delivery-notes')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
                    <h1 className="text-3xl font-bold">Yeni İrsaliye</h1>
                    <p className="text-gray-600">Yeni irsaliye oluşturun</p>
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
                                    placeholder="IRS-2024-001"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sales_order_id">Sipariş Referansı</Label>
                                <Select
                                    value={formData.sales_order_id}
                                    onValueChange={(value) => setFormData({ ...formData, sales_order_id: value })}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sipariş seçin (Opsiyonel)" />
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
                                disabled={loading}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="driver_name">Şoför Adı</Label>
                                <Input
                                    id="driver_name"
                                    value={formData.driver_name}
                                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                                    placeholder="Ali Veli"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vehicle_plate">Araç Plaka</Label>
                                <Input
                                    id="vehicle_plate"
                                    value={formData.vehicle_plate}
                                    onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                                    placeholder="34 ABC 123"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Durum</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                disabled={loading}
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
                    <Button type="button" variant="outline" asChild disabled={loading}>
                        <Link href="/delivery-notes">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
