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

### Added admin user update flow

Đã nối API cập nhật thông tin user cho admin.

Thay đổi chính:

- Thêm `PUT /admin/users/update/{id}` vào `adminUserRoleAdminApi.update`.
- Thêm `UpdateUserInfoPayload` gồm `role` và `status`.
- Thêm action sửa trong bảng user, mở modal cập nhật vai trò/trạng thái.
- Sau cập nhật thành công sẽ đóng modal, refetch danh sách và refetch thống kê.
- Dùng Ant Design notification toast góc phải trên cho success/error thay vì hiển thị lỗi mutation trên trang.
- Thêm `src/shared/utils/api-error.ts` để lấy `message` từ response lỗi backend khi có.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Fixed admin user update contract

Đã rà lại FE theo controller backend `UserManagerController`.

Thay đổi chính:

- Sửa response type của `PUT /admin/users/update/{id}` từ `ApiResponse<string>` sang `ApiResponse<null>` vì backend trả `ApiResponse<Void>`.
- Đổi status option update/filter từ `BLOCKED` sang `INACTIVE`.
- Giữ normalize `BLOCKED -> INACTIVE` chỉ để tương thích dữ liệu list cũ nếu có.
- Xóa `console.log` debug trong submit update user.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Integrated admin category APIs

Đã triển khai trang quản lí danh mục admin theo contract backend mới.

Thay đổi chính:

- Đổi thứ tự submenu trong sidebar: `Danh mục` đứng trước `Dịch vụ` dưới nhóm `Quản lí dịch vụ`.
- Thêm feature `src/features/admin-categories` gồm type, API và page.
- Nối `GET /admin/categories` với params `keyword`, `page`, `size`; API layer map từ pagination chung `limit` sang `size`.
- Nối `POST /admin/categories`, `PUT /admin/categories/{id}`, `DELETE /admin/categories/{id}`.
- Thêm `ApiMessageResponse` cho mutation response dạng `{ success, message }`.
- Page danh mục có tìm kiếm keyword, phân trang size mặc định 5, thêm/sửa bằng modal, xóa bằng confirm và toast success/error góc phải trên.
- Route `/admin/dashboard/categories` không còn dùng placeholder `AdminManagementPage`, chuyển sang `AdminCategoriesPage`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Integrated admin service APIs

Đã triển khai trang quản lí dịch vụ admin theo contract backend mới.

Thay đổi chính:

- Thêm feature `src/features/admin-services` gồm type, constants, API và page.
- Nối `GET /admin/services` với params `keyword`, `page`, `size`; API layer map từ pagination chung `limit` sang `size`.
- Nối `POST /admin/services` multipart form data.
- Nối `PUT /admin/services/{id}` multipart form data.
- Nối `GET /public/categories` để lấy option danh mục cho form thêm/sửa dịch vụ.
- Route `/admin/dashboard/services` không còn dùng placeholder `AdminManagementPage`, chuyển sang `AdminServicesPage`.
- Bảng dịch vụ hiển thị ảnh đại diện bằng ảnh chính `isMainImage`, fallback ảnh đầu tiên.
- Thêm modal chi tiết dịch vụ để xem đầy đủ thông tin và danh sách ảnh.
- Form thêm/sửa có upload tối đa 5 ảnh; ảnh được chọn làm ảnh chính sẽ được đưa lên đầu danh sách `images` trước khi gửi.
- Create gửi `categoryId`; update gửi `categoryName` và `status` đúng khác biệt contract.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Adjusted admin service image order and status filter

Đã chỉnh lại theo contract backend mới cho quản lí dịch vụ.

Thay đổi chính:

- Bỏ gửi `mainImageIndex` trong multipart form data.
- Khi người dùng chọn ảnh chính, FE reorder danh sách upload để ảnh đó đứng đầu mảng `images`; backend dùng file đầu tiên làm ảnh chính.
- Thêm filter `status` cho `GET /admin/services`, hỗ trợ `ACTIVE` và `INACTIVE`.
- Thêm select trạng thái vào filter của trang quản lí dịch vụ.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Added asset URL helper for service images

Đã thêm util dùng chung để hiển thị ảnh backend trả về.

Thay đổi chính:

