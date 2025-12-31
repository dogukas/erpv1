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

export default function NewPurchaseOrderPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [vendors, setVendors] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        order_number: '',
        vendor_id: '',
        order_date: '',
        expected_date: '',
        total_amount: '',
        status: 'pending',
    })

    useEffect(() => {
        const fetchVendors = async () => {
            const { data } = await supabase.from('vendors').select('id, name').order('name')
            if (data) setVendors(data)
        }
        fetchVendors()
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

            const { error } = await supabase.from('purchase_orders').insert({
                company_id: userCompany.company_id,
                order_number: formData.order_number,
                vendor_id: formData.vendor_id,
                order_date: formData.order_date,
                expected_date: formData.expected_date || null,
                total_amount: parseFloat(formData.total_amount) || 0,
                status: formData.status,
            })

            if (error) throw error

            router.push('/purchase-orders')
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
                    <Link href="/purchase-orders">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Satın Alma Siparişi</h1>
                    <p className="text-gray-600">Yeni satın alma siparişi oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Sipariş Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="order_number">Sipariş No *</Label>
                                <Input
                                    id="order_number"
                                    value={formData.order_number}
                                    onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                                    placeholder="SAS-2024-001"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vendor_id">Tedarikçi *</Label>
                                <Select
                                    value={formData.vendor_id}
                                    onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tedarikçi seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.map((v) => (
                                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="order_date">Sipariş Tarihi *</Label>
                                <Input
                                    id="order_date"
                                    type="date"
                                    value={formData.order_date}
                                    onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expected_date">Beklenen Teslim</Label>
                                <Input
                                    id="expected_date"
                                    type="date"
                                    value={formData.expected_date}
                                    onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="total_amount">Toplam Tutar (₺)</Label>
                                <Input
                                    id="total_amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.total_amount}
                                    onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
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
                                        <SelectItem value="pending">Beklemede</SelectItem>
                                        <SelectItem value="confirmed">Onaylandı</SelectItem>
                                        <SelectItem value="received">Teslim Alındı</SelectItem>
                                        <SelectItem value="cancelled">İptal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        <Link href="/purchase-orders">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
