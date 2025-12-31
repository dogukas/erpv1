'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DollarSign, ShoppingCart, Package, Users, RefreshCcw } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DashboardStats {
    products: number
    customers: number
    orders: number
    revenue: number
}

interface Sale {
    id: string
    name: string
    email: string
    amount: number
}

export default function DashboardClient() {
    const supabase = createClient()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentSales, setRecentSales] = useState<Sale[]>([])
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<string>('')

    // Fix hydration mismatch
    useEffect(() => {
        setMounted(true)
        setLastUpdated(new Date().toLocaleTimeString())
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            // Stats via RPC
            const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats')
            if (statsError) throw statsError

            // Recent Sales with customer info
            const { data: salesData, error: salesError } = await supabase
                .from('sales_orders')
                .select(`id, total_amount, status, created_at, customers ( name, email )`)
                .order('created_at', { ascending: false })
                .limit(5)

            if (salesError) throw salesError

            const formattedSales: Sale[] = (salesData as any[]).map(order => ({
                id: order.id,
                name: order.customers?.name || 'Bilinmeyen Müşteri',
                email: order.customers?.email || 'email@yok.com',
                amount: order.total_amount,
            }))

            // Chart data - monthly aggregation
            const { data: allOrders } = await supabase
                .from('sales_orders')
                .select('total_amount, created_at')
                .in('status', ['confirmed', 'completed', 'paid', 'approved', 'delivered'])
                .order('created_at', { ascending: true })

            const monthlyData: Record<string, number> = {}
            const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

            const today = new Date()
            for (let i = 5; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
                monthlyData[months[d.getMonth()]] = 0
            }

            allOrders?.forEach(order => {
                const d = new Date(order.created_at)
                const key = months[d.getMonth()]
                if (monthlyData[key] !== undefined) {
                    monthlyData[key] += Number(order.total_amount)
                }
            })

            const chart = Object.keys(monthlyData).map(key => ({ name: key, total: monthlyData[key] }))

            setStats(statsData as DashboardStats)
            setRecentSales(formattedSales)
            setChartData(chart)
            setLastUpdated(new Date().toLocaleTimeString())

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel('genel-ozet-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_orders' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [supabase, fetchData])

    if (!mounted) return null

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Genel Özet</h2>
                    <p className="text-muted-foreground">İşletmenizin anlık durumu</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Son: {lastUpdated || '...'}
                    </span>
                    <Button onClick={() => fetchData()} size="sm" variant="outline" disabled={loading}>
                        <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Yenile
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats?.revenue || 0)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Siparişler</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.orders || 0}</div>
                        <p className="text-xs text-muted-foreground">Bu ay</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ürünler</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.products || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Müşteriler</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.customers || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart & Sales List */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Aylık Ciro Grafiği</CardTitle>
                        <CardDescription>Son 6 ayın satış performansı</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value}`} />
                                <Tooltip formatter={(value: any) => [`₺${Number(value).toLocaleString('tr-TR')}`, 'Ciro']} />
                                <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Son Satışlar</CardTitle>
                        <CardDescription>Son 5 sipariş</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentSales.length > 0 ? (
                            <div className="space-y-6">
                                {recentSales.map((sale) => (
                                    <div key={sale.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${sale.name}`} />
                                            <AvatarFallback>{sale.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{sale.name}</p>
                                            <p className="text-sm text-muted-foreground">{sale.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+{formatCurrency(sale.amount)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Henüz sipariş yok.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
