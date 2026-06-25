# Task Log - YoEdu Appointment Booking FE

## 2026-06-25

### Scaffold frontend

Đã tạo project FE từ repo gần như trống, bám theo `AGENT_IMPLEMENTATION_GUIDE.md`.

Các phần đã thêm:

- `package.json`
- Vite config.
- TypeScript config.
- ESLint config.
- Tailwind/PostCSS config.
- `index.html`
- `src/main.tsx`

Stack đang dùng:

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- Ant Design
- Tailwind CSS

### Cấu trúc app/features/shared

Đã tạo các vùng chính:

- `src/app`
- `src/features/auth`
- `src/features/appointments`
- `src/features/dashboard`
- `src/features/profile`
- `src/features/promotions`
- `src/shared`
- `src/styles`

### Layout và navigation

Đã tạo:

- `src/app/layouts/MainLayout.tsx`
- Navbar sticky.
- Logo YoEdu.
- Menu desktop.
- Login button.
- User avatar/name/role sau login.
- Dropdown user theo yêu cầu.

Dropdown gồm:

- Dashboard cho `staff` hoặc `admin`.
- Profile user.
- Lịch sử đặt dịch vụ.
- Khuyến mãi.
- Đăng xuất.

### Auth mock

Đã tạo:

- `src/features/auth/types/auth-type.ts`
- `src/features/auth/api/auth-api.ts`
- `src/features/auth/store/auth-slice.ts`
- `src/features/auth/components/LoginModal.tsx`

Login popup có chọn role mock:

- customer
- staff
- admin

Không lưu token ở Web Storage.

### Appointment booking

Đã tạo:

- `src/features/appointments/types/appointment-type.ts`
- `src/features/appointments/constants/appointment-mock-data.ts`
- `src/features/appointments/api/appointment-api.ts`
- `src/features/appointments/components/ServiceCard.tsx`
- `src/features/appointments/pages/HomePage.tsx`
- `src/features/appointments/pages/AppointmentHistoryPage.tsx`

Homepage có:

- Hero section dùng ảnh bitmap.
- Booking form.
- Chọn service.
- Chọn specialist.
- Chọn ngày/giờ.
- Ghi chú.
- Mock submit.
- Dịch vụ nổi bật.
- Danh sách specialist khả dụng.

### Dashboard/profile/promotions

Đã tạo:

- `src/features/dashboard/pages/StaffDashboardPage.tsx`
- `src/features/dashboard/pages/AdminDashboardPage.tsx`
- `src/features/profile/pages/ProfilePage.tsx`
- `src/features/promotions/pages/PromotionsPage.tsx`

### Generated asset

Đã generate ảnh hero bằng built-in image tool và copy vào:

```text
src/assets/appointment-hero.png
```

### Bug fix: DatePicker crash

Lỗi user gặp:

```text
date4.isValid is not a function
```

Nguyên nhân:

- `Ant Design DatePicker` cần value là `Dayjs`.
- Form đang set `date` thành string `YYYY-MM-DD`.

Fix:

- Tạo `BookingFormValues` trong `HomePage.tsx`.
- UI form dùng `date: Dayjs`.
- Khi submit mới convert sang `BookingPayload.date` dạng `YYYY-MM-DD`.

### Error boundary cho route

Đã thêm:

- `src/shared/components/AppRouteError.tsx`

Route root dùng `errorElement` để lỗi runtime hiển thị bằng Ant Design `Result`, không hiện stacktrace thô.

### Encoding note

Trong quá trình sửa bằng PowerShell, có lúc text tiếng Việt bị mojibake. Đã ghi lại các file liên quan bằng
UTF-8 và rà lại source. Lần sau nếu sửa file có tiếng Việt, cần chú ý encoding.

### Verification

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

Dev server đã chạy và trả `200` tại:

```text
http://127.0.0.1:5173/
```

Build warning còn lại:

- Chunk JS lớn hơn 500 kB do Ant Design bundle.
- Chưa cần xử lý ngay nếu chưa tối ưu production.

### Fix: TypeScript deprecation warnings in tsconfig

VS Code báo lỗi/cảnh báo:

```text
Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0.
Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
```

Nguyên nhân:

- `tsconfig.app.json` dùng `moduleResolution: "Node"`, TypeScript hiển thị là `node10`.
- `baseUrl` đang bị deprecate ở TypeScript phiên bản mới.

Fix:

- Đổi `moduleResolution` sang `Bundler`.
- Bỏ `baseUrl`.
- Đổi alias path từ `"src/*"` sang `"./src/*"`.

Đã chạy `npm.cmd run build` và pass.
