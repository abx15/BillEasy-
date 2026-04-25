-- BillEasy Database Seed Data
-- Sample data for testing and demonstration

-- Insert sample businesses
INSERT INTO businesses (id, name, owner_name, email, phone, address, gst_number, pan_number, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'MediCare Pharmacy', 'Dr. Rajesh Kumar', 'rajesh@medicare.com', '+91-9876543210', '123 Main Street, Mumbai, Maharashtra 400001', '27AAAPL1234C1ZV', 'ABCDE1234F', true),
('550e8400-e29b-41d4-a716-446655440001', 'QuickHealth Medical', 'Dr. Priya Sharma', 'priya@quickhealth.com', '+91-9876543211', '456 Park Avenue, Delhi, Delhi 110001', '27AAAPL5678C2ZV', 'FGHIJ5678G', true),
('550e8400-e29b-41d4-a716-446655440002', 'Wellness Center', 'Dr. Amit Patel', 'amit@wellness.com', '+91-9876543212', '789 Cross Road, Bangalore, Karnataka 560001', '27AAAPL9012C3ZV', 'KLMNO9012H', true);

-- Insert users for each business
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, business_id) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'rajesh@medicare.com', '$2b$12$LQv3c1yqBWVHxkd0LHEq3a9KqYqYqYqYqYqYqYqYqYqYqYqYqYqYqY', 'Rajesh', 'Kumar', '+91-9876543210', 'owner', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440001', 'priya@quickhealth.com', '$2b$12$LQv3c1yqBWVHxkd0LHEq3a9KqYqYqYqYqYqYqYqYqYqYqYqYqYqY', 'Priya', 'Sharma', '+91-9876543211', 'owner', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'amit@wellness.com', '$2b$12$LQv3c1yqBWVHxkd0LHEq3a9KqYqYqYqYqYqYqYqYqYqYqYqYqY', 'Amit', 'Patel', '+91-9876543212', 'owner', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, address, gst_number, is_walk_in, business_id) VALUES
('770e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john.doe@email.com', '+91-9876543210', '123 Customer Lane, Mumbai', '27AAAPL9999C1ZV', false, '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane.smith@email.com', '+91-9876543211', '456 Customer Street, Mumbai', '27AAAPL8888C1ZV', false, '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440002', 'Walk-in Customer', NULL, NULL, NULL, NULL, true, '550e8400-e29b-41d4-a716-446655440000'),
('770e8400-e29b-41d4-a716-446655440003', 'Robert Johnson', 'robert.j@email.com', '+91-9876543212', '789 Customer Road, Delhi', '27AAAPL7777C2ZV', false, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440004', 'Sarah Williams', 'sarah.w@email.com', '+91-9876543213', '101 Customer Ave, Delhi', '27AAAPL6666C2ZV', false, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', 'Walk-in Customer', NULL, NULL, NULL, NULL, true, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440006', 'Michael Brown', 'michael.b@email.com', '+91-9876543214', '202 Customer Blvd, Bangalore', '27AAAPL5555C3ZV', false, '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440007', 'Emily Davis', 'emily.d@email.com', '+91-9876543215', '303 Customer Way, Bangalore', '27AAAPL4444C3ZV', false, '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-4466554408', 'Walk-in Customer', NULL, NULL, NULL, NULL, true, '550e8400-e29b-41d4-a716-446655440002');

-- Insert categories for each business
INSERT INTO categories (id, name, description, hsn_code, gst_slab, business_id) VALUES
-- MediCare Pharmacy Categories
('880e8400-e29b-41d4-a716-446655440000', 'Medicines', 'Pharmaceutical medicines and drugs', '3004', '12', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440001', 'Medical Devices', 'Medical equipment and devices', '9018', '18', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-4466554402', 'Personal Care', 'Personal care and hygiene products', '3304', '18', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-4466554403', 'Surgical Supplies', 'Surgical instruments and supplies', '9019', '12', '550e8400-e29b-41d4-a716-446655440000'),

-- QuickHealth Medical Categories
('880e8400-e29b-41d4-a716-4466554404', 'Prescription Drugs', 'Prescription medications', '3004', '12', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-4466554405', 'OTC Products', 'Over-the-counter products', '3003', '18', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-4466554406', 'Health Supplements', 'Vitamins and supplements', '2106', '18', '550e8400-e29b-41d4-a716-446655440001'),

-- Wellness Center Categories
('880e8400-e29b-41d4-a716-4466554407', 'Ayurvedic Medicines', 'Traditional ayurvedic products', '3004', '12', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-4466554408', 'Homeopathy', 'Homeopathic medicines', '3004', '12', '550e8400-e29b-41d4-a716-4466554402'),
('880e8400-e29b-41d4-a716-4466554409', 'Yoga & Fitness', 'Yoga equipment and fitness products', '9506', '18', '550e8400-e29b-41d4-a716-4466554402');

-- Insert sample products
INSERT INTO products (id, name, description, sku, barcode, unit, price, cost_price, gst_slab, hsn_code, stock_quantity, min_stock_level, category_id, business_id) VALUES
-- MediCare Pharmacy Products
('990e8400-e29b-41d4-a716-446655440000', 'Paracetamol 500mg', 'Pain relief medication', 'PARA-500', '8901234567890', 'pcs', 10.50, 7.50, '18', '3004', 100, 20, '880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-446655440001', 'Azithromycin 250mg', 'Antibiotic medication', 'AZI-250', '8901234567891', 'pcs', 85.00, 65.00, '12', '3004', 50, 10, '880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-4466554402', 'Blood Pressure Monitor', 'Digital BP monitoring device', 'BPM-001', '8901234567892', 'pcs', 2500.00, 1800.00, '18', '9018', 25, 5, '880e8400-e29b-41d4-a716-4466554401', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-4466554403', 'Hand Sanitizer', 'Alcohol-based hand sanitizer', 'HS-500', '8901234567893', 'pcs', 45.00, 35.00, '18', '3304', 200, 50, '880e8400-e29b-41d4-a716-4466554402', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-4466554404', 'Surgical Mask', 'Disposable surgical masks', 'SM-001', '8901234567894', 'pcs', 5.00, 3.00, '12', '9019', 500, 100, '880e8400-e29b-41d4-a716-4466554403', '550e8400-e29b-41d4-a716-446655440000'),

-- QuickHealth Medical Products
('990e8400-e29b-41d4-a716-4466554405', 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 'AMOX-500', '8901234567895', 'pcs', 25.00, 18.00, '12', '3004', 75, 15, '880e8400-e29b-41d4-a716-4466554404', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-4466554406', 'Vitamin C 1000mg', 'Vitamin C supplement', 'VITC-1000', '8901234567896', 'pcs', 15.75, 10.00, '18', '2106', 150, 30, '880e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-4466554407', 'Pain Relief Balm', 'Topical pain relief', 'PRB-50', '8901234567897', 'pcs', 120.00, 85.00, '18', '3003', 80, 20, '880e8400-e29b-41d4-a716-4466554405', '550e8400-e29b-41d4-a716-4466554401'),

-- Wellness Center Products
('990e8400-e29b-41d4-a716-4466554408', 'Ashwagandha Capsules', 'Stress relief supplement', 'ASH-60', '8901234567898', 'pcs', 35.00, 25.00, '12', '3004', 60, 12, '880e8400-e29b-41d4-a716-4466554407', '550e8400-e29b-41d4-a716-4466554402'),
('990e8400-e29b-41d4-a716-4466554409', 'Yoga Mat', 'Non-slip yoga mat', 'YM-001', '8901234567899', 'pcs', 450.00, 320.00, '18', '9506', 30, 5, '880e8400-e29b-41d4-a716-446655409', '550e8400-e29b-41d4-a716-4466554402'),
('990e8400-e29b-41d4-a716-446655410', 'Homeopathic Kit', 'Basic homeopathic remedy kit', 'HK-001', '8901234567900', 'pcs', 280.00, 200.00, '12', '3004', 25, 5, '880e8400-e29b-41d4-a716-4466554408', '550e8400-e29b-41d4-a716-4466554402');

-- Insert sample bills
INSERT INTO bills (id, invoice_number, invoice_date, subtotal, gst_amount, discount_amount, total_amount, payment_status, payment_method, notes, customer_id, business_id) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'INV-2026-001', '2026-01-15', 106.00, 13.98, 0.00, 119.98, 'PAID', 'CASH', 'Regular customer', '770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('aa0e8400-e29b-41d4-a716-4466554401', 'INV-2026-002', '2026-01-16', 250.00, 30.00, 10.00, 270.00, 'PAID', 'CARD', 'Credit card payment', '770e8400-e29b-41d4-a716-4466554401', '550e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-4466554402', 'INV-2026-003', '2026-01-17', 45.00, 5.40, 0.00, 50.40, 'PENDING', NULL, 'Pending payment', '770e8400-e29b-41d4-a716-4466554402', '550e8400-e29b-41d4-a716-446655440000'),
('aa0e8400-e29b-41d4-a716-4466554403', 'INV-2026-004', '2026-01-18', 85.00, 10.20, 0.00, 95.20, 'PAID', 'UPI', 'UPI payment', '770e8400-e29b-41d4-a716-4466554403', '550e8400-e29b-41d4-a716-446655440001'),
('aa0e8400-e29b-41d4-a716-4466554404', 'INV-2026-005', '2026-01-19', 135.00, 16.20, 0.00, 151.20, 'PAID', 'CASH', 'Cash payment', '770e8400-e29b-41d4-a716-4466554404', '550e8400-e29b-41d4-a716-4466554401'),
('aa0e8400-e29b-41d4-a716-4466554405', 'INV-2026-006', '2026-01-20', 65.00, 7.80, 0.00, 72.80, 'PARTIAL', 'CARD', 'Partial payment received', '770e8400-e29b-41d4-a716-4466554405', '550e8400-e29b-41d4-a716-4466554401'),
('aa0e8400-e29b-41d4-a716-4466554406', 'INV-2026-007', '2026-01-21', 35.00, 4.20, 0.00, 39.20, 'PAID', 'CASH', 'Walk-in customer', '770e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-4466554401');

-- Insert bill items
INSERT INTO bill_items (id, product_name, description, quantity, unit, price, gst_slab, gst_amount, total, bill_id, product_id) VALUES
-- Bill INV-2026-001 items
('bb0e8400-e29b-41d4-a716-446655440000', 'Paracetamol 500mg', 'Pain relief medication', 2, 'pcs', 10.50, '18', 3.78, 24.78, 'aa0e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440000'),
('bb0e8400-e29b-41d4-a716-4466554401', 'Azithromycin 250mg', 'Antibiotic medication', 1, 'pcs', 85.00, '12', 10.20, 95.20, 'aa0e8400-e29b-41d4-a716-446655440000', '990e8400-e29b-41d4-a716-446655440001'),

-- Bill INV-2026-002 items
('bb0e8400-e29b-41d4-a716-4466554402', 'Blood Pressure Monitor', 'Digital BP monitoring device', 1, 'pcs', 2500.00, '18', 450.00, 2950.00, 'aa0e8400-e29b-41d4-a716-4466554401', '990e8400-e29b-41d4-a716-4466554402'),

-- Bill INV-2026-003 items
('bb0e8400-e29b-41d4-a716-4466554403', 'Hand Sanitizer', 'Alcohol-based hand sanitizer', 1, 'pcs', 45.00, '18', 5.40, 50.40, 'aa0e8400-e29b-41d4-a716-4466554402', '990e8400-e29b-41d4-a716-4466554403'),

-- Bill INV-2026-004 items
('bb0e8400-e29b-41d4-a716-4466554404', 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 1, 'pcs', 25.00, '12', 3.00, 28.00, 'aa0e8400-e29b-41d4-a716-4466554403', '990e8400-e29b-41d4-a716-4466554405'),
('bb0e8400-e29b-41d4-a716-4466554405', 'Vitamin C 1000mg', 'Vitamin C supplement', 3, 'pcs', 15.75, '18', 7.20, 52.20, 'aa0e8400-e29b-41d4-a716-4466554403', '990e8400-e29b-41d4-a716-4466554406'),

-- Bill INV-2026-005 items
('bb0e8400-e29b-41d4-a716-4466554406', 'Pain Relief Balm', 'Topical pain relief', 1, 'pcs', 120.00, '18', 16.20, 136.20, 'aa0e8400-e29b-41d4-a716-4466554404', '990e8400-e29b-41d4-a716-4466554407'),
('bb0e8400-e29b-41d4-a716-4466554407', 'Surgical Mask', 'Disposable surgical masks', 2, 'pcs', 5.00, '12', 0.00, 10.00, 'aa0e8400-e29b-41d4-a716-4466554404', '990e8400-e29b-41d4-a716-4466554404'),

-- Bill INV-2026-006 items
('bb0e8400-e29b-41d4-a716-4466554408', 'Amoxicillin 500mg', 'Broad-spectrum antibiotic', 2, 'pcs', 25.00, '12', 6.00, 56.00, 'aa0e8400-e29b-41d4-a716-446655405', '990e8400-e29b-41d4-a716-4466554405'),
('bb0e8400-e29b-41d4-a716-4466554409', 'Vitamin C 1000mg', 'Vitamin C supplement', 1, 'pcs', 15.75, '18', 1.80, 16.20, 'aa0e8400-e29b-41d4-a716-446655405', '990e8400-e29b-41d4-a716-4466554406'),

-- Bill INV-2026-007 items (Walk-in)
('bb0e8400-e29b-41d4-a716-44665544010', 'Hand Sanitizer', 'Alcohol-based hand sanitizer', 1, 'pcs', 45.00, '18', 5.40, 50.40, 'aa0e8400-e29b-41d4-a716-446655406', '990e8400-e29b-41d4-a716-4466554403');

-- Insert payment records
INSERT INTO payments (id, amount, payment_method, transaction_id, payment_date, bill_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', 119.98, 'CASH', 'TXN-001', '2026-01-15 10:30:00', 'aa0e8400-e29b-41d4-a716-446655440000'),
('cc0e8400-e29b-41d4-a716-4466554401', 270.00, 'CARD', 'TXN-002', '2026-01-16 14:45:00', 'aa0e8400-e29b-41d4-a716-4466554401'),
('cc0e8400-e29b-41d4-a716-4466554402', 95.20, 'UPI', 'TXN-003', '2026-01-18 11:20:00', 'aa0e8400-e29b-41d4-a716-4466554403'),
('cc0e8400-e29b-41d4-a716-4466554403', 151.20, 'CASH', 'TXN-004', '2026-01-19 16:15:00', 'aa0e8400-e29b-41d4-a716-4466554404'),
('cc0e8400-e29b-41d4-a716-4466554404', 50.40, 'CASH', 'TXN-005', '2026-01-21 09:30:00', 'aa0e8400-e29b-41d4-a716-4466554406'),
('cc0e8400-e29b-41d4-a716-4466554405', 36.40, 'CARD', 'TXN-006', '2026-01-22 13:45:00', 'aa0e8400-e29b-41d4-a716-4466554405'),
('cc0e8400-e29b-41d4-a716-4466554406', 39.20, 'CASH', 'TXN-007', '2026-01-23 10:00:00', 'aa0e8400-e29b-41d4-a716-4466554406');

-- Insert stock movements
INSERT INTO stock_movements (id, movement_type, quantity, reason, reference_id, reference_type, product_id, business_id) VALUES
-- Initial stock entries
('dd0e8400-e29b-41d4-a716-446655440000', 'IN', 100, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-4466554401', 'IN', 50, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554401', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-4466554402', 'IN', 25, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554402', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-4466554403', 'IN', 200, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554403', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-4466554404', 'IN', 500, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554404', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-4466554405', 'IN', 75, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554405', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-4466554406', 'IN', 150, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-4466554407', 'IN', 80, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554407', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-4466554408', 'IN', 60, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554408', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-4466554409', 'IN', 30, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-4466554409', '550e8400-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-44665544010', 'IN', 25, 'Initial stock', NULL, NULL, '990e8400-e29b-41d4-a716-44665544010', '550e8400-e29b-41d4-a716-446655440002'),

-- Stock movements due to sales
('dd0e8400-e29b-41d4-a716-44665544011', 'OUT', -2, 'Bill INV-2026-001', 'aa0e8400-e29b-41d4-a716-446655440000', 'bill', '990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-44665544012', 'OUT', -1, 'Bill INV-2026-001', 'aa0e8400-e29b-41d4-a716-446655440000', 'bill', '990e8400-e29b-41d4-a716-446655401', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-44665544013', 'OUT', -1, 'Bill INV-2026-002', 'aa0e8400-e29b-41d4-a716-446655401', 'bill', '990e8400-e29b-41d4-a716-4466554402', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-44665544014', 'OUT', -1, 'Bill INV-2026-003', 'aa0e8400-e29b-41d4-a716-4466554402', 'bill', '990e8400-e29b-41d4-a716-4466554403', '550e8400-e29b-41d4-a716-446655440000'),
('dd0e8400-e29b-41d4-a716-44665544015', 'OUT', -1, 'Bill INV-2026-004', 'aa0e8400-e29b-41d4-a716-446655403', 'bill', '990e8400-e29b-41d4-a716-4466554405', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-44665544016', 'OUT', -3, 'Bill INV-2026-004', 'aa0e8400-e29b-41d4-a716-446655403', 'bill', '990e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-44665544017', 'OUT', -1, 'Bill INV-2026-005', 'aa0e8400-e29b-41d4-a716-4466554404', 'bill', '990e8400-e29b-41d4-a716-4466554407', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-44665544018', 'OUT', -2, 'Bill INV-2026-005', 'aa0e8400-e29b-41d4-a716-446655404', 'bill', '990e8400-e29b-41d4-a716-4466554407', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-44665544019', 'OUT', -2, 'Bill INV-2026-005', 'aa0e8400-e29b-41d4-a716-446655404', 'bill', '990e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-4466554401'),
('dd0e8400-e29b-41d4-a716-44665544020', 'OUT', -1, 'Bill INV-2026-006', 'aa0e8400-e29b-41d4-a716-4466554405', 'bill', '990e8400-e29b-41d4-a716-4466554405', '550e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-44665544021', 'OUT', -1, 'Bill INV-2026-006', 'aa0e8400-e29b-41d4-a716-446655405', 'bill', '990e8400-e29b-41d4-a716-4466554406', '550e8400-e29b-41d4-a716-4466554401'),
('dd0e8400-e29b-41d4-a716-44665544022', 'OUT', -1, 'Bill INV-2026-007', 'aa0e8400-e29b-41d4-a716-4466554406', 'bill', '990e8400-e29b-41d4-a716-4466554403', '550e8400-e29b-41d4-a716-446655440000');
