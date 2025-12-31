import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getCategories() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    return categories || []
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Kategoriler</h1>
                    <p className="text-gray-600">Ürün kategorilerinizi yönetin</p>
                </div>
                <Button asChild>
                    <Link href="/categories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kategori
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.length > 0 ? (
                    categories.map((category: any) => (
                        <Card key={category.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    <Link href={`/categories/${category.id}`} className="hover:underline">
                                        {category.name}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {category.description && (
                                    <p className="text-sm text-gray-600">{category.description}</p>
                                )}
                                <div className="mt-4 flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/categories/${category.id}`}>Görüntüle</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full">
                        <CardContent className="p-8 text-center">
                            <p className="text-gray-600">Henüz kategori eklenmemiş</p>
                            <Button asChild className="mt-4">
                                <Link href="/categories/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    İlk Kategoriyi Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
