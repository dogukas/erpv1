'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ProjectDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [project, setProject] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setProject(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!project) return <div className="p-8">Proje bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/projects">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <p className="text-gray-500">{project.project_code}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/projects/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Proje Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Durum</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-sm font-medium capitalize">
                                {project.status}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Açıklama</span>
                            <p className="text-gray-700">{project.description || '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Süreç ve Bütçe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Başlangıç - Bitiş</span>
                                <span className="text-sm">
                                    {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : '(Devam Ediyor)'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Bütçe</span>
                                <span className="text-xl font-bold text-green-700">
                                    {project.budget ? formatCurrency(project.budget) : '-'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
