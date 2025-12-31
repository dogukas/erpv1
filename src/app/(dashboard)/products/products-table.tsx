'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/tables/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Pencil, ArrowUpDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

type Product = {
    id: string
    product_code: string
    name: string
    category?: { name: string }
    uom?: { name: string }
    sale_price: number
    cost_price: number
    track_inventory: boolean
    is_active: boolean
}

export function ProductsTable({ data }: { data: Product[] }) {
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'product_code',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Ürün Kodu
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Ürün Adı
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Link
                    href={`/products/${row.original.id}`}
                    className="font-medium hover:underline text-blue-600 dark:text-blue-400"
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Kategori',
            cell: ({ row }) => row.original.category?.name || '-',
        },
        {
            accessorKey: 'stock_quantity',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Stok
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const stock = (row.original as any).stock_quantity || 0
                return (
                    <Badge variant={stock > 0 ? 'outline' : 'destructive'}>
                        {stock} {row.original.uom?.name || 'AD'}
                    </Badge>
                )
            },
        },
        {
            accessorKey: 'sale_price',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="justify-end w-full"
                    >
                        Satış Fiyatı
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.original.sale_price)}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const product = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Menü</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/products/${product.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Görüntüle
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/products/${product.id}/edit`}>
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
            searchPlaceholder="Ürün adı ile ara..."
        />
    )
}
