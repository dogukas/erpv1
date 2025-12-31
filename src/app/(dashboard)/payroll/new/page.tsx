'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPayrollPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        employee_id: '',
        pay_period: '',
        base_salary: '',
        deductions: '',
        bonuses: '',
    })

    useEffect(() => {
        const fetchEmployees = async () => {
            const { data } = await supabase.from('employees').select('id, name').order('name')
            if (data) setEmployees(data)
        }
        fetchEmployees()
    }, [supabase])

    const calculateNetSalary = () => {
        const base = parseFloat(formData.base_salary) || 0
        const deductions = parseFloat(formData.deductions) || 0
        const bonuses = parseFloat(formData.bonuses) || 0
        return (base + bonuses - deductions).toFixed(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('Kullanıcı bulunamadı')
            }

            const { data: userCompany, error: companyError } = await supabase
                .from('user_companies')
                .select('company_id')
                .eq('user_id', user.id)
                .eq('is_default', true)
                .single()

            if (companyError || !userCompany) {
                throw new Error('Şirket bilgisi bulunamadı.')
            }

            const { error } = await supabase.from('payroll').insert({
                company_id: userCompany.company_id,
                employee_id: formData.employee_id,
                pay_period: formData.pay_period,
                base_salary: parseFloat(formData.base_salary),
                deductions: parseFloat(formData.deductions) || 0,
                bonuses: parseFloat(formData.bonuses) || 0,
                net_salary: parseFloat(calculateNetSalary()),
                payment_date: new Date().toISOString(),
            })

            if (error) throw error

            router.push('/payroll')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/payroll">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Bordro</h1>
                    <p className="text-gray-600">Yeni bordro kaydı oluşturun</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Bordro Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="pay_period">Dönem *</Label>
                                <Input
                                    id="pay_period"
                                    value={formData.pay_period}
                                    onChange={(e) => setFormData({ ...formData, pay_period: e.target.value })}
                                    placeholder="2024-01"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Çalışan *</Label>
                                <Select
                                    value={formData.employee_id}
                                    onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                                    disabled={loading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Çalışan seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="base_salary">Brüt Maaş (₺) *</Label>
                                <Input
                                    id="base_salary"
                                    type="number"
                                    step="0.01"
                                    value={formData.base_salary}
                                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bonuses">Primler (₺)</Label>
                                <Input
                                    id="bonuses"
                                    type="number"
                                    step="0.01"
                                    value={formData.bonuses}
                                    onChange={(e) => setFormData({ ...formData, bonuses: e.target.value })}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deductions">Kesintiler (₺)</Label>
                                <Input
                                    id="deductions"
                                    type="number"
                                    step="0.01"
                                    value={formData.deductions}
                                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                                    placeholder="0.00"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Toplam Net Maaş:</span>
                                <span className="text-xl font-bold text-gray-900">
                                    ₺{calculateNetSalary()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 mt-4">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <Button type="button" variant="outline" asChild disabled={loading}>
                        <Link href="/payroll">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
