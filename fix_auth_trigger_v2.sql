-- ⚠️ DÜZELTME: 'role' kolonu olmayabilir, onu kaldırdım.
-- Supabase SQL Editor'de çalıştırın.

-- 1. Temizlik
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Fonksiyon (Basitleştirilmiş)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  created_company_id uuid;
BEGIN
  -- Yeni Şirket Oluştur
  INSERT INTO public.companies (name)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', 'Şirketim')
  )
  RETURNING id INTO created_company_id;

  -- Kullanıcıyı Şirkete Bağla
  -- 'role' kolonunu kaldırdık çünkü tabloda olmayabilir.
  INSERT INTO public.user_companies (user_id, company_id, is_default)
  VALUES (new.id, created_company_id, true);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger Bağla
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

SELECT 'Düzeltilmiş trigger başarıyla oluşturuldu.' as sonuc;
