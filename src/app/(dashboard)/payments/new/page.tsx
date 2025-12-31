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

export default function NewPaymentPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [invoices, setInvoices] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        payment_date: '',
        amount: '',
        payment_type: 'received',
        payment_method: 'bank_transfer',
        invoice_id: '',
    })

    useEffect(() => {
        const fetchInvoices = async () => {
            const { data } = await supabase.from('invoices').select('id, invoice_number').eq('status', 'pending')
            if (data) setInvoices(data)
        }
        fetchInvoices()
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

            const { error } = await supabase.from('payments').insert({
                company_id: userCompany.company_id,
                payment_date: formData.payment_date,
                amount: parseFloat(formData.amount) || 0,
                payment_type: formData.payment_type,
                payment_method: formData.payment_method,
                invoice_id: formData.invoice_id || null,
            })

            if (error) throw error

            router.push('/payments')
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
                    <Link href="/payments">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Ödeme</h1>
                    <p className="text-gray-600">Yeni ödeme veya tahsilat kaydedin</p>
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payment_method">Ödeme Yöntemi</Label>
                                <Select
                                    value={formData.payment_method}
                                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                                    disabled={loading}
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
                            <Label htmlFor="invoice_id">Fatura Referansı (Opsiyonel)</Label>
                            <Select
                                value={formData.invoice_id}
                                onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
                                disabled={loading}
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
                    <Button type="button" variant="outline" asChild disabled={loading}>
                        <Link href="/payments">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
