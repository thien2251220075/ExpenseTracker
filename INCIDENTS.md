# Báo cáo Sự cố

Dự án này bao gồm phân tích sự cố cơ bản cho QA/SRE.

## Sự cố 1: Container backend không khởi động do thiếu healthcheck

- **Hiện tượng**: `docker compose up -d` cho thấy container backend bị fail vì service phụ thuộc không chuyển sang trạng thái healthy.
- **Layer lỗi**: L1 Infrastructure / điều phối container backend
- **Nguyên nhân**: `docker-compose.prod.yml` không định nghĩa healthcheck cho backend, nên logic khởi động frontend phụ thuộc có thể bị sai.
- **Cách fix**: Thêm healthcheck cho backend kiểm tra `/api/health` trước khi coi service là healthy.
- **Cách phòng tránh**: Luôn định nghĩa healthcheck cho các service trong file compose production và kiểm tra thứ tự khởi động container.

## Sự cố 2: API URL frontend bị hardcode hoặc sai trong production

- **Hiện tượng**: Request từ frontend thất bại khi ứng dụng chạy production vì URL backend không được giải quyết đúng.
- **Layer lỗi**: L4 Frontend / cấu hình
- **Nguyên nhân**: Frontend ban đầu dùng URL backend hardcode thay vì sử dụng biến môi trường hoặc đường dẫn API tương đối.
- **Cách fix**: Dùng `import.meta.env.VITE_API_URL || '/api'` trong `frontend/src/api.js` và cấu hình `frontend/.env.production` với `VITE_API_URL=/api`.
- **Cách phòng tránh**: Dùng biến môi trường cho tất cả endpoint runtime và tránh URL tuyệt đối hardcode trong mã frontend.

## Sự cố 3: Biến môi trường không khớp giữa local và production

- **Hiện tượng**: Ứng dụng chạy bình thường trong local dev nhưng fail khi chạy production compose vì `VITE_API_URL` hoặc biến database sai.
- **Layer lỗi**: L2 External / cấu hình
- **Nguyên nhân**: `.env.example` và `.env.production` không khớp với yêu cầu runtime production, hoặc giá trị `.env` bị commit sai.
- **Cách fix**: Giữ `.env.example` trong repo với giá trị mặc định an toàn, thêm `.env` vào `.gitignore`, và dùng `.env.production` riêng cho frontend.
- **Cách phòng tránh**: Không commit giá trị bí mật hoặc giá trị môi trường cụ thể; tài liệu hóa các biến cần thiết và kiểm tra cấu hình cả dev lẫn production.

## Sự cố 4: Backend không khởi động local vì PostgreSQL chưa chạy

- **Hiện tượng**: `npm start` trong `backend` fail với lỗi `ECONNREFUSED` khi kết nối `127.0.0.1:5432`.
- **Layer lỗi**: L2 External / database
- **Nguyên nhân**: Backend cố kết nối tới PostgreSQL local, nhưng service database chưa chạy hoặc cấu hình kết nối sai.
- **Cách fix**: Khởi động database trước khi backend, bằng cách chạy `docker compose -f docker-compose.prod.yml up -d db` hoặc cài và bật PostgreSQL local, đồng thời đảm bảo biến môi trường khớp với thông tin đăng nhập DB.
- **Cách phòng tránh**: Ghi rõ các giá trị `DATABASE_URL` / `POSTGRES_*`, dùng docker compose để khởi cả backend và database cùng nhau, và kiểm tra kết nối DB trước khi chạy backend.

## Sự cố 5: Deploy Railway fail vì root service sai

- **Hiện tượng**: Railway báo `Script start.sh not found` và không phát hiện được service backend.
- **Layer lỗi**: L1 Infrastructure / cấu hình deploy
- **Nguyên nhân**: Cấu hình deploy Railway trỏ đến root repo thay vì thư mục con `backend`, nên không tìm thấy file dịch vụ Node.js.
- **Cách fix**: Cấu hình Railway deploy từ thư mục `backend` và đặt lệnh start là `npm start` hoặc `node server.js`.
- **Cách phòng tránh**: Với repo monorepo, luôn chỉ định đúng thư mục con dịch vụ trong cấu hình deploy, và thêm metadata deploy riêng nếu cần.

## Sự cố 6: CORS hoặc môi trường sai khi frontend và backend chạy trên host khác

- **Hiện tượng**: Frontend gọi backend bị lỗi CORS hoặc sai URL endpoint.
- **Layer lỗi**: L4 Frontend / L3 Backend / L2 External
- **Nguyên nhân**: Frontend dùng URL API remote nhưng backend chưa cấu hình CORS đúng, hoặc biến môi trường `VITE_API_URL` chưa được set chính xác.
- **Cách fix**: Đặt `VITE_API_URL` thành host backend trong Vercel/Netlify, và cấu hình backend CORS cho phép origin frontend nếu chạy trên domain khác.
- **Cách phòng tránh**: Dùng đường dẫn `/api` tương đối khi có thể, và tài liệu hóa rõ yêu cầu CORS cũng như biến môi trường runtime.
