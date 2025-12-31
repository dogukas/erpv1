'use client'

import { useState } from 'react'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import { usePathname } from 'next/navigation'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const pathname = usePathname()

    // Hide layout on landing, login, signup and password pages
    const isAuthPage = pathname === '/' ||
        pathname?.startsWith('/login') ||
        pathname?.startsWith('/signup') ||
        pathname?.startsWith('/forgot-password') ||
        pathname?.startsWith('/reset-password')

    if (isAuthPage) {
        return (
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </div>
        )
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                    <Sidebar
                        isCollapsed={isSidebarCollapsed}
                        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                    <div className={cn(
                        'transition-all duration-300',
                        isSidebarCollapsed ? 'pl-16' : 'pl-64'
                    )}>
                        <Header />
                        <main>
                            <div className="p-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
                <Toaster />
            </div>
        </ThemeProvider>
    )
}
