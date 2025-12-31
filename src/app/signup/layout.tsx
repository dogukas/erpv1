import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kayıt Ol - floxe ERP',
    description: 'floxe ERP ile ücretsiz hesap oluşturun. Bulut tabanlı kurumsal kaynak planlama yazılımı ile işletmenizi dijitalleştirin.',
    keywords: ['ERP kayıt', 'ücretsiz ERP', 'floxe kayıt', 'ERP hesap oluştur', 'kurumsal yazılım'],
    openGraph: {
        title: 'Ücretsiz Kayıt Ol - floxe ERP',
        description: 'Ücretsiz ERP hesabı oluşturun.',
    },
}

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
