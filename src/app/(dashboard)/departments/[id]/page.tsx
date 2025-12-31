'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

export default function DepartmentDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [department, setDepartment] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDepartment = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('departments')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setDepartment(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDepartment()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!department) return <div className="p-8">Departman bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/departments">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{department.name}</h1>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/departments/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Departman Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <span className="text-sm font-medium text-gray-500">Açıklama</span>
                        <p className="text-gray-700">{department.description || '-'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
