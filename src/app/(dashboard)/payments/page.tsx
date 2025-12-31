import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getPayments() {
    const supabase = await createClient()

    const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching payments:', error)
        return []
    }

    return payments || []
}

export default async function PaymentsPage() {
    const payments = await getPayments()

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'received':
                return 'bg-green-100 text-green-800'
            case 'sent':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'received':
                return 'Tahsilat'
            case 'sent':
                return 'Ödeme'
            default:
                return type
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Ödemeler</h1>
                    <p className="text-gray-600">Tahsilat ve ödemelerinizi takip edin</p>
                </div>
                <Button asChild>
                    <Link href="/payments/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ödeme
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                    {payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map((payment: any) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                            <CreditCard className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/payments/${payment.id}`} className="hover:underline text-blue-600">
                                                    Ödeme #{payment.id?.slice(0, 8)}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(payment.payment_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                                        <Badge className={getTypeColor(payment.payment_type)}>
                                            {getTypeLabel(payment.payment_type)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz ödeme yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/payments/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Ödemeyi Kaydet
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
