import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

async function getDeliveryNotes() {
    const supabase = await createClient()

    const { data: notes, error } = await supabase
        .from('delivery_notes')
        .select('*')
        .order('delivery_date', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching delivery notes:', error)
        return []
    }

    return notes || []
}

export default async function DeliveryNotesPage() {
    const notes = await getDeliveryNotes()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800'
            case 'in_transit':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'Teslim Edildi'
            case 'in_transit':
                return 'Yolda'
            case 'pending':
                return 'Beklemede'
            default:
                return status
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">İrsaliyeler</h1>
                    <p className="text-gray-600">Sevkiyat ve teslimat belgelerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/delivery-notes/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni İrsaliye
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Son İrsaliyeler</CardTitle>
                </CardHeader>
                <CardContent>
                    {notes.length > 0 ? (
                        <div className="space-y-4">
                            {notes.map((note: any) => (
                                <div
                                    key={note.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                            <Truck className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <Link href={`/delivery-notes/${note.id}`} className="hover:underline text-purple-600">
                                                    {note.note_number}
                                                </Link>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(note.delivery_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge className={getStatusColor(note.status)}>
                                            {getStatusLabel(note.status)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Truck className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">Henüz irsaliye yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/delivery-notes/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk İrsaliyeyi Oluştur
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
