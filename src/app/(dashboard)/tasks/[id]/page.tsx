'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function TaskDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState<any>(null)
    const [projectName, setProjectName] = useState<string>('-')
    const [assignedToName, setAssignedToName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setTask(data)

                // Fetch Project Name
                if (data.project_id) {
                    const { data: projData } = await supabase
                        .from('projects')
                        .select('name')
                        .eq('id', data.project_id)
                        .single()
                    if (projData) setProjectName(projData.name)
                }

                // Fetch Assigned To User Name
                if (data.assigned_to) {
                    const { data: empData } = await supabase
                        .from('employees')
                        .select('name')
                        .eq('id', data.assigned_to) // Assuming assigned_to is linked to employees table for now, or users table
                        .single()
                    // Note: If assigned_to is UUID from auth.users, we can't fetch name easily here without a public profile table.
                    // But in our schema, assigned_to might be an employee ID if we designed it that way, or we need to handle it.
                    // For now, let's try assuming it's an employee ID or just skip if fail.
                    if (empData) setAssignedToName(empData.name)
                }

            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchTask()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!task) return <div className="p-8">Görev bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/tasks">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{task.title}</h1>
                        <p className="text-gray-500">{projectName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/tasks/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Görev Detayları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Durum</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-sm font-medium capitalize">
                                {task.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Öncelik</span>
                            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium capitalize">
                                {task.priority}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Açıklama</span>
                            <p className="text-gray-700">{task.description || '-'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Zamanlama</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <span className="text-xs font-medium text-gray-500 block">Bitiş Tarihi</span>
                                <span className="text-sm">{task.due_date ? formatDate(task.due_date) : '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
