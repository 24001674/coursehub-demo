
-- CourseHub - Buoi 4
-- VII. Sinh du lieu lon va toi uu truy van
--
-- Luu y:
-- Cac lenh duoi day ghi lai quy trinh do truy van.
-- Khong chay lai EXPLAIN truoc index de thay the ket qua
-- do ban dau, vi index da duoc tao trong database.

-- =====================================================
-- 1. EXPLAIN TRUOC KHI TAO INDEX
-- =====================================================

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND student_id = '22000001'
  AND occurred_at >= TIMESTAMP '2025-12-20 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;


-- =====================================================
-- 2. TAO COMPOSITE INDEX VA CAP NHAT THONG KE
-- =====================================================

CREATE INDEX idx_enrollment_events_dataset_student_time
ON enrollment_events (dataset, student_id, occurred_at DESC);

ANALYZE enrollment_events;


-- =====================================================
-- 3. EXPLAIN SAU KHI TAO INDEX
-- =====================================================

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND student_id = '22000001'
  AND occurred_at >= TIMESTAMP '2025-12-20 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;


-- =====================================================
-- 4. DON DU LIEU PERFORMANCE KHI CAN
-- Chi xoa du lieu performance, giu lai su kien demo.
-- Khong chay neu van muon giu bo du lieu 100.000 dong.
-- =====================================================

-- DELETE FROM enrollment_events
-- WHERE dataset = 'performance';

-- ANALYZE enrollment_events;