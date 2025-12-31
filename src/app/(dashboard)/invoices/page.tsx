import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getInvoices() {
    const supabase = await createClient()

    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .order('invoice_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching invoices:', error)
        return []
    }

    return invoices || []
}

export default async function InvoicesPage() {
    const invoices = await getInvoices()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800'
            case 'partial':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'overdue':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Ödendi'
            case 'partial':
                return 'Kısmi Ödendi'
            case 'pending':
                return 'Beklemede'
            case 'overdue':
                return 'Gecikmiş'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Faturalar</h1>
                    <p className="text-gray-600">Satış ve alış faturalarınızı yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/invoices/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Fatura
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Faturalar</CardTitle>
                </CardHeader>
                <CardContent>
                    {invoices.length > 0 ? (
                        <div className="space-y-4">
                            {invoices.map((invoice: any) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                            <FileText className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/invoices/${invoice.id}`} className="hover:underline text-purple-600">
                                                    {invoice.invoice_number}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(invoice.invoice_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(invoice.total_amount)}</p>
                                        <Badge className={getStatusColor(invoice.status)}>
                                            {getStatusLabel(invoice.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz fatura yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/invoices/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Faturayı Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
