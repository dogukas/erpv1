import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    AlertTriangle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

async function getDashboardStats() {
    const supabase = await createClient()

    // Get current user to fetch their company
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch stats (you'll need to implement these queries based on your data)
    const [
        { count: productCount },
        { count: customerCount },
        { count: orderCount },
    ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('sales_orders').select('*', { count: 'exact', head: true }),
    ])

    return {
        products: productCount || 0,
        customers: customerCount || 0,
        orders: orderCount || 0,
        revenue: 245890, // Placeholder - implement actual calculation
    }
}

async function getRecentOrders() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('sales_orders')
        .select(`
      order_number,
      order_date,
      total_amount,
      status,
      customers (name)
    `)
        .order('order_date', { ascending: false })
        .limit(5)

    return orders || []
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const recentOrders = await getRecentOrders()

    if (!stats) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600">ERP sisteminize genel bakış</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Satış
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12.5% geçen aya göre
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Toplam Sipariş
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                        <p className="text-xs text-gray-600 mt-1">
                            Bu ay
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Ürün Sayısı
                        </CardTitle>
                        <Package className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.products}</div>
                        <p className="text-xs text-gray-600 mt-1">
                            Aktif ürünler
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Müşteri Sayısı
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.customers}</div>
                        <p className="text-xs text-gray-600 mt-1">
                            Toplam müşteri
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Son Siparişler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order: any) => (
                                    <div key={order.order_number} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{order.order_number}</p>
                                            <p className="text-sm text-gray-600">{order.customers?.name || 'Müşteri'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                                            <p className="text-xs text-gray-600">{order.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">Henüz sipariş yok</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Kritik Stok Uyarıları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Kritik stok seviyesindeki ürünler burada görüntülenecek
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
