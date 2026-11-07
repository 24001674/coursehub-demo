# CourseHub - Buoi 4

- Migration 001: enrollment_events.
- Demo class: RACE-01, capacity = 1.
- POST /enrollments: lock class_sections bang FOR UPDATE.
- Concurrency test: 1 request 201, 1 request 409.
- Performance data: 100000 rows, dataset=performance.
- Index: idx_enrollment_events_dataset_student_time.
- EXPLAIN truoc index: Seq Scan, Execution Time = 12.276 ms.
- EXPLAIN sau index: Index Scan, Execution Time = 0.189 ms.

Khong commit backend/.env.