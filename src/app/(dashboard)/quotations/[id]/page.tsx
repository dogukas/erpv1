'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function QuotationDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [quotation, setQuotation] = useState<any>(null)
    const [customerName, setCustomerName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuotation = async () => {
            if (!id) return
            try {
                const { data: quoteData, error: quoteError } = await supabase
                    .from('quotations')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (quoteError) throw quoteError
                setQuotation(quoteData)

                if (quoteData.customer_id) {
                    const { data: custData } = await supabase
                        .from('customers')
                        .select('name')
                        .eq('id', quoteData.customer_id)
                        .single()

                    if (custData) setCustomerName(custData.name)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchQuotation()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!quotation) return <div className="p-8">Teklif bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/quotations">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{quotation.quotation_number}</h1>
                        <p className="text-gray-500">{customerName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/quotations/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Teklif Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Durum</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-sm font-medium capitalize">
                                {quotation.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Toplam Tutar</span>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(quotation.total_amount)}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tarih Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Teklif Tarihi</span>
                                <span className="text-sm">{formatDate(quotation.quotation_date)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Geçerlilik Tarihi</span>
                                <span className="text-sm">{quotation.valid_until ? formatDate(quotation.valid_until) : '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
