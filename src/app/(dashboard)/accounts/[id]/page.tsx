'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'

export default function AccountDetailPage() {
    const params = useParams()
    const id = params?.id
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAccount = async () => {
            if (!id) return
            try {
                const { data, error } = await supabase
                    .from('chart_of_accounts')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                setAccount(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAccount()
    }, [id, supabase])

    if (loading) return <div className="p-8">Yükleniyor...</div>
    if (error) return <div className="p-8 text-red-500">Hata: {error}</div>
    if (!account) return <div className="p-8">Hesap bulunamadı.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/accounts">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{account.account_name}</h1>
                        <p className="text-gray-500">{account.account_code}</p>
                    </div>
                </div>
                <Button asChild>
                    <Link href={`/accounts/${id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Düzenle
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hesap Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="text-sm font-medium text-gray-500">Hesap Türü</span>
                        <p className="text-lg capitalize">{account.account_type}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-gray-500">Bakiye</span>
                        <p className="text-sm text-gray-500 italic">Bakiye hesaplama özelliği yakında eklenecek.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
