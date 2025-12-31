import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-muted p-4">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Sayfa Bulunamadı</h2>
            <p className="text-muted-foreground">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
            <Button asChild>
                <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
        </div>
    )
}
