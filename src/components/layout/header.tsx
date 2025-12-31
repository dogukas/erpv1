'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, LogOut, Building2 } from 'lucide-react'

export function Header() {
    const router = useRouter()
    const supabase = createClient()
    const [companyName, setCompanyName] = useState<string>('Şirket')
    const [userEmail, setUserEmail] = useState<string>('Kullanıcı')

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserEmail(user.email?.split('@')[0] || 'Kullanıcı')

                // Kullanıcının şirketini çek
                const { data: userCompany } = await supabase
                    .from('user_companies')
                    .select('company_id')
                    .eq('user_id', user.id)
                    .eq('is_default', true)
                    .single()

                if (userCompany) {
                    const { data: company } = await supabase
                        .from('companies')
                        .select('name')
                        .eq('id', userCompany.company_id)
                        .single()

                    if (company) {
                        setCompanyName(company.name)
                    }
                }
            }
        }
        fetchUserData()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-6">
                {/* Breadcrumb or Title */}
                <div>
                    <h1 className="text-lg font-semibold">Hoş Geldiniz</h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Company Name - Dinamik */}
                    <Button variant="outline" size="sm" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">{companyName}</span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden sm:inline">{userEmail}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Çıkış Yap</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

