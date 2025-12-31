'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Pencil, Phone, Mail } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type Customer = {
    id: string
    customer_code: string
    name: string
    email?: string
    phone?: string
    customer_type: string
    status: string
}

export function CustomersTable({ data }: { data: Customer[] }) {
    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: 'customer_code',
            header: 'Müşteri Kodu',
        },
        {
            accessorKey: 'name',
            header: 'Müşteri Adı',
            cell: ({ row }) => (
                <Link
                    href={`/customers/${row.original.id}`}
                    className="font-medium hover:underline text-blue-600"
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                row.original.email ? (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {row.original.email}
                    </div>
                ) : '-'
            ),
        },
        {
            accessorKey: 'phone',
            header: 'Telefon',
            cell: ({ row }) => (
                row.original.phone ? (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {row.original.phone}
                    </div>
                ) : '-'
            ),
        },
        {
            accessorKey: 'customer_type',
            header: 'Tip',
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.customer_type === 'company' ? 'Şirket' : 'Bireysel'}
                </Badge>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Durum',
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <Badge
                        variant={
                            status === 'active' ? 'default' :
                                status === 'inactive' ? 'secondary' :
                                    'destructive'
                        }
                    >
                        {status === 'active' ? 'Aktif' : status === 'inactive' ? 'Pasif' : 'Bloke'}
                    </Badge>
                )
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const customer = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Görüntüle
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/customers/${customer.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Düzenle
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Müşteri adı ile ara..."
        />
    )
}
