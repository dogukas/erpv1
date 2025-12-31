'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditPayrollPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch employees
                const { data: employeesData } = await supabase
                    .from('employees')
                    .select('id, name')
                    .order('name')

                if (employeesData) setEmployees(employeesData)

                // Fetch payroll
                const { data, error } = await supabase
                    .from('payroll')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        employee_id: data.employee_id,
                        pay_period: data.pay_period,
                        base_salary: data.base_salary.toString(),
                        deductions: data.deductions ? data.deductions.toString() : '',
                        bonuses: data.bonuses ? data.bonuses.toString() : '',
                    })
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, supabase])

    const calculateNetSalary = () => {
        const base = parseFloat(formData.base_salary) || 0
        const deductions = parseFloat(formData.deductions) || 0
        const bonuses = parseFloat(formData.bonuses) || 0
        return (base + bonuses - deductions).toFixed(2)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('payroll')
                .update({
                    employee_id: formData.employee_id,
                    pay_period: formData.pay_period,
                    base_salary: parseFloat(formData.base_salary),
                    deductions: parseFloat(formData.deductions) || 0,
                    bonuses: parseFloat(formData.bonuses) || 0,
                    net_salary: parseFloat(calculateNetSalary()),
                })
                .eq('id', id)

            if (error) throw error

            router.push('/payroll')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Yükleniyor...</div>

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
                    <h1 className="text-3xl font-bold">Bordro Düzenle</h1>
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
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Çalışan *</Label>
                                <Select
                                    value={formData.employee_id}
                                    onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
                                    disabled={saving}
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
                                    disabled={saving}
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
                                    disabled={saving}
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
                                    disabled={saving}
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
                    <Button type="button" variant="outline" asChild disabled={saving}>
                        <Link href="/payroll">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
