'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditTimesheetPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [projects, setProjects] = useState<any[]>([])
    const [tasks, setTasks] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        project_id: '',
        task_id: '',
        work_date: '',
        hours: '',
        description: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            try {
                // Fetch projects
                const { data: projectsData } = await supabase
                    .from('projects')
                    .select('id, name')
                    .order('name')

                if (projectsData) setProjects(projectsData)

                // Fetch tasks
                const { data: tasksData } = await supabase
                    .from('tasks')
                    .select('id, title')
                    .order('title')

                if (tasksData) setTasks(tasksData)

                // Fetch timesheet entry
                const { data, error } = await supabase
                    .from('timesheet')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) {
                    setFormData({
                        project_id: data.project_id || '',
                        task_id: data.task_id || '',
                        work_date: data.work_date,
                        hours: data.hours.toString(),
                        description: data.description || '',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const { error } = await supabase
                .from('timesheet')
                .update({
                    project_id: formData.project_id || null,
                    task_id: formData.task_id || null,
                    work_date: formData.work_date,
                    hours: parseFloat(formData.hours),
                    description: formData.description,
                })
                .eq('id', id)

            if (error) throw error

            router.push('/timesheet')
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
                    <Link href="/timesheet">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Zaman Kaydı Düzenle</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Kayıt Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="work_date">Tarih *</Label>
                                <Input
                                    id="work_date"
                                    type="date"
                                    value={formData.work_date}
                                    onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hours">Süre (Saat) *</Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    step="0.5"
                                    value={formData.hours}
                                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="project_id">Proje</Label>
                                <Select
                                    value={formData.project_id}
                                    onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Proje seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="task_id">Görev</Label>
                                <Select
                                    value={formData.task_id}
                                    onValueChange={(value) => setFormData({ ...formData, task_id: value })}
                                    disabled={saving}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Görev seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tasks.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={saving}
                                rows={3}
                            />
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
                        <Link href="/timesheet">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
