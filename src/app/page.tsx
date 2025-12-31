'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    Package, Users, FileText, ShoppingCart,
    TrendingUp, Building2, BarChart3,
    CheckCircle, ArrowRight, Zap, Shield, Clock, Globe
} from 'lucide-react'

// Özellik kartı
function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="group p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
        </div>
    )
}

export default function LandingPage() {
    const [mounted, setMounted] = useState(false)
    const [checking, setChecking] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        setMounted(true)
        // Giriş yapan kullanıcıyı dashboard'a yönlendir
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/genel-ozet')
            } else {
                setChecking(false)
            }
        }
        checkAuth()
    }, [router, supabase])

    // Auth kontrolü sırasında loading göster
    if (checking) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
        )
    }

    const features = [
        { icon: Package, title: 'Envanter Yönetimi', description: 'Stok takibi, kategoriler ve depo kontrolü' },
        { icon: Users, title: 'Müşteri İlişkileri', description: 'CRM, müşteri kartları ve iletişim yönetimi' },
        { icon: FileText, title: 'Fatura & Muhasebe', description: 'E-fatura, ödeme takibi ve finansal raporlar' },
        { icon: ShoppingCart, title: 'Satış Yönetimi', description: 'Sipariş, teklif ve satış analitiği' },
        { icon: Building2, title: 'İnsan Kaynakları', description: 'Personel, izin ve bordro yönetimi' },
        { icon: BarChart3, title: 'Raporlama', description: 'Dashboard ve performans analizi' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/40 to-slate-900">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        floxe
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                                Giriş Yap
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                Ücretsiz Başla
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 py-16 md:py-24 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-8">
                        <Zap className="w-4 h-4" />
                        İlk 30 Gün Ücretsiz • Kredi Kartı Gerekmez
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        İşletmeniz İçin{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                            Kurumsal ERP
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
                        Stok yönetimi, muhasebe, fatura, CRM, insan kaynakları ve satış yönetimini
                        tek bir platformda birleştiren <strong className="text-white">ücretsiz bulut ERP sistemi</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 shadow-lg shadow-purple-500/25">
                                Hemen Başla - Ücretsiz
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 text-lg px-8 py-6">
                                Giriş Yap
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/70 text-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>SSL Güvenlik</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>7/24 Erişim</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>Bulut Tabanlı</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="px-6 py-16 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Tüm Modüller Tek Platformda
                    </h2>
                    <p className="text-white/80 max-w-2xl mx-auto">
                        İşletmenizin tüm iş süreçlerini entegre edin
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="px-6 py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm mb-6">
                            <Zap className="w-4 h-4" />
                            İlk Ay Ücretsiz Deneyin!
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Uygun Fiyatlı Planlar
                        </h2>
                        <p className="text-white/80 max-w-2xl mx-auto">
                            İşletmenizin büyüklüğüne göre esnek fiyatlandırma. Kredi kartı gerekmez, 30 gün ücretsiz deneyin.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div className="group relative bg-slate-900/80 rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105">
                            <div className="text-lg font-semibold text-white mb-2">Başlangıç</div>
                            <div className="text-white/60 text-sm mb-6">Küçük işletmeler için</div>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-black text-white">₺199</span>
                                <span className="text-white/60 mb-1">/ay</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 3 Kullanıcı
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 1.000 Ürün
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Stok Yönetimi
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Fatura Modülü
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> E-posta Desteği
                                </li>
                            </ul>
                            <Link href="/signup" className="block">
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                    30 Gün Ücretsiz Dene
                                </Button>
                            </Link>
                        </div>

                        {/* Pro Plan - Popular */}
                        <div className="group relative bg-gradient-to-b from-purple-900/50 to-slate-900/80 rounded-3xl p-8 border-2 border-purple-500/50 hover:border-purple-400 transition-all scale-105 hover:scale-110 shadow-2xl shadow-purple-500/20">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold">
                                En Popüler
                            </div>
                            <div className="text-lg font-semibold text-white mb-2">Profesyonel</div>
                            <div className="text-white/60 text-sm mb-6">Büyüyen işletmeler için</div>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">₺499</span>
                                <span className="text-white/60 mb-1">/ay</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 10 Kullanıcı
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Sınırsız Ürün
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Tüm Modüller
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> CRM & İK Yönetimi
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Öncelikli Destek
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Raporlama & Analitik
                                </li>
                            </ul>
                            <Link href="/signup" className="block">
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                                    30 Gün Ücretsiz Dene
                                </Button>
                            </Link>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="group relative bg-slate-900/80 rounded-3xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all hover:scale-105">
                            <div className="text-lg font-semibold text-white mb-2">Kurumsal</div>
                            <div className="text-white/60 text-sm mb-6">Büyük şirketler için</div>
                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-4xl font-black text-white">₺999</span>
                                <span className="text-white/60 mb-1">/ay</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Sınırsız Kullanıcı
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Sınırsız Her Şey
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> API Erişimi
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Özel Entegrasyonlar
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> 7/24 VIP Destek
                                </li>
                                <li className="flex items-center gap-2 text-white/80 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Eğitim & Kurulum
                                </li>
                            </ul>
                            <Link href="/signup" className="block">
                                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                    30 Gün Ücretsiz Dene
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-12 text-white/60 text-sm">
                        Tüm planlar <strong className="text-emerald-400">30 gün ücretsiz deneme</strong> ile başlar. İstediğiniz zaman iptal edebilirsiniz.
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        floxe
                    </div>
                    <div className="text-white/40 text-sm">
                        © 2025 floxe ERP - Tüm hakları saklıdır.
                    </div>
                    <div className="flex gap-6 text-white/40 text-sm">
                        <Link href="/login" className="hover:text-white transition-colors">Giriş</Link>
                        <Link href="/signup" className="hover:text-white transition-colors">Kayıt</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
