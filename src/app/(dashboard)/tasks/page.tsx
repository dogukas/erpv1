import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, CheckSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

async function getTasks() {
    const supabase = await createClient()

    const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching tasks:', error)
        return []
    }

    return tasks || []
}

export default async function TasksPage() {
    const tasks = await getTasks()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
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
            case 'pending':
                return 'Beklemede'
            default:
                return status
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600'
            case 'medium':
                return 'text-yellow-600'
            case 'low':
                return 'text-green-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Görevler</h1>
                    <p className="text-gray-600">Proje görevlerini takip edin</p>
                </div>
                <Button asChild>
                    <Link href="/tasks/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Görev
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tüm Görevler</CardTitle>
                </CardHeader>
                <CardContent>
                    {tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.map((task: any) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                                            <CheckSquare className="h-5 w-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/tasks/${task.id}`} className="hover:underline text-teal-600">
                                                    {task.title}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {task.due_date && `Son tarih: ${formatDate(task.due_date)}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            ●
                                        </span>
                                        <Badge className={getStatusColor(task.status)}>
                                            {getStatusLabel(task.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz görev yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/tasks/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Görevi Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
