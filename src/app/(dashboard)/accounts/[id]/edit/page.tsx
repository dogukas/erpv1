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

export default function EditAccountPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        account_code: '',
        account_name: '',
        account_type: '',
    })

    useEffect(() => {
        const fetchAccount = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('chart_of_accounts')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        account_code: data.account_code,
                        account_name: data.account_name,
                        account_type: data.account_type,
                    })
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAccount()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('chart_of_accounts')
                .update({
                    account_code: formData.account_code,
                    account_name: formData.account_name,
                    account_type: formData.account_type,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/accounts')
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
                    <Link href="/accounts">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Hesap Düzenle</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Hesap Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="account_code">Hesap Kodu *</Label>
                                <Input
                                    id="account_code"
                                    value={formData.account_code}
                                    onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account_name">Hesap Adı *</Label>
                                <Input
                                    id="account_name"
                                    value={formData.account_name}
                                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account_type">Hesap Türü</Label>
                            <Select
                                value={formData.account_type}
                                onValueChange={(value) => setFormData({ ...formData, account_type: value })}
                                disabled={saving}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asset">Varlık</SelectItem>
                                    <SelectItem value="liability">Yükümlülük</SelectItem>
                                    <SelectItem value="equity">Özkaynak</SelectItem>
                                    <SelectItem value="revenue">Gelir</SelectItem>
                                    <SelectItem value="expense">Gider</SelectItem>
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
                        <Link href="/accounts">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
