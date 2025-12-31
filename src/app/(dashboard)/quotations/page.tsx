import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getQuotations() {
    const supabase = await createClient()

    const { data: quotations, error } = await supabase
        .from('quotations')
        .select('*')
        .order('quotation_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching quotations:', error)
        return []
    }

    return quotations || []
}

export default async function QuotationsPage() {
    const quotations = await getQuotations()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Onaylandı'
            case 'pending':
                return 'Beklemede'
            case 'rejected':
                return 'Reddedildi'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Teklifler</h1>
                    <p className="text-gray-600">Müşterilerinize gönderilen teklifleri yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/quotations/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Teklif
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Teklifler</CardTitle>
                </CardHeader>
                <CardContent>
                    {quotations.length > 0 ? (
                        <div className="space-y-4">
                            {quotations.map((quotation: any) => (
                                <div
                                    key={quotation.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/quotations/${quotation.id}`} className="hover:underline text-blue-600">
                                                    {quotation.quotation_number}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(quotation.quotation_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(quotation.total_amount)}</p>
                                        <Badge className={getStatusColor(quotation.status)}>
                                            {getStatusLabel(quotation.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz teklif yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/quotations/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Teklifi Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
