'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
            toast.success('Sıfırlama bağlantısı gönderildi!')
        } catch (error: any) {
            toast.error(error.message || 'Bir hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-900">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">E-postanızı Kontrol Edin</CardTitle>
                        <CardDescription>
                            {email} adresine şifre sıfırlama talimatlarını içeren bir bağlantı gönderdik.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/login">Giriş Sayfasına Dön</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild className="-ml-2 h-8 w-8">
                            <Link href="/login">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <CardTitle className="text-2xl font-bold">Şifremi Unuttum</CardTitle>
                    </div>
                    <CardDescription>
                        E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@sirket.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
