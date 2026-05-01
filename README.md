# Expense Tracker

Ứng dụng quản lý chi tiêu fullstack với frontend React, backend Express, cơ sở dữ liệu PostgreSQL và Docker Compose.

## Kiến trúc
- Frontend: React + Vite
- Backend: Node.js + Express + PostgreSQL
- Cơ sở dữ liệu: PostgreSQL chạy trong Docker
- Docker Compose: frontend, backend, database
- CI: GitHub Actions để lint, test và build

## Chạy cục bộ với Docker
1. Sao chép `.env.example` thành `.env` và cập nhật giá trị nếu cần.
2. Chạy `docker compose up --build -d`
3. Frontend: http://localhost:3000
4. Backend API: http://localhost:4000/api

## Triển khai production với Docker
1. Sao chép `.env.example` thành `.env` và kiểm tra các giá trị production.
2. Chạy `docker compose -f docker-compose.prod.yml up --build -d`
3. Frontend: http://localhost
4. Backend API: http://localhost:4000/api

## GitHub Actions production build
- `./github/workflows/production-build.yml` sẽ xây dựng các image container production.
- Workflow cũng khởi chạy stack production và chạy test khói trên endpoint `/api/health`.

## Các endpoint
- `GET /api/health`
- `GET /api/transactions`
- `GET /api/summary`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

## Ghi chú
- Frontend sử dụng `VITE_API_URL` để gọi backend mà không hardcode URL.
- Backend ghi log lỗi ra console và trả về mã trạng thái phù hợp.
- Cấu trúc database được khởi tạo tự động khi khởi động.

## Quy trình nhánh và commit
- `main`: nhánh phát hành, luôn giữ trạng thái production-ready.
- `dev`: nhánh tích hợp chính, dùng cho phát triển đang diễn ra.
- `feature/*`: nhánh riêng cho từng tính năng hoặc cải tiến.

### Thực hành tốt nhất
- Commit thường xuyên và giữ mỗi commit chỉ tập trung vào một thay đổi.
- Dùng thông điệp commit rõ ràng, ví dụ `feat: add transaction summary endpoint` hoặc `fix: correct Docker healthcheck`.
- Không gộp tất cả công việc vào một commit cuối cùng.
- Merge các nhánh `feature/*` vào `dev`, rồi sau khi kiểm tra xong mới đưa `dev` lên `main`.
