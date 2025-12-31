import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, FolderKanban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

async function getProjects() {
    const supabase = await createClient()

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('start_date', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return projects || []
}

export default async function ProjectsPage() {
    const projects = await getProjects()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'on_hold':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Tamamlandı'
            case 'in_progress':
                return 'Devam Ediyor'
            case 'on_hold':
                return 'Beklemede'
            case 'cancelled':
                return 'İptal'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Projeler</h1>
                    <p className="text-gray-600">Tüm projelerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/projects/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Proje
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.length > 0 ? (
                    projects.map((project: any) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        <Link href={`/projects/${project.id}`} className="hover:underline">
                                            {project.name}
                                        </Link>
                                    </CardTitle>
                                    <Badge className={getStatusColor(project.status)}>
                                        {getStatusLabel(project.status)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.project_code && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Kod:</strong> {project.project_code}
                                    </p>
                                )}
                                {project.start_date && (
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong>Başlangıç:</strong> {formatDate(project.start_date)}
                                    </p>
                                )}
                                {project.end_date && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        <strong>Bitiş:</strong> {formatDate(project.end_date)}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/projects/${project.id}`}>Detaylar</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz proje eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/projects/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Projeyi Oluştur
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