- Thêm `src/shared/utils/asset-url.ts`.
- `getAssetUrl(path)` ghép path tương đối với `http://localhost:8083/`.
- Nếu path đã là full `http(s)` URL thì giữ nguyên.
- Trang quản lí dịch vụ dùng util này cho ảnh đại diện và ảnh trong modal chi tiết.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Integrated admin users APIs

Đã triển khai trang quản lí người dùng admin theo contract backend mới.

Thay đổi chính:

- Thêm feature `src/features/admin-users` gồm API, type, constants, hook stats và page.
- Nối `GET /admin/users` với params `page`, `limit`, `role`, `status`, `search`.
- Nối `GET /admin/users/stats` để hiển thị tổng user, active user và inactive user.
- Thêm `src/shared/hooks/useTable.ts` để dùng chung flow list có pagination/filter theo response `items/total/page/limit`.
- Route `/admin/dashboard/users` không còn dùng placeholder `AdminManagementPage`, chuyển sang `AdminUsersPage`.
- Bảng user có filter search/role/status, phân trang chuẩn, avatar fallback chữ cái đầu và trạng thái empty/error.

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

### Added .gitignore

Đã thêm `.gitignore` cho frontend project.

Các nhóm ignore chính:

- `node_modules/`
- build output như `dist/`, `build/`, `coverage/`
- Vite/TypeScript cache
- log files, gồm `vite-dev.out.log` và `vite-dev.err.log`
- env local, giữ lại `.env.example` nếu có
- editor/OS files
- temp/archive files

### Auth modal redesign: login, forgot password, register

Đã cập nhật flow auth theo yêu cầu mới:

- Bỏ chọn role khỏi form đăng nhập.
- Thêm form đăng nhập gồm title, email, mật khẩu, `Ghi nhớ tôi`, `Quên mật khẩu?`, đăng nhập, Google login, link đăng kí.
- Thêm form quên mật khẩu gồm title, email, nút tiếp tục, nút trở lại đăng nhập.
- Thêm form đăng kí gồm title, email, password, họ, tên, đăng kí, Google login, link đăng nhập.
- Google login chưa triển khai chức năng, chỉ hiển thị thông báo placeholder.
- Thêm `RegisterPayload` và `register` thunk/mock API.
- Mock login không chọn role nữa; role được suy ra theo email `admin@yoedu.vn`, `staff@yoedu.vn`, còn lại là `customer`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Integrated real auth APIs

Đã thay auth mock bằng API thật theo contract được cung cấp.

Thay đổi chính:

- Thêm `src/shared/lib/auth-token.ts` để giữ access token trong memory runtime.
- Cập nhật `src/shared/lib/axios.ts` để gắn `Authorization: Bearer <token>` bằng interceptor.
- Cập nhật `auth-type.ts` với `ApiResponse`, `AuthTokenData`, `BackendMeData`.
- Cập nhật `auth-api.ts` gọi:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /users/me`
- Cập nhật `auth-slice.ts` để sau login/register sẽ set token, gọi `users/me`, sau đó lưu user/role thật vào Redux.
- Role backend `ADMIN`, `STAFF`, `CUSTOMER` được map sang role UI `admin`, `staff`, `customer`.
- Bỏ autofill email/password mock khỏi login modal.
- Thêm `.env.example` với `VITE_API_URL=http://localhost:8080/api`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Switched auth to HttpOnly cookie mode

Đã chuyển auth từ runtime token memory sang HttpOnly cookie mode.

Thay đổi chính:

- Xóa `src/shared/lib/auth-token.ts` vì FE không còn giữ token JS.
- Cập nhật `src/shared/lib/axios.ts`:
  - giữ `withCredentials: true`
  - bỏ `Authorization: Bearer ...`
  - thêm response interceptor bắt `401`
  - gọi `POST /auth/refresh-token` bằng cookie
  - queue các request đang chờ refresh và retry sau refresh thành công
  - skip refresh cho `/auth/login`, `/auth/register`, `/auth/refresh-token`, `/auth/logout`
- Cập nhật `auth-slice.ts`:
  - `initializeAuth` gọi `users/me` để khôi phục session từ cookie
  - `login/register` gọi endpoint auth rồi gọi `users/me`
  - `logout` gọi `auth/logout`
  - nếu logout rejected vẫn clear user local để UI rời phiên hiện tại
