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

export default function EditInvoicePage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [customers, setCustomers] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        invoice_number: '',
        customer_id: '',
        invoice_date: '',
        due_date: '',
        total_amount: '',
        status: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch customers
                const { data: customersData } = await supabase
                    .from('customers')
                    .select('id, name')
                    .order('name')

                if (customersData) setCustomers(customersData)

                // Fetch invoice
                const { data, error } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        invoice_number: data.invoice_number,
                        customer_id: data.customer_id,
                        invoice_date: data.invoice_date,
                        due_date: data.due_date,
                        total_amount: data.total_amount ? data.total_amount.toString() : '',
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
                .from('invoices')
                .update({
                    invoice_number: formData.invoice_number,
                    customer_id: formData.customer_id,
                    invoice_date: formData.invoice_date,
                    due_date: formData.due_date,
                    total_amount: parseFloat(formData.total_amount) || 0,
                    status: formData.status,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/invoices')
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
                    <Link href="/invoices">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Fatura Düzenle</h1>
                    <p className="text-gray-600">{formData.invoice_number}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Fatura Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="invoice_number">Fatura No *</Label>
                                <Input
                                    id="invoice_number"
                                    value={formData.invoice_number}
                                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer_id">Müşteri *</Label>
                                <Select
                                    value={formData.customer_id}
                                    onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Müşteri seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="invoice_date">Fatura Tarihi *</Label>
                                <Input
                                    id="invoice_date"
                                    type="date"
                                    value={formData.invoice_date}
                                    onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Vade Tarihi *</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    required
                                    disabled={saving}
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
                                    disabled={saving}
                                />
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
                                        <SelectItem value="draft">Taslak</SelectItem>
                                        <SelectItem value="pending">Beklemede</SelectItem>
                                        <SelectItem value="paid">Ödendi</SelectItem>
                                        <SelectItem value="overdue">Gecikmiş</SelectItem>
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
                    <Button type="button" variant="outline" asChild disabled={saving}>
                        <Link href="/invoices">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
