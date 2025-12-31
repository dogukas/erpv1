import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getVendors() {
    const supabase = await createClient()

    const { data: vendors, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching vendors:', error)
        return []
    }

    return vendors || []
}

export default async function VendorsPage() {
    const vendors = await getVendors()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tedarikçiler</h1>
                    <p className="text-gray-600">Tedarikçilerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/vendors/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Tedarikçi
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vendors.length > 0 ? (
                    vendors.map((vendor: any) => (
                        <Card key={vendor.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        <Link href={`/vendors/${vendor.id}`} className="hover:underline">
                                            {vendor.name}
                                        </Link>
                                    </CardTitle>
                                    <Badge variant="default">Aktif</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {vendor.vendor_code && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Kod:</strong> {vendor.vendor_code}
                                    </p>
                                )}
                                {vendor.email && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>E-posta:</strong> {vendor.email}
                                    </p>
                                )}
                                {vendor.phone && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        <strong>Telefon:</strong> {vendor.phone}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/vendors/${vendor.id}`}>Görüntüle</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-600">Henüz tedarikçi eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/vendors/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Tedarikçiyi Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
