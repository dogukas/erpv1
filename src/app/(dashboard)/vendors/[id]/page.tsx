'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Mail, Phone, MapPin, User } from 'lucide-react'
import Link from 'next/link'

export default function VendorDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [vendor, setVendor] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVendor = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setVendor(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchVendor()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!vendor) return <div className="p-8">Tedarikçi bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/vendors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{vendor.name}</h1>
                        <p className="text-gray-500">{vendor.tax_id ? `VKN: ${vendor.tax_id}` : ''}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/vendors/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>İletişim Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">İlgili Kişi</span>
                                <span className="text-sm">{vendor.contact_person || '-'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">E-posta</span>
                                <span className="text-sm">{vendor.email || '-'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Telefon</span>
                                <span className="text-sm">{vendor.phone || '-'}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Adres</span>
                                <span className="text-sm whitespace-pre-wrap">{vendor.address || '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
