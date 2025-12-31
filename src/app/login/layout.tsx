import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Giriş Yap - floxe ERP',
    description: 'floxe ERP sistemine giriş yapın. Ücretsiz kurumsal kaynak planlama yazılımı ile stok, muhasebe, fatura ve CRM yönetimi.',
    keywords: ['ERP giriş', 'floxe login', 'ERP sistemi giriş', 'kurumsal yazılım giriş'],
    openGraph: {
        title: 'Giriş Yap - floxe ERP',
        description: 'floxe ERP sistemine giriş yapın.',
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
