-- ⚠️ DÜZELTME V3: 'code' kolonu ZORUNLU (Not Null), bu yüzden rastgele bir kod üretiyoruz.
-- Supabase SQL Editor'de çalıştırın.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  created_company_id uuid;
  v_company_name text;
  v_company_code text;
BEGIN
  -- 1. Şirket Adını Belirle
  v_company_name := COALESCE(new.raw_user_meta_data->>'company_name', 'Şirketim');
  
  -- 2. Benzersiz Şirket Kodu Üret (Örn: COM-A1B2C3)
  -- MD5 hash'in ilk 8 hanesini alıp çakışmayı önlüyoruz
  v_company_code := 'COM-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));

  -- 3. Şirket Oluştur
  INSERT INTO public.companies (name, code)
  VALUES (v_company_name, v_company_code)
  RETURNING id INTO created_company_id;

  -- 4. Kullanıcıyı Şirkete Bağla
  -- role kolonu yok, sadece is_default
  INSERT INTO public.user_companies (user_id, company_id, is_default)
  VALUES (new.id, created_company_id, true);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

SELECT 'FİNAL Trigger oluşturuldu. Code kolonu hatası giderildi.' as sonuc;
