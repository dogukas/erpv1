'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTimesheetPage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
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
        const fetchProjects = async () => {
            const { data } = await supabase.from('projects').select('id, name').order('name')
            if (data) setProjects(data)
        }
        fetchProjects()
    }, [supabase])

    // Fetch tasks when project changes
    useEffect(() => {
        if (formData.project_id) {
            // Note: In a real app we might filter by project relationship if applicable
            // For now just fetching all tasks as schema might not link task to project directly
            // Checking schema cache... schema not fully visible but assuming generic
            const fetchTasks = async () => {
                const { data } = await supabase.from('tasks').select('id, title').order('title')
                if (data) setTasks(data)
            }
            fetchTasks()
        }
    }, [formData.project_id, supabase])

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

            // Kullanıcıya bağlı çalışanı bul
            const { data: employee, error: empError } = await supabase
                .from('employees')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (empError || !employee) {
                throw new Error('Bu kullanıcıya bağlı çalışan kaydı bulunamadı.')
            }

            // Tablo adı: time_entries (schema'da timesheet değil)
            const { error } = await supabase.from('time_entries').insert({
                company_id: userCompany.company_id,
                employee_id: employee.id,
                project_id: formData.project_id || null,
                task_id: formData.task_id || null,
                entry_date: formData.work_date,
                hours: parseFloat(formData.hours),
                description: formData.description,
            })

            if (error) throw error

            router.push('/timesheet')
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
                    <Link href="/timesheet">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Yeni Zaman Kaydı</h1>
                    <p className="text-gray-600">Çalışma saati girin</p>
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
                                    disabled={loading}
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
                                    placeholder="8.0"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="project_id">Proje</Label>
                                <Select
                                    value={formData.project_id}
                                    onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                                    disabled={loading}
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
                                    disabled={loading}
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
                                placeholder="Yapılan işin detayı..."
                                disabled={loading}
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
                    <Button type="button" variant="outline" asChild disabled={loading}>
                        <Link href="/timesheet">İptal</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
