import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getWarehouses() {
    const supabase = await createClient()

    const { data: warehouses, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching warehouses:', error)
        return []
    }

    return warehouses || []
}

export default async function WarehousesPage() {
    const warehouses = await getWarehouses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Depolar</h1>
                    <p className="text-gray-600">Depo ve konumlarınızı yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/warehouses/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Depo
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {warehouses.length > 0 ? (
                    warehouses.map((warehouse: any) => (
                        <Card key={warehouse.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        <Link href={`/warehouses/${warehouse.id}`} className="hover:underline">
                                            {warehouse.name}
                                        </Link>
                                    </CardTitle>
                                    <Badge variant={warehouse.is_active ? "default" : "secondary"}>
                                        {warehouse.is_active ? 'Aktif' : 'Pasif'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {warehouse.code && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Kod:</strong> {warehouse.code}
                                    </p>
                                )}
                                {warehouse.address && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        {warehouse.address}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/warehouses/${warehouse.id}`}>Görüntüle</Link>
                                        </Button>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-600">Henüz depo eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/warehouses/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Depoyu Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
