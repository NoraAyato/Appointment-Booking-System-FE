# Next Steps - YoEdu Appointment Booking FE

## Ưu tiên gần

1. Kiểm tra UI thủ công trên desktop và mobile.
2. Thêm responsive mobile menu cho navbar.
3. Thêm trạng thái empty/loading/error rõ hơn cho services, specialists và booking history.
4. Thêm page chi tiết dịch vụ hoặc modal service detail.
5. Thêm trạng thái đặt lịch thành công rõ hơn thay vì chỉ dùng toast.
6. Bổ sung mock cancel/reschedule appointment trong lịch sử đặt dịch vụ.

## Khi có backend API

1. Xác nhận auth contract.
2. Ưu tiên HttpOnly cookie theo `AGENT_IMPLEMENTATION_GUIDE.md`.
3. Cập nhật `src/shared/lib/axios.ts`:
   - `withCredentials: true`
   - không gắn token thủ công
   - thêm refresh queue nếu backend có refresh endpoint
4. Thay mock trong `auth-api.ts` bằng API thật.
5. Thay mock trong `appointment-api.ts` bằng API thật.
6. Chuẩn hóa response trong API layer, không rải logic response shape trong page.
7. Bổ sung CSRF strategy nếu API dùng cookie auth cho mutation.

## Technical debt

1. Cân nhắc lazy load route để giảm chunk size.
2. Tách các dashboard table/card thành component nếu dashboard mở rộng.
3. Thêm test cho auth slice và booking submit adapter khi project có test setup.
4. Tối ưu ảnh hero nếu cần giảm kích thước production bundle.
5. Nếu dùng tiếng Việt nhiều, thống nhất encoding UTF-8 và tránh ghi file qua command dễ làm mojibake.

## Checklist cho mỗi lần làm tiếp

Trước khi code:

1. Đọc `AGENT_IMPLEMENTATION_GUIDE.md`.
2. Đọc `PROJECT_CONTEXT.md`.
3. Đọc `TASK_LOG.md`.
4. Đọc `NEXT_STEPS.md`.
5. Kiểm tra task mới có đụng auth/API/route/layout không.

Sau khi code:

1. Chạy `npm.cmd run lint`.
2. Chạy `npm.cmd run build`.
3. Nếu có sửa UI, mở dev server và kiểm tra route liên quan.
4. Cập nhật lại `TASK_LOG.md` và `PROJECT_CONTEXT.md` nếu có quyết định mới.
