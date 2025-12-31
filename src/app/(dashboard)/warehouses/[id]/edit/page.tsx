'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditWarehousePage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        capacity: '',
    })

    useEffect(() => {
        const fetchWarehouse = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('warehouses')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        name: data.name,
                        address: data.address || '',
                        capacity: data.capacity ? data.capacity.toString() : '',
                    })
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchWarehouse()
    }, [id, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('warehouses')
                .update({
                    name: formData.name,
                    address: formData.address,
                    capacity: parseInt(formData.capacity) || 0,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/warehouses')
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
                    <Link href="/warehouses">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Depo Düzenle</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Depo Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Depo Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={saving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Adres</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                disabled={saving}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Kapasite</Label>
                            <Input
                                id="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                disabled={saving}
                            />
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
                        <Link href="/warehouses">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
