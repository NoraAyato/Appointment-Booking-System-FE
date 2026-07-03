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

## Auth flow update - 2026-06-26

Login modal hiện không còn chọn role thủ công.

Flow trong `src/features/auth/components/LoginModal.tsx` gồm 3 chế độ:

- Đăng nhập: title, email, mật khẩu, dòng `Ghi nhớ tôi` cùng hàng với `Quên mật khẩu?`, nút đăng nhập, Google login, link sang đăng kí.
- Quên mật khẩu: title, email, nút tiếp tục, nút trở lại đăng nhập. Chưa nối API thật.
- Đăng kí: title, email, password, họ, tên, nút đăng kí, Google login, link trở về đăng nhập.

Google login đang là UI placeholder và chỉ hiện thông báo chưa triển khai chức năng.

Vì không còn chọn role trên UI, mock login xác định role theo email để vẫn test được dashboard:

- `admin@yoedu.vn` -> `admin`
- `staff@yoedu.vn` -> `staff`
- Email khác -> `customer`

## Auth API integration - 2026-06-26

Auth đã chuyển từ mock sang API thật theo contract được cung cấp.

Endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `GET /users/me`

Base URL cấu hình qua `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

`login` và `register` trả token response dạng:

```json
{
  "success": true,
  "message": "...",
  "data": {
    "accessToken": "...",
    "refreshToken": null,
    "tokenType": "Bearer"
  }
}
```

Sau login/register, flow hiện tại:

1. Gọi `auth/login` hoặc `auth/register`.
2. Lưu `accessToken` vào runtime memory qua `src/shared/lib/auth-token.ts`.
3. Axios interceptor trong `src/shared/lib/axios.ts` gắn `Authorization: Bearer <token>`.
4. Gọi `GET /users/me`.
5. Map role backend `ADMIN`, `STAFF`, `CUSTOMER` sang role UI `admin`, `staff`, `customer`.
6. Lưu user thật vào Redux auth state.

Không lưu token vào `localStorage` hoặc `sessionStorage`. Vì backend hiện trả `refreshToken: null` và chưa có cookie/session endpoint,
refresh page sẽ mất token runtime cho đến khi có cơ chế session/refresh chính thức.

## Auth cookie mode update - 2026-06-26

Auth đã chuyển sang HttpOnly cookie mode.

Trạng thái hiện tại:

- FE không lưu `accessToken` hoặc `refreshToken` trong JavaScript memory, localStorage, sessionStorage hay Redux.
- `src/shared/lib/auth-token.ts` đã bị xóa.
- `axiosClient` dùng `withCredentials: true` để browser tự gửi cookie.
- Login/register vẫn gọi `POST /auth/login` và `POST /auth/register`; backend chịu trách nhiệm set cookie.
- Sau login/register, FE gọi `GET /users/me` để lấy user thật và role thật.
- Khi request private bị `401`, Axios interceptor gọi `POST /auth/refresh-token` bằng cookie, sau đó retry request cũ.
- `POST /auth/logout` được gọi khi đăng xuất để backend clear cookie.
- Các endpoint auth không tự refresh để tránh vòng lặp: `/auth/login`, `/auth/register`, `/auth/refresh-token`, `/auth/logout`.

Lưu ý backend: với HttpOnly cookie mode, `/auth/refresh-token` cần đọc refresh token từ cookie hoặc nguồn server-side tương ứng. FE không thể đọc HttpOnly cookie để gửi refresh token trong body.

## Dashboard layout update

Dashboard hiện dùng nested layout riêng:

- `src/features/dashboard/components/DashboardLayout.tsx`: layout chung có sidebar + Outlet.
- `src/features/dashboard/constants/dashboard-nav.tsx`: menu sidebar theo admin/staff.
- Admin routes nằm dưới `/admin/dashboard`:
  - `/admin/dashboard`
  - `/admin/dashboard/users`
  - `/admin/dashboard/promotions`
  - `/admin/dashboard/reviews`
  - `/admin/dashboard/services`
  - `/admin/dashboard/categories`
  - `/admin/dashboard/slot-locks`
- Staff routes nằm dưới `/staff/dashboard`:
  - `/staff/dashboard`

Page `/admin/dashboard/users` đã nối API thật qua feature `src/features/admin-users`.

Endpoints admin users:

- `GET /admin/users` với params `page`, `limit`, `role`, `status`, `search`.
- `GET /admin/users/stats`.
- `PUT /admin/users/update/{id}` với body `role`, `status`.

Status admin user phía FE gửi lên API update/filter dùng `ACTIVE` hoặc `INACTIVE`. Nếu list cũ trả `BLOCKED`, UI chỉ normalize để hiển thị/chọn lại thành `INACTIVE`, không gửi `BLOCKED` lên backend.

Response list dùng pagination chuẩn:

```json
{
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

Các page quản lý admin khác hiện vẫn là placeholder mock qua `AdminManagementPage.tsx`. Khi có API thật, tách thành feature riêng tương ứng.

Thông báo lỗi/thành công trong màn quản lí người dùng dùng Ant Design notification dạng toast ở góc phải trên. Không render lỗi mutation trực tiếp lên page.

Page `/admin/dashboard/categories` đã nối API thật qua feature `src/features/admin-categories`.

Endpoints admin categories:

- `GET /admin/categories` với params `keyword`, `page`, `size`. API layer map `limit -> size` để dùng chung `useTable`.
- `POST /admin/categories` với body `name`, `description`.
- `PUT /admin/categories/{id}` với body `name`, `description`.
- `DELETE /admin/categories/{id}`.

Mutation category trả `{ success, message }` và không bắt buộc có `data`, nên dùng `ApiMessageResponse`.

Page `/admin/dashboard/services` đã nối API thật qua feature `src/features/admin-services`.

Endpoints admin services:

- `GET /admin/services` với params `keyword`, `status`, `page`, `size`. API layer map `limit -> size` để dùng chung `useTable`.
- `POST /admin/services` multipart form data với `name`, `description`, `durationMinutes`, `price`, `categoryId`, `images`.
- `PUT /admin/services/{id}` multipart form data với `name`, `description`, `durationMinutes`, `price`, `status`, `categoryName`, `images`.
- `GET /public/categories` để lấy option danh mục khi thêm/sửa dịch vụ.

List service hiển thị ảnh chính từ `serviceImageList.isMainImage`, fallback ảnh đầu tiên. Form upload tối đa 5 ảnh; khi người dùng chọn ảnh chính, FE đưa ảnh đó lên đầu danh sách file trước khi gửi `images` để backend nhận ảnh đầu tiên là ảnh chính.

Ảnh trả về từ backend nếu là path tương đối sẽ được build bằng `src/shared/utils/asset-url.ts` với base `http://localhost:8083/`. Nếu backend trả full `http(s)` URL thì giữ nguyên.
