'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function PayrollDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [payroll, setPayroll] = useState<any>(null)
    const [employeeName, setEmployeeName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPayroll = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('payroll')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setPayroll(data)

                if (data.employee_id) {
                    const { data: empData } = await supabase
                        .from('employees')
                        .select('name')
                        .eq('id', data.employee_id)
                        .single()

                    if (empData) setEmployeeName(empData.name)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPayroll()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!payroll) return <div className="p-8">Bordro bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/payroll">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{payroll.pay_period}</h1>
                        <p className="text-gray-500">{employeeName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/payroll/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Maaş Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Brüt Maaş</span>
                            <span className="font-medium">{formatCurrency(payroll.base_salary)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Primler (+)</span>
                            <span className="font-medium text-green-600">{formatCurrency(payroll.bonuses)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Kesintiler (-)</span>
                            <span className="font-medium text-red-600">{formatCurrency(payroll.deductions)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 pt-4">
                            <span className="text-lg font-bold text-gray-900">Net Maaş</span>
                            <span className="text-lg font-bold text-blue-700">{formatCurrency(payroll.net_salary)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
