import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getEmployees() {
    const supabase = await createClient()

    const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching employees:', error)
        return []
    }

    return employees || []
}

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Çalışanlar</h1>
                    <p className="text-gray-600">Şirket çalışanlarınızı yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/employees/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Çalışan
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {employees.length > 0 ? (
                    employees.map((employee: any) => (
                        <Card key={employee.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        <Link href={`/employees/${employee.id}`} className="hover:underline">
                                            {employee.name}
                                        </Link>
                                    </CardTitle>
                                    <Badge variant="default">Aktif</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {employee.employee_number && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Sicil No:</strong> {employee.employee_number}
                                    </p>
                                )}
                                {employee.email && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>E-posta:</strong> {employee.email}
                                    </p>
                                )}
                                {employee.phone && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        <strong>Telefon:</strong> {employee.phone}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/employees/${employee.id}`}>Görüntüle</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz çalışan eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/employees/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Çalışanı Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
