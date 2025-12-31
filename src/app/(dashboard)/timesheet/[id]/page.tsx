'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Clock } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function TimesheetDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [entry, setEntry] = useState<any>(null)
    const [projectName, setProjectName] = useState<string>('-')
    const [taskTitle, setTaskTitle] = useState<string>('-')
    const [employeeName, setEmployeeName] = useState<string>('-')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEntry = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('timesheet')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setEntry(data)

                // Fetch Project
                if (data.project_id) {
                    const { data: p } = await supabase.from('projects').select('name').eq('id', data.project_id).single()
                    if (p) setProjectName(p.name)
                }

                // Fetch Task
                if (data.task_id) {
                    const { data: t } = await supabase.from('tasks').select('title').eq('id', data.task_id).single()
                    if (t) setTaskTitle(t.title)
                }

                // Fetch Employee
                if (data.employee_id) {
                    const { data: e } = await supabase.from('employees').select('name').eq('id', data.employee_id).single()
                    if (e) setEmployeeName(e.name)
                }

            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchEntry()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!entry) return <div className="p-8">Kayıt bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/timesheet">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{formatDate(entry.work_date)}</h1>
                        <p className="text-gray-500">{employeeName}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/timesheet/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Zaman Kaydı Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Proje</span>
                            <p className="text-lg">{projectName}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Görev</span>
                            <p className="text-lg">{taskTitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-4 border-t border-b">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                            <span className="text-xs font-medium text-gray-500 block">Süre</span>
                            <span className="text-xl font-bold">{entry.hours} Saat</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-medium text-gray-500">Açıklama</span>
                        <p className="text-gray-700 whitespace-pre-wrap">{entry.description || '-'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
