import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from '@/components/layout/client-layout'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://floxe.vercel.app'),
  title: {
    default: 'floxe ERP - Ücretsiz Kurumsal Kaynak Planlama Yazılımı',
    template: '%s | floxe ERP'
  },
  description: 'floxe, Türkiye\'nin ücretsiz bulut tabanlı ERP sistemi. Stok yönetimi, muhasebe, fatura, CRM, insan kaynakları, satış ve tedarik zinciri yönetimi tek platformda.',
  keywords: [
    'ERP sistemi', 'ERP yazılımı', 'kurumsal kaynak planlama', 'stok yönetimi',
    'muhasebe yazılımı', 'fatura programı', 'CRM yazılımı', 'insan kaynakları',
    'satış yönetimi', 'tedarik zinciri', 'KOBİ ERP', 'bulut ERP', 'ücretsiz ERP',
    'yerli ERP', 'Türk ERP', 'online ERP', 'web ERP', 'floxe'
  ],
  authors: [{ name: 'floxe' }],
  creator: 'floxe',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://floxe.vercel.app',
    siteName: 'floxe ERP',
    title: 'floxe ERP - Ücretsiz Kurumsal Kaynak Planlama Yazılımı',
    description: 'Stok, muhasebe, fatura, CRM, İK ve satış yönetimi tek platformda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'floxe ERP - Ücretsiz ERP Yazılımı',
    description: 'Türkiye\'nin ücretsiz bulut tabanlı ERP sistemi.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
