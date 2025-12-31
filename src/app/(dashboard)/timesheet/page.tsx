import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

async function getTimesheet() {
    const supabase = await createClient()

    const { data: timesheet, error } = await supabase
        .from('timesheet')
        .select('*')
        .order('work_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching timesheet:', error)
        return []
    }

    return timesheet || []
}

export default async function TimesheetPage() {
    const timesheet = await getTimesheet()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Zaman Takibi</h1>
                    <p className="text-gray-600">Çalışma saatlerini kaydedin</p>
                </div>
                <Button asChild>
                    <Link href="/timesheet/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kayıt
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son Kayıtlar</CardTitle>
                </CardHeader>
                <CardContent>
                    {timesheet.length > 0 ? (
                        <div className="space-y-4">
                            {timesheet.map((entry: any) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                                            <Clock className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/timesheet/${entry.id}`} className="hover:underline text-cyan-600">
                                                    {formatDate(entry.work_date)}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {entry.description || 'Açıklama yok'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{entry.hours} saat</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Clock className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz zaman kaydı yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/timesheet/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Kaydı Ekle
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
