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

export default function EditPaymentPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [invoices, setInvoices] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        payment_date: '',
        amount: '',
        payment_type: '',
        payment_method: '',
        invoice_id: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch invoices for referencing
                const { data: invoicesData } = await supabase
                    .from('invoices')
                    .select('id, invoice_number')
                    .eq('status', 'pending')

                if (invoicesData) setInvoices(invoicesData)

                // Fetch payment
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        payment_date: data.payment_date,
                        amount: data.amount ? data.amount.toString() : '',
                        payment_type: data.payment_type,
                        payment_method: data.payment_method,
                        invoice_id: data.invoice_id || '',
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
                .from('payments')
                .update({
                    payment_date: formData.payment_date,
                    amount: parseFloat(formData.amount) || 0,
                    payment_type: formData.payment_type,
                    payment_method: formData.payment_method,
                    invoice_id: formData.invoice_id || null,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/payments')
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
                    <Link href="/payments">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Ödeme Düzenle</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Ödeme Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="payment_type">İşlem Türü</Label>
                                <Select
                                    value={formData.payment_type}
                                    onValueChange={(value) => setFormData({ ...formData, payment_type: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="received">Tahsilat (Gelen)</SelectItem>
                                        <SelectItem value="sent">Ödeme (Giden)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_date">Tarih *</Label>
                                <Input
                                    id="payment_date"
                                    type="date"
                                    value={formData.payment_date}
                                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Tutar (₺) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Ödeme Yöntemi</Label>
                                <Select
                                    value={formData.payment_method}
                                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank_transfer">Havale/EFT</SelectItem>
                                        <SelectItem value="credit_card">Kredi Kartı</SelectItem>
                                        <SelectItem value="cash">Nakit</SelectItem>
                                        <SelectItem value="check">Çek</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="invoice_id">Fatura Referansı</Label>
                            <Select
                                value={formData.invoice_id}
                                onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
                                disabled={saving}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Fatura seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {invoices.map((i) => (
                                        <SelectItem key={i.id} value={i.id}>{i.invoice_number}</SelectItem>
                                    ))}
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
                        <Link href="/payments">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
