import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getAccounts() {
    const supabase = await createClient()

    const { data: accounts, error } = await supabase
        .from('chart_of_accounts')
        .select('*')
        .order('account_code', { ascending: true })

    if (error) {
        console.error('Error fetching accounts:', error)
        return []
    }

    return accounts || []
}

export default async function AccountsPage() {
    const accounts = await getAccounts()

    const getAccountTypeLabel = (type: string) => {
        switch (type) {
            case 'asset':
                return 'Varlık'
            case 'liability':
                return 'Yükümlülük'
            case 'equity':
                return 'Özkaynak'
            case 'revenue':
                return 'Gelir'
            case 'expense':
                return 'Gider'
            default:
                return type
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hesap Planı</h1>
                    <p className="text-gray-600">Muhasebe hesap planınızı yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/accounts/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Hesap
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hesaplar</CardTitle>
                </CardHeader>
                <CardContent>
                    {accounts.length > 0 ? (
                        <div className="space-y-2">
                            {accounts.map((account: any) => (
                                <div
                                    key={account.id}
                                    className="flex items-center justify-between border-b pb-3 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium">
                                            <Link href={`/accounts/${account.id}`} className="hover:underline">
                                                {account.account_code} - {account.account_name}
                                            </Link>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {getAccountTypeLabel(account.account_type)}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/accounts/${account.id}`}>Görüntüle</Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-600">Henüz hesap yok</p>
                            <Button asChild className="mt-4">
                                <Link href="/accounts/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Hesabı Ekle
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
