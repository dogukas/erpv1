'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewRequisitionPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        requisition_number: '',
        request_date: '',
        required_date: '',
        status: 'pending',
    })

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

            const { error } = await supabase.from('purchase_requisitions').insert({
                company_id: userCompany.company_id,
                requisition_number: formData.requisition_number,
                requester_id: user.id, // Assuming current user is requester
                request_date: formData.request_date,
                required_date: formData.required_date || null,
                status: formData.status,
            })

            if (error) throw error

            router.push('/requisitions')
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
                    <Link href="/requisitions">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Satın Alma Talebi</h1>
                    <p className="text-gray-600">Yeni talep oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Talep Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="requisition_number">Talep No *</Label>
                            <Input
                                id="requisition_number"
                                value={formData.requisition_number}
                                onChange={(e) => setFormData({ ...formData, requisition_number: e.target.value })}
                                placeholder="TLP-2024-001"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="request_date">Talep Tarihi *</Label>
                                <Input
                                    id="request_date"
                                    type="date"
                                    value={formData.request_date}
                                    onChange={(e) => setFormData({ ...formData, request_date: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="required_date">İhtiyaç Tarihi</Label>
                                <Input
                                    id="required_date"
                                    type="date"
                                    value={formData.required_date}
                                    onChange={(e) => setFormData({ ...formData, required_date: e.target.value })}
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
                                    <SelectItem value="pending">Beklemede</SelectItem>
                                    <SelectItem value="approved">Onaylandı</SelectItem>
                                    <SelectItem value="rejected">Reddedildi</SelectItem>
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
                        <Link href="/requisitions">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
