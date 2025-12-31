import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

async function getRequisitions() {
    const supabase = await createClient()

    const { data: requisitions, error } = await supabase
        .from('purchase_requisitions')
        .select('*')
        .order('request_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching requisitions:', error)
        return []
    }

    return requisitions || []
}

export default async function RequisitionsPage() {
    const requisitions = await getRequisitions()

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
                    <h1 className="text-3xl font-bold">Satın Alma Talepleri</h1>
                    <p className="text-gray-600">Satın alma taleplerini görüntüleyin ve yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/requisitions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Talep
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Talepler</CardTitle>
                </CardHeader>
                <CardContent>
                    {requisitions.length > 0 ? (
                        <div className="space-y-4">
                            {requisitions.map((req: any) => (
                                <div
                                    key={req.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                            <FileText className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/requisitions/${req.id}`} className="hover:underline text-orange-600">
                                                    {req.requisition_number}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(req.request_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getStatusColor(req.status)}>
                                            {getStatusLabel(req.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz talep yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/requisitions/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Talebi Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
