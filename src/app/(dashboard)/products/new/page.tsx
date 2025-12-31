'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        product_code: '',
        name: '',
        description: '',
        cost_price: '',
        sale_price: '',
        track_inventory: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Get current user's company_id
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Kullanıcı bulunamadı')
            }

            // Get user's company
            const { data: userCompany, error: companyError } = await supabase
                .from('user_companies')
                .select('company_id')
                .eq('user_id', user.id)
                .eq('is_default', true)
                .single()

            if (companyError || !userCompany) {
                throw new Error('Şirket bilgisi bulunamadı. Lütfen hesap ayarlarınızı kontrol edin.')
            }

            // Insert product with company_id
            const { error } = await supabase.from('products').insert({
                company_id: userCompany.company_id,
                product_code: formData.product_code,
                name: formData.name,
                description: formData.description,
                cost_price: parseFloat(formData.cost_price) || 0,
                sale_price: parseFloat(formData.sale_price) || 0,
                track_inventory: formData.track_inventory,
                currency: 'TRY',
            })

            if (error) throw error

            router.push('/products')
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
                    <Link href="/products">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Ürün</h1>
                    <p className="text-gray-600">Yeni ürün ekleyin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
                        <TabsTrigger value="pricing">Fiyatlandırma</TabsTrigger>
                        <TabsTrigger value="inventory">Stok</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ürün Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_code">Ürün Kodu *</Label>
                                        <Input
                                            id="product_code"
                                            value={formData.product_code}
                                            onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Ürün Adı *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Açıklama</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pricing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fiyatlar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cost_price">Maliyet Fiyatı (₺)</Label>
                                        <Input
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            value={formData.cost_price}
                                            onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sale_price">Satış Fiyatı (₺) *</Label>
                                        <Input
                                            id="sale_price"
                                            type="number"
                                            step="0.01"
                                            value={formData.sale_price}
                                            onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inventory" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Stok Ayarları</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="track_inventory"
                                        checked={formData.track_inventory}
                                        onChange={(e) => setFormData({ ...formData, track_inventory: e.target.checked })}
                                        disabled={loading}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="track_inventory">Stok takibi yap</Label>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" asChild disabled={loading}>
                        <Link href="/products">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
