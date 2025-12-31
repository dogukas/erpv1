'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    FileText,
    ShoppingBag,
    FolderKanban,
    Settings,
    Building2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const menuItems = [
    {
        title: 'Genel Özet',
        href: '/genel-ozet',
        icon: LayoutDashboard,
    },
    {
        title: 'Envanter',
        icon: Package,
        children: [
            { title: 'Ürünler', href: '/products' },
            { title: 'Kategoriler', href: '/categories' },
            { title: 'Depolar', href: '/warehouses' },
            { title: 'Stok Hareketleri', href: '/stock-movements' },
        ],
    },
    {
        title: 'Satış & CRM',
        icon: ShoppingCart,
        children: [
            { title: 'Müşteriler', href: '/customers' },
            { title: 'Teklifler', href: '/quotations' },
            { title: 'Satış Siparişleri', href: '/sales-orders' },
            { title: 'İrsaliyeler', href: '/delivery-notes' },
        ],
    },
    {
        title: 'Satın Alma',
        icon: ShoppingBag,
        children: [
            { title: 'Tedarikçiler', href: '/vendors' },
            { title: 'Satın Alma Talepleri', href: '/requisitions' },
            { title: 'Satın Alma Siparişleri', href: '/purchase-orders' },
        ],
    },
    {
        title: 'Muhasebe',
        icon: FileText,
        children: [
            { title: 'Faturalar', href: '/invoices' },
            { title: 'Ödemeler', href: '/payments' },
            { title: 'Hesap Planı', href: '/accounts' },
        ],
    },
    {
        title: 'İnsan Kaynakları',
        icon: Users,
        children: [
            { title: 'Çalışanlar', href: '/employees' },
            { title: 'Departmanlar', href: '/departments' },
            { title: 'Bordro', href: '/payroll' },
        ],
    },
    {
        title: 'Projeler',
        icon: FolderKanban,
        children: [
            { title: 'Proje Listesi', href: '/projects' },
            { title: 'Görevler', href: '/tasks' },
            { title: 'Zaman Takibi', href: '/timesheet' },
        ],
    },
]

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-screen border-r bg-sidebar border-sidebar-border transition-all duration-300 overflow-hidden',
                    isCollapsed ? 'w-16' : 'w-64'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo & Toggle */}
                    <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 whitespace-nowrap">
                        {!isCollapsed && (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-sidebar-primary flex-shrink-0" />
                                <span className="text-xl font-bold truncate text-sidebar-foreground">ERP</span>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.title}>
                                    {isCollapsed ? (
                                        /* COLLAPSED STATE */
                                        item.children ? (
                                            /* Submenu (Dropdown) */
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={cn(
                                                            'h-10 w-10 justify-center rounded-lg',
                                                            item.children.some(c => c.href === pathname) && 'bg-primary/10 text-primary'
                                                        )}
                                                    >
                                                        <item.icon className="h-6 w-6" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="right" className="w-56" align="start">
                                                    <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {item.children.map((child) => (
                                                        <DropdownMenuItem key={child.href} asChild>
                                                            <Link href={child.href} className="cursor-pointer">
                                                                {child.title}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            /* Single Link (Tooltip) */
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.href!}
                                                        className={cn(
                                                            'flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100',
                                                            pathname === item.href && 'bg-primary text-white hover:bg-primary/90'
                                                        )}
                                                    >
                                                        <item.icon className="h-6 w-6" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p>{item.title}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )
                                    ) : (
                                        /* EXPANDED STATE */
                                        <div>
                                            {item.children ? (
                                                /* Submenu (Accordion-like list) */
                                                <div>
                                                    <div className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground whitespace-nowrap">
                                                        <item.icon className="h-5 w-5 flex-shrink-0" />
                                                        <span className="ml-3 font-semibold text-sidebar-foreground truncate">{item.title}</span>
                                                    </div>
                                                    <ul className="ml-8 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                                                        {item.children.map((child) => (
                                                            <li key={child.href}>
                                                                <Link
                                                                    href={child.href}
                                                                    className={cn(
                                                                        'block rounded-lg px-3 py-2 text-sm transition-colors whitespace-nowrap truncate',
                                                                        pathname === child.href
                                                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                                    )}
                                                                >
                                                                    {child.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                /* Single Link */
                                                <Link
                                                    href={item.href!}
                                                    className={cn(
                                                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                                                        pathname === item.href
                                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                                                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                                    )}
                                                >
                                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                                    <span className="ml-3 truncate">{item.title}</span>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Settings */}
                    <div className="border-t border-sidebar-border p-4">
                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/settings"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mx-auto"
                                    >
                                        <Settings className="h-6 w-6" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Ayarlar</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Link
                                href="/settings"
                                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-nowrap"
                            >
                                <Settings className="h-5 w-5 flex-shrink-0" />
                                <span className="ml-3">Ayarlar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}