- Cập nhật `auth-api.ts` thêm `POST /auth/logout`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Fixed login modal warnings and API base URL

Đã xử lý các lỗi khi mở/submitting login form:

- Cài `@ant-design/v5-patch-for-react-19` để hết warning Ant Design với React 19.
- Import patch này đầu tiên trong `src/main.tsx`.
- Refactor `LoginModal.tsx` bỏ các `Form.useForm()` instance không được render đồng thời, hết warning `Instance created by useForm is not connected to any Form element`.
- Tạo `.env.local` từ `.env.example` để `VITE_API_URL` được nạp khi chạy Vite.
- Restart dev server để request auth không còn gọi nhầm `http://localhost:5173/auth/login`.

Base URL hiện tại trong `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

Nếu backend không dùng prefix `/api`, cần đổi lại thành URL backend thật.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Added Avatar fallback for users without picture

Đã xử lý trường hợp `users/me.data.picture` rỗng/null:

- Thêm `src/shared/utils/avatar.ts` với `getAvatarInitial`.
- Navbar user avatar dùng `Avatar src={user.avatarUrl || undefined}` và fallback chữ cái đầu từ `fullName/email`.
- Profile avatar dùng fallback chữ cái đầu tương tự.
- Adapter `users/me` normalize `picture` rỗng thành empty string.
- Sửa lại text tiếng Việt bị mojibake trong `ProfilePage.tsx`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Refactored auth modal into form components

Đã tách `LoginModal.tsx` cũ thành cấu trúc auth modal rõ hơn:

- `AuthModal.tsx`: điều phối mode, dispatch login/register, xử lý Google placeholder và forgot password placeholder.
- `LoginForm.tsx`: form đăng nhập.
- `RegisterForm.tsx`: form đăng kí.
- `ForgotPasswordForm.tsx`: form quên mật khẩu.
- `auth-modal-types.ts`: type UI cho auth modal.
- `LoginModal.tsx`: chỉ còn re-export tương thích `AuthModal as LoginModal`.

`MainLayout.tsx` đã import trực tiếp `AuthModal`. Đồng thời làm sạch đoạn Avatar JSX từng bị literal newline do replace trước đó.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Cleaned up auth type organization and role model

Theo review tổ chức code:

- Đổi `UserRole` sang dùng trực tiếp role backend: `CUSTOMER | STAFF | ADMIN`.
- Bỏ `BackendUserRole` và `mapBackendRole`, vì role từ backend đã là domain role thật.
- Đổi `BackendMeData` thành `CurrentUserData` để rõ response `/users/me` là current user data.
- Giữ adapter `toUser` chỉ để đổi tên field API sang model UI (`userId -> id`, `picture -> avatarUrl`, `phoneNumber -> phone`), không đổi role nữa.
- Chuyển `AuthMode` và `ForgotPasswordPayload` từ `auth-modal-types.ts` vào `features/auth/types/auth-type.ts`.
- Xóa `auth-modal-types.ts`.
- Cập nhật route guard và dashboard path dùng role uppercase `ADMIN`/`STAFF`.
- Sửa lại text mojibake trong `ProtectedRoute.tsx`.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```

### Dashboard layout with role sidebar

Đã chuyển dashboard từ route đơn sang nested dashboard layout dùng chung.

Thay đổi chính:

- Thêm `src/features/dashboard/components/DashboardLayout.tsx`.
- Thêm `src/features/dashboard/constants/dashboard-nav.tsx` để cấu hình sidebar theo role.
- Thêm `src/features/dashboard/types/dashboard-type.ts`.
- Admin dashboard có sidebar gồm:
  - Thống kê
  - Quản lí người dùng
  - Quản lý khuyến mãi
  - Quản lí đánh giá
  - Quản lí dịch vụ
  - Quản lí danh mục
  - Quản lí khóa slot
- Staff dashboard có sidebar gồm:
  - Lịch làm việc
- Route dashboard chuyển sang nested routes dưới `/admin/dashboard` và `/staff/dashboard`.
- Thêm `AdminManagementPage.tsx` làm placeholder dùng chung cho các màn quản lý admin khi chưa có API thật.

Đã chạy và pass:

```bash
npm.cmd run lint
npm.cmd run build
```
