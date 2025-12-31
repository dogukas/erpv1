import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getPurchaseOrders() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('order_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching purchase orders:', error)
        return []
    }

    return orders || []
}

export default async function PurchaseOrdersPage() {
    const orders = await getPurchaseOrders()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received':
                return 'bg-green-100 text-green-800'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'received':
                return 'Teslim Alındı'
            case 'confirmed':
                return 'Onaylandı'
            case 'pending':
                return 'Beklemede'
            case 'cancelled':
                return 'İptal'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Satın Alma Siparişleri</h1>
                    <p className="text-gray-600">Tedarikçilere verilen siparişleri yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/purchase-orders/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Sipariş
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Siparişler</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order: any) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                            <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/purchase-orders/${order.id}`} className="hover:underline text-indigo-600">
                                                    {order.order_number}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(order.order_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz sipariş yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/purchase-orders/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Siparişi Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
