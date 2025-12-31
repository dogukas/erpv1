-- =====================================================
-- VERİ İZOLASYONU - RLS (Row Level Security) DOĞRULAMA
-- =====================================================
-- Bu script tüm tablolarda RLS'in aktif olduğunu ve
-- kullanıcıların sadece kendi şirketlerinin verilerini
-- görebildiğini garanti eder.
-- Supabase SQL Editor'de çalıştırın.

-- =====================================================
-- 1. TÜM TABLOLARDA RLS'İ ETKİNLEŞTİR
-- =====================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. user_companies İÇİN POLİTİKA (Kritik!)
-- =====================================================
-- Kullanıcı sadece kendi kayıtlarını görebilsin
DROP POLICY IF EXISTS user_companies_select_policy ON user_companies;
CREATE POLICY user_companies_select_policy ON user_companies
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_companies_insert_policy ON user_companies;
CREATE POLICY user_companies_insert_policy ON user_companies
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 3. companies İÇİN POLİTİKA
-- =====================================================
-- Kullanıcı sadece bağlı olduğu şirketleri görebilsin
DROP POLICY IF EXISTS companies_policy ON companies;
CREATE POLICY companies_policy ON companies
    FOR ALL USING (
        id IN (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- =====================================================
-- 4. GENEL ŞİRKET BAZLI POLİTİKA FONKSİYONU
-- =====================================================
-- Kullanıcının erişebileceği company_id'leri döndürür
CREATE OR REPLACE FUNCTION get_user_company_ids()
RETURNS SETOF uuid AS $$
BEGIN
    RETURN QUERY
    SELECT company_id FROM user_companies 
    WHERE user_id = auth.uid() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- 5. TÜM TABLOLAR İÇİN STANDART POLİTİKALAR
-- =====================================================

-- CUSTOMERS
DROP POLICY IF EXISTS customers_policy ON customers;
CREATE POLICY customers_policy ON customers
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- VENDORS
DROP POLICY IF EXISTS vendors_policy ON vendors;
CREATE POLICY vendors_policy ON vendors
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PRODUCTS
DROP POLICY IF EXISTS products_policy ON products;
CREATE POLICY products_policy ON products
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PRODUCT_CATEGORIES
DROP POLICY IF EXISTS product_categories_policy ON product_categories;
CREATE POLICY product_categories_policy ON product_categories
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- EMPLOYEES
DROP POLICY IF EXISTS employees_policy ON employees;
CREATE POLICY employees_policy ON employees
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- DEPARTMENTS
DROP POLICY IF EXISTS departments_policy ON departments;
CREATE POLICY departments_policy ON departments
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- POSITIONS
DROP POLICY IF EXISTS positions_policy ON positions;
CREATE POLICY positions_policy ON positions
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- INVOICES
DROP POLICY IF EXISTS invoices_policy ON invoices;
CREATE POLICY invoices_policy ON invoices
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PAYMENTS
DROP POLICY IF EXISTS payments_policy ON payments;
CREATE POLICY payments_policy ON payments
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- SALES_ORDERS
DROP POLICY IF EXISTS sales_orders_policy ON sales_orders;
CREATE POLICY sales_orders_policy ON sales_orders
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PURCHASE_ORDERS
DROP POLICY IF EXISTS purchase_orders_policy ON purchase_orders;
CREATE POLICY purchase_orders_policy ON purchase_orders
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PURCHASE_REQUISITIONS
DROP POLICY IF EXISTS purchase_requisitions_policy ON purchase_requisitions;
CREATE POLICY purchase_requisitions_policy ON purchase_requisitions
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- QUOTATIONS
DROP POLICY IF EXISTS quotations_policy ON quotations;
CREATE POLICY quotations_policy ON quotations
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PROJECTS
DROP POLICY IF EXISTS projects_policy ON projects;
CREATE POLICY projects_policy ON projects
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- TASKS
DROP POLICY IF EXISTS tasks_policy ON tasks;
CREATE POLICY tasks_policy ON tasks
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- TIME_ENTRIES
DROP POLICY IF EXISTS time_entries_policy ON time_entries;
CREATE POLICY time_entries_policy ON time_entries
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- WAREHOUSES
DROP POLICY IF EXISTS warehouses_policy ON warehouses;
CREATE POLICY warehouses_policy ON warehouses
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- STOCK_MOVEMENTS
DROP POLICY IF EXISTS stock_movements_policy ON stock_movements;
CREATE POLICY stock_movements_policy ON stock_movements
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- STOCK_LEVELS
DROP POLICY IF EXISTS stock_levels_policy ON stock_levels;
CREATE POLICY stock_levels_policy ON stock_levels
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- DELIVERY_NOTES
DROP POLICY IF EXISTS delivery_notes_policy ON delivery_notes;
CREATE POLICY delivery_notes_policy ON delivery_notes
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- GOODS_RECEIPTS
DROP POLICY IF EXISTS goods_receipts_policy ON goods_receipts;
CREATE POLICY goods_receipts_policy ON goods_receipts
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- CHART_OF_ACCOUNTS
DROP POLICY IF EXISTS chart_of_accounts_policy ON chart_of_accounts;
CREATE POLICY chart_of_accounts_policy ON chart_of_accounts
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- JOURNAL_ENTRIES
DROP POLICY IF EXISTS journal_entries_policy ON journal_entries;
CREATE POLICY journal_entries_policy ON journal_entries
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PAYROLL_PERIODS
DROP POLICY IF EXISTS payroll_periods_policy ON payroll_periods;
CREATE POLICY payroll_periods_policy ON payroll_periods
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- PAYROLL_ITEMS
DROP POLICY IF EXISTS payroll_items_policy ON payroll_items;
CREATE POLICY payroll_items_policy ON payroll_items
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- LEAVE_REQUESTS
DROP POLICY IF EXISTS leave_requests_policy ON leave_requests;
CREATE POLICY leave_requests_policy ON leave_requests
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- ATTENDANCES
DROP POLICY IF EXISTS attendances_policy ON attendances;
CREATE POLICY attendances_policy ON attendances
    FOR ALL USING (company_id IN (SELECT get_user_company_ids()));

-- =====================================================
-- 6. SONUÇ
-- =====================================================
SELECT 
    'RLS Politikaları Başarıyla Güncellendi!' as sonuc,
    'Her kullanıcı artık sadece kendi şirketinin verilerini görebilir.' as aciklama;
