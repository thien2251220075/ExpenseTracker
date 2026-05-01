# Tài liệu Triển khai

## Thiết lập production hiện tại

Dự án này được container hoá và có thể triển khai bằng Docker Compose.

- `docker-compose.yml` dùng cho môi trường phát triển local
- `docker-compose.prod.yml` dùng cho môi trường production-style
- `frontend/Dockerfile` sử dụng build nhiều giai đoạn để giảm kích thước image
- `backend/Dockerfile` sử dụng `NODE_ENV=production`
- `frontend/.env.production` cấu hình URL API production của frontend thành `/api`

## Tùy chọn triển khai

Repo này hỗ trợ triển khai lên:
- VPS / WSL Ubuntu với Docker
- Docker VPS
- Nền tảng cloud như Render

### 1. Triển khai trên VPS / WSL (khuyến nghị)

Đây là cách triển khai thực tế dễ nhất vì dùng Docker trên máy chủ thực.

1. Cài Docker và Docker Compose trên máy chủ đích.
2. Clone repository trên máy chủ đích.
3. Sao chép `.env.example` thành `.env` và cập nhật các giá trị nếu cần.
4. Trên máy chủ đích, chạy:

```bash
bash deploy-vps.sh
```

5. Kiểm tra các service:

```bash
docker compose -f docker-compose.prod.yml ps
```

6. Xem log nếu cần:

```bash
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs db
```

### Truy cập
- Frontend: `http://<server-ip>`
- Backend health: `http://<server-ip>:4000/api/health`

### 2. Triển khai lên Cloud bằng Render

Render có thể chạy backend và frontend dưới dạng các web service riêng.

#### Frontend
- Triển khai `frontend` như một static site hoặc Docker service.
- Đặt `build command` là `npm install && npm run build`.
- Đặt `publish directory` là `dist`.
- Thêm biến môi trường: `VITE_API_URL=/api` nếu frontend được phục vụ qua proxy.

#### Backend
- Triển khai `backend` như một web service hoặc Docker service.
- Đặt các biến môi trường:
  - `DATABASE_URL`
  - `PORT=4000`
  - `NODE_ENV=production`

#### Database
- Dùng một trong:
  - dịch vụ Postgres quản lý trên Render, hoặc
  - một server/container Postgres riêng

#### Ghi chú
- Render không hỗ trợ trực tiếp app nhiều service chỉ bằng một click, nên cần triển khai backend và frontend riêng hoặc dùng file `render.yaml`.
- Đảm bảo backend đã cấu hình CORS nếu frontend và backend chạy trên các domain khác nhau.

### 3. Triển khai với Vercel

Vercel phù hợp nhất cho frontend.
- Triển khai `frontend` như một app Vite.
- Đặt `Build Command` là `npm run build`.
- Đặt `Output Directory` là `dist`.
- Đặt `Environment Variable` `VITE_API_URL` là URL backend của bạn.

Với hệ thống đầy đủ, backend phải chạy ở nơi khác (Render, VPS, v.v.).

## Lệnh chạy production

```bash
cp .env.example .env
docker compose -f docker-compose.prod.yml up --build -d
```

## Kiểm tra trước khi deploy

- Đảm bảo `frontend/.env.production` tồn tại với:
  - `VITE_API_URL=/api`
- Đảm bảo `.env.example` được commit, `.env` được ignore.
- Đảm bảo sử dụng `docker-compose.prod.yml` để khởi động production.

## “Triển khai thực tế” ở đây là gì?

Triển khai thực tế có nghĩa app chạy trên môi trường remote hoặc máy chủ, không chỉ trên máy dev của bạn, như:
- VPS / server Ubuntu WSL
- Docker host trên cloud
- Render / Vercel / dịch vụ tương tự

## Ghi chú

- Docker Desktop không bắt buộc cho triển khai thực tế.
- Backend và database phải chạy trong container production.
- Frontend cần sử dụng biến môi trường và đường dẫn API tương đối, không hardcode URL local.
