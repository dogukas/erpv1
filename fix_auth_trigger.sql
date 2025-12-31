-- Bu script, yeni kayıt olan kullanıcılar için otomatik Şirket ve Bağlantı oluşturma mekanizmasını (Trigger) onarır.
-- Supabase SQL Editor'de çalıştırın.

-- 1. Varsa eski trigger'ı temizle
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Fonksiyonu oluştur (Security Definer = Admin yetkisiyle çalışır)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  created_company_id uuid;
BEGIN
  -- Yeni Şirket Oluştur
  INSERT INTO public.companies (name)
  VALUES (
    -- Kayıt formundan gelen şirket adı veya varsayılan
    COALESCE(new.raw_user_meta_data->>'company_name', 'Şirketim')
  )
  RETURNING id INTO created_company_id;

  -- Kullanıcıyı Şirkete Bağla (Kurucu/Owner olarak)
  INSERT INTO public.user_companies (user_id, company_id, is_default, role)
  VALUES (new.id, created_company_id, true, 'owner');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger'ı auth.users tablosuna bağla
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

SELECT 'Trigger başarıyla oluşturuldu. Artık yeni kayıtlar otomatik şirket oluşturacak.' as sonuc;
