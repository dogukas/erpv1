import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ArrowDown, ArrowUp, Package } from 'lucide-react'

async function getStockMovements() {
    const supabase = await createClient()

    const { data: movements, error } = await supabase
        .from('stock_movements')
        .select('*')
        .order('movement_date', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching stock movements:', error)
        return []
    }

    return movements || []
}

export default async function StockMovementsPage() {
    const movements = await getStockMovements()

    const getMovementIcon = (type: string) => {
        switch (type) {
            case 'in':
                return <ArrowDown className="h-4 w-4 text-green-600" />
            case 'out':
                return <ArrowUp className="h-4 w-4 text-red-600" />
            default:
                return <Package className="h-4 w-4 text-blue-600" />
        }
    }

    const getMovementLabel = (type: string) => {
        switch (type) {
            case 'in':
                return 'Giriş'
            case 'out':
                return 'Çıkış'
            case 'adjustment':
                return 'Düzeltme'
            case 'transfer':
                return 'Transfer'
            default:
                return type
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Stok Hareketleri</h1>
                <p className="text-gray-600">Tüm stok giriş ve çıkışlarını görüntüleyin</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Hareketler</CardTitle>
                </CardHeader>
                <CardContent>
                    {movements.length > 0 ? (
                        <div className="space-y-4">
                            {movements.map((movement: any) => (
                                <div
                                    key={movement.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                            {getMovementIcon(movement.movement_type)}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {movement.product?.name || 'Ürün'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {movement.product?.product_code || 'N/A'} • {movement.warehouse?.name || 'Depo'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={movement.movement_type === 'in' ? 'default' : 'secondary'}>
                                            {getMovementLabel(movement.movement_type)}
                                        </Badge>
                                        <p className="mt-1 text-sm font-medium">
                                            {movement.quantity > 0 ? '+' : ''}{movement.quantity} adet
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {formatDate(movement.movement_date)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz stok hareketi yok</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
