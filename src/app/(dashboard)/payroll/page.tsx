import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

async function getPayroll() {
    const supabase = await createClient()

    const { data: payroll, error } = await supabase
        .from('payroll')
        .select('*')
        .order('pay_period', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching payroll:', error)
        return []
    }

    return payroll || []
}

export default async function PayrollPage() {
    const payroll = await getPayroll()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bordro</h1>
                    <p className="text-gray-600">Maaş ödemelerini yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/payroll/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Bordro
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Ödemeler</CardTitle>
                </CardHeader>
                <CardContent>
                    {payroll.length > 0 ? (
                        <div className="space-y-4">
                            {payroll.map((pay: any) => (
                                <div
                                    key={pay.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/payroll/${pay.id}`} className="hover:underline text-green-600">
                                                    Bordro #{pay.id?.slice(0, 8)}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {pay.pay_period || 'Dönem bilgisi yok'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(pay.net_salary)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz bordro kaydı yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/payroll/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Bordroyu Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
