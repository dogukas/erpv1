-- ☢️ NÜKLEER SEÇENEK: Public şemasındaki HER ŞEYİ siler.
-- Tablo isimlerini tek tek yazmanıza gerek yoktur, hepsini bulup temizler.

DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    -- Public şemasındaki tüm tabloları döngüye al
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP 
        -- Her tabloyu truncate et (Verileri sil, tabloyu tut)
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE'; 
    END LOOP; 
END $$;

-- Kontrol sorgusu
SELECT 'Tüm tablolar başarıyla temizlendi.' as sonuc;
