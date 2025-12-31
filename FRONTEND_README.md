# ERP Frontend - Next.js Application

Modern, responsive ERP frontend uygulaması. Supabase + Next.js 14 + ShadCN/UI ile geliştirilmiştir.

## 🚀 Özellikler

- ✅ Next.js 14 App Router
- ✅ TypeScript
- ✅ Supabase Authentication & Database
- ✅ ShadCN/UI Components  
- ✅ TanStack React Table
- ✅ Lucide React Icons
- ✅ Responsive Design
- ✅ Dark Mode Ready

## 📦 Kurulum

### 1. Bağımlılıkları Kurun

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyasını oluşturun ve Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Supabase bilgilerinizi [supabase.com](https://supabase.com) > Project Settings > API'den alabilirsiniz.

### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📁 Proje Yapısı

```
frontend/
├── app/
│   ├── (dashboard)/        # Dashboard layout group
│   │   ├── layout.tsx      # Ana layout (sidebar + header)
│   │   ├── page.tsx        # Dashboard ana sayfa
│   │   ├── products/       # Ürün modülü
│   │   └── customers/      # Müşteri modülü
│   ├── login/              # Login sayfası
│   └── signup/             # Kayıt sayfası
├── components/
│   ├── ui/                 # ShadCN/UI components
│   ├── layout/             # Layout components (sidebar, header)
│   └── tables/             # Table components
├── lib/
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utility functions
└── middleware.ts           # Auth middleware
```

## 🎨 Modüller

### ✅ Tamamlananlar

1. **Authentication** - Login/Signup
2. **Dashboard** - Ana sayfa, istatistikler
3. **Ürün Yönetimi** - Liste, oluştur, düzenle
4. **Müşteri Yönetimi** - Liste, görüntüle

### 🔄 Geliştirilecekler

- Satış Siparişleri
- Satın Alma
- Faturalar
- Stok Hareketleri
- İnsan Kaynakları
- Proje Yönetimi
- Raporlar

## 🔐 Güvenlik

- Row Level Security (RLS) ile veri izolasyonu
- Supabase Auth ile kimlik doğrulama
- Middleware ile route koruması
- Multi-tenancy desteği

## 🎯 Kullanım

### Giriş Yapma

1. `/login` sayfasına gidin
2. Email ve şifrenizi girin
3. Dashboard'a yönlendirileceksiniz

### Yeni Ürün Ekleme

1. Sidebar'dan "Ürünler"e tıklayın
2. "Yeni Ürün" butonuna tıklayın
3. Formu doldurun
4. "Kaydet" butonuna tıklayın

### Data Table Kullanımı

- **Arama**: Üst kısımdaki arama kutusunu kullanın
- **Sıralama**: Kolon başlıklarına tıklayarak sıralayın
- **Sayfalama**: Alt kısımdaki butonlarla sayfalar arası geçiş yapın
- **İşlemler**: Satır sonundaki 3 nokta menüsünden işlem seçin

## 🛠️ Geliştirme

### Yeni Sayfa Eklemek

1. `app/(dashboard)/your-page/page.tsx` oluşturun
2. Sidebar'a menü ekleyin: `components/layout/sidebar.tsx`
3. Supabase'den veri çekmeyi unutmayın

### Yeni Component Eklemek

``bash
# ShadCN component ekle
npx shadcn@latest add component-name
```

## 📝 Kodlama Standartları

- Client Components için `'use client'` kullanın
- Server Components varsayılandır
- Supabase client vs server doğru kullanın
- Type safety için TypeScript kullanın
- Reusable componentler oluşturun

## 🚀 Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

## 📚 Kaynaklar

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [ShadCN/UI](https://ui.shadcn.com)
- [TanStack Table](https://tanstack.com/table/latest)

---

**Versiyon:** 1.0.0  
**Lisans:** MIT
