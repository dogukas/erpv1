'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

// Kategoriler ve özellikler
const floatingWords = [
    'Envanter', 'Müşteriler', 'Faturalar', 'Siparişler',
    'Stok Yönetimi', 'İnsan Kaynakları', 'Muhasebe', 'Projeler',
    'Tedarikçiler', 'Satış', 'CRM', 'Raporlar',
    'Bordro', 'Teklif', 'Depo', 'Finans',
    'Üretim', 'Planlama', 'Analitik', 'Dashboard'
]

// Animasyonlu yüzen kelime komponenti
function FloatingWord({ word, index }: { word: string; index: number }) {
    const [style, setStyle] = useState({})

    useEffect(() => {
        const randomX = Math.random() * 100
        const randomDelay = Math.random() * 10
        const randomDuration = 15 + Math.random() * 20
        const randomSize = 0.7 + Math.random() * 0.8

        setStyle({
            left: `${randomX}%`,
            animationDelay: `${randomDelay}s`,
            animationDuration: `${randomDuration}s`,
            fontSize: `${randomSize}rem`,
            opacity: 0.1 + Math.random() * 0.15,
        })
    }, [])

    return (
        <span
            className="floating-word absolute text-white/20 font-light whitespace-nowrap pointer-events-none select-none"
            style={style}
        >
            {word}
        </span>
    )
}

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    company_name: companyName,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/login?message=Kayıt başarılı! Giriş yapabilirsiniz.')
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 animate-gradient-shift" />

            {/* Floating Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move" />

            {/* Floating Words */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden">
                    {floatingWords.map((word, index) => (
                        <FloatingWord key={index} word={word} index={index} />
                    ))}
                    {floatingWords.slice(0, 10).map((word, index) => (
                        <FloatingWord key={`dup-${index}`} word={word} index={index + 20} />
                    ))}
                </div>
            )}

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow animation-delay-4000" />

            {/* Company Name - Pulsing */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-text-shimmer">
                    floxe
                </h1>
                <p className="text-white/60 text-lg mt-2 animate-pulse">
                    İşletmenizi Büyütün
                </p>
            </div>

            {/* Signup Card */}
            <Card className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold text-white">Kayıt Ol</CardTitle>
                    <CardDescription className="text-white/70">
                        Ücretsiz hesap oluşturun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-white/90">Şirket Adı</Label>
                            <Input
                                id="companyName"
                                type="text"
                                placeholder="ABC Ltd. Şti."
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/90">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@sirket.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/90">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="En az 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400"
                            />
                        </div>
                        {error && (
                            <div className="rounded-md bg-red-500/20 border border-red-500/50 p-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                            disabled={loading}
                        >
                            {loading ? 'Kayıt yapılıyor...' : 'Ücretsiz Başla'}
                        </Button>
                        <div className="text-center text-sm text-white/70">
                            Zaten hesabınız var mı?{' '}
                            <Link href="/login" className="font-medium text-emerald-300 hover:text-emerald-200 transition-colors">
                                Giriş yapın
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Bottom Branding */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-sm">
                © 2025 floxe ERP - Tüm Hakları Saklıdır
            </div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 15s ease infinite;
                }

                @keyframes grid-move {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(50px, 50px); }
                }
                .animate-grid-move {
                    animation: grid-move 20s linear infinite;
                }

                @keyframes float-up {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.2;
                    }
                    90% {
                        opacity: 0.2;
                    }
                    100% {
                        transform: translateY(-100px) rotate(10deg);
                        opacity: 0;
                    }
                }
                .floating-word {
                    animation: float-up 20s linear infinite;
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .animate-text-shimmer {
                    background-size: 200% auto;
                    animation: text-shimmer 4s linear infinite;
                }
            `}</style>
        </div>
    )
}
