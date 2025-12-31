-- =====================================================
-- DASHBOARD İSTATİSTİKLERİ - ŞİRKET BAZLI FİLTRE
-- =====================================================
-- Bu fonksiyon giriş yapan kullanıcının şirketine ait
-- istatistikleri döndürür.
-- Supabase SQL Editor'de çalıştırın.

-- Önce eski fonksiyonu sil
DROP FUNCTION IF EXISTS get_dashboard_stats();

-- Yeni fonksiyon: Şirket bazlı filtreleme
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS json AS $$
DECLARE
    user_company_id uuid;
    result json;
BEGIN
    -- Kullanıcının varsayılan şirketini bul
    SELECT company_id INTO user_company_id
    FROM user_companies
    WHERE user_id = auth.uid() AND is_default = true
    LIMIT 1;

    -- Eğer şirket bulunamazsa boş istatistikler döndür
    IF user_company_id IS NULL THEN
        RETURN json_build_object(
            'products', 0,
            'customers', 0,
            'orders', 0,
            'revenue', 0
        );
    END IF;

    -- Şirkete ait istatistikleri hesapla
    SELECT json_build_object(
        'products', COALESCE((SELECT COUNT(*) FROM products WHERE company_id = user_company_id AND is_active = true), 0),
        'customers', COALESCE((SELECT COUNT(*) FROM customers WHERE company_id = user_company_id AND is_active = true), 0),
        'orders', COALESCE((SELECT COUNT(*) FROM sales_orders WHERE company_id = user_company_id), 0),
        'revenue', COALESCE((SELECT SUM(total_amount) FROM sales_orders WHERE company_id = user_company_id AND status IN ('confirmed', 'completed', 'paid', 'delivered')), 0)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Fonksiyona herkesin erişebilmesini sağla (ama içerik şirkete göre filtrelenir)
GRANT EXECUTE ON FUNCTION get_dashboard_stats() TO authenticated;

SELECT 'Dashboard istatistikleri artık şirket bazlı çalışıyor!' as sonuc;
