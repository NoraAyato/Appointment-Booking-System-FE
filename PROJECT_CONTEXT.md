# Project Context - YoEdu Appointment Booking FE

## Mục tiêu

Frontend cho website appointment booking của YoEdu. Giao diện cần hiện đại, hài hòa, chuyên nghiệp,
không quá "AI-looking". Hiện chưa có backend/API thật nên toàn bộ dữ liệu nghiệp vụ đang dùng mock data,
nhưng cấu trúc phải sẵn sàng nối API sau này.

## Guide nền

Luôn đọc và bám theo `AGENT_IMPLEMENTATION_GUIDE.md` trước khi phát triển tiếp.

Các nguyên tắc quan trọng từ guide:

- Stack: React + TypeScript + Vite.
- React Router quản lý route.
- Redux Toolkit chỉ dùng cho state toàn cục thật sự cần chia sẻ; hiện tại auth là state toàn cục chính.
- Axios client chung ở `src/shared/lib/axios.ts`.
- Ant Design là UI library chính.
- Tailwind CSS dùng cho layout và style bổ sung.
- Alias `@/` trỏ tới `src/`.
- Business code đặt trong `features/<feature>`.
- Code dùng chung, không biết nghiệp vụ, đặt trong `shared`.
- Không lưu access token hoặc refresh token trong Web Storage.

## Cấu trúc hiện tại

```text
src/
├── app/
│   ├── init/AppInit.tsx
│   ├── layouts/MainLayout.tsx
│   ├── providers/AppProvider.tsx
│   ├── redux/
│   └── router/
├── assets/
│   └── appointment-hero.png
├── features/
│   ├── appointments/
│   ├── auth/
│   ├── dashboard/
│   ├── profile/
│   └── promotions/
├── shared/
│   ├── components/AppRouteError.tsx
│   ├── lib/axios.ts
│   ├── theme/app-theme.ts
│   └── types/
└── styles/global.css
```

## Routes

- `/`: homepage đặt lịch.
- `/promotions`: trang khuyến mãi.
- `/profile`: profile user, cần đăng nhập.
- `/booking-history`: lịch sử đặt dịch vụ, cần đăng nhập.
- `/staff/dashboard`: dashboard staff, chỉ role `staff`.
- `/admin/dashboard`: dashboard admin, chỉ role `admin`.

Route root có `errorElement` là `AppRouteError` để tránh màn hình stacktrace thô khi có lỗi runtime.

## Auth hiện tại

Auth đang mock trong:

- `src/features/auth/api/auth-api.ts`
- `src/features/auth/store/auth-slice.ts`
- `src/features/auth/components/LoginModal.tsx`

Role mock:

- `customer`
- `staff`
- `admin`

Login là popup trên navbar. Sau login, navbar hiển thị tên user, avatar và dropdown gồm:

- Dashboard, chỉ hiện với `staff` hoặc `admin`.
- Profile user.
- Lịch sử đặt dịch vụ.
- Khuyến mãi.
- Đăng xuất.

Auth state chỉ lưu:

- `user`
- `initialized`
- `loading`
- `error`

Không lưu token trong localStorage/sessionStorage/Redux persist. Khi backend có API thật, ưu tiên contract
HttpOnly cookie theo guide.

## Appointment booking hiện tại

Mock API nằm ở:

- `src/features/appointments/api/appointment-api.ts`

Mock data nằm ở:

- `src/features/appointments/constants/appointment-mock-data.ts`

Các type chính:

- `Service`
- `Specialist`
- `Appointment`
- `BookingPayload`

Homepage nằm ở:

- `src/features/appointments/pages/HomePage.tsx`

Lưu ý quan trọng: `Ant Design DatePicker` cần value dạng `Dayjs`, không dùng string trực tiếp trong form field.
Khi submit booking, UI form giữ `date: Dayjs`, sau đó convert sang `YYYY-MM-DD` để tạo `BookingPayload`.

## UI/Design

Phong cách hiện tại:

- Nền sáng, chuyên nghiệp.
- Palette chính: sage green, ink/navy, coral, amber nhẹ.
- Không dùng neon/glow quá đà.
- Card radius khoảng 8px theo hướng dẫn.
- Có ảnh hero bitmap thật ở `src/assets/appointment-hero.png`.

Ảnh hero được generate bằng built-in image tool, prompt chính:

```text
Modern healthcare and wellness appointment booking scene, contemporary clinic reception mixed with
spa-like consultation area, tablet calendar interface, soft plants, warm professional atmosphere,
wide hero composition, no text, no logo, no watermark, not futuristic.
```

## Commands

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run g <feature-name>
```

Dev server gần nhất chạy ở:

```text
http://127.0.0.1:5173/
```

## Verification gần nhất

Đã pass:

```bash
npm.cmd run lint
npm.cmd run build
```

Build có warning chunk lớn do Ant Design bundle. Đây chưa phải lỗi runtime; nếu cần tối ưu sau này thì cân nhắc
route-level lazy loading hoặc manual chunks.
