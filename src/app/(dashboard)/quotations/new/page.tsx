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

export default function NewQuotationPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        quotation_number: '',
        customer_id: '',
        quotation_date: '',
        valid_until: '',
        total_amount: '',
        status: 'pending',
    })

    useEffect(() => {
        const fetchCustomers = async () => {
            const { data } = await supabase.from('customers').select('id, name').order('name')
            if (data) setCustomers(data)
        }
        fetchCustomers()
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

            const { error } = await supabase.from('quotations').insert({
                company_id: userCompany.company_id,
                quotation_number: formData.quotation_number,
                customer_id: formData.customer_id,
                quotation_date: formData.quotation_date,
                valid_until: formData.valid_until || null,
                total_amount: parseFloat(formData.total_amount) || 0,
                status: formData.status,
            })

            if (error) throw error

            router.push('/quotations')
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
                    <Link href="/quotations">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Teklif</h1>
                    <p className="text-gray-600">Yeni satış teklifi oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Teklif Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="quotation_number">Teklif No *</Label>
                                <Input
                                    id="quotation_number"
                                    value={formData.quotation_number}
                                    onChange={(e) => setFormData({ ...formData, quotation_number: e.target.value })}
                                    placeholder="TEK-2024-001"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer_id">Müşteri *</Label>
                                <Select
                                    value={formData.customer_id}
                                    onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                                    disabled={loading}
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
                                <Label htmlFor="quotation_date">Teklif Tarihi *</Label>
                                <Input
                                    id="quotation_date"
                                    type="date"
                                    value={formData.quotation_date}
                                    onChange={(e) => setFormData({ ...formData, quotation_date: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="valid_until">Geçerlilik Tarihi</Label>
                                <Input
                                    id="valid_until"
                                    type="date"
                                    value={formData.valid_until}
                                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
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
                                        <SelectItem value="draft">Taslak</SelectItem>
                                        <SelectItem value="sent">Gönderildi</SelectItem>
                                        <SelectItem value="approved">Onaylandı</SelectItem>
                                        <SelectItem value="rejected">Reddedildi</SelectItem>
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
                        <Link href="/quotations">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
