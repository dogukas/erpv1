'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PaymentDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [payment, setPayment] = useState<any>(null)
    const [invoiceNo, setInvoiceNo] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPayment = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setPayment(data)

                if (data.invoice_id) {
                    const { data: invData } = await supabase
                        .from('invoices')
                        .select('invoice_number')
                        .eq('id', data.invoice_id)
                        .single()

                    if (invData) setInvoiceNo(invData.invoice_number)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPayment()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!payment) return <div className="p-8">Ödeme bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/payments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{formatCurrency(payment.amount)}</h1>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/payments/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ödeme İşlemi</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Tarih</span>
                                <span className="text-sm">{formatDate(payment.payment_date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Ödeme Yöntemi</span>
                                <span className="text-sm capitalize">{payment.payment_method}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">İşlem Türü</span>
                            <p className="text-lg capitalize">{payment.payment_type === 'received' ? 'Gelen Ödeme' : 'Giden Ödeme'}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Fatura Referansı</span>
                            <p className="text-lg">{invoiceNo}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
