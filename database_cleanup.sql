-- ⚠️ DİKKAT: Bu script mevcut iş verilerini siler.
-- Supabase SQL Editor'de çalıştırın.

BEGIN;

-- 1. Önce bağımlı tabloları (varsa) temizle
-- (Bu tablolar şemanızda varsa çalışır, yoksa hata vermemesi için ayrı bloklarda olabilir ama şimdilik garanti olanları yazıyorum)

TRUNCATE TABLE 
    stock_movements,
    timesheet
CASCADE;

-- 2. Ana tabloları temizle
TRUNCATE TABLE 
    sales_orders,
    purchase_requisitions,
    products,
    tasks,
    projects,
    customers,
    vendors,
    warehouses
RESTART IDENTITY CASCADE;

-- Eğer products tablosunda categories referansı varsa ve categories tablosunu da silmek isterseniz:
-- TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

COMMIT;

SELECT 'Temizlik tamamlandı: Siparişler, Ürünler, Müşteriler silindi.' as sonuc;
