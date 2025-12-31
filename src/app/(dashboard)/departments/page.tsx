import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getDepartments() {
    const supabase = await createClient()

    const { data: departments, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching departments:', error)
        return []
    }

    return departments || []
}

export default async function DepartmentsPage() {
    const departments = await getDepartments()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Departmanlar</h1>
                    <p className="text-gray-600">Şirket departmanlarınızı yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/departments/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Departman
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {departments.length > 0 ? (
                    departments.map((dept: any) => (
                        <Card key={dept.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    <Link href={`/departments/${dept.id}`} className="hover:underline">
                                        {dept.name}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {dept.description && (
                                    <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/departments/${dept.id}`}>Görüntüle</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-600">Henüz departman eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/departments/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Departmanı Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
