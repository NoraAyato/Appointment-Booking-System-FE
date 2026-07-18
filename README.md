# HomeFeel Appointment Booking FE

Frontend cho hệ thống đặt lịch dịch vụ HomeFeel. Dự án tập trung vào trải nghiệm đặt lịch cho khách hàng, khu quản trị cho Admin, không gian làm việc cho Staff và luồng thanh toán MoMo Sandbox.

Repo này được tổ chức theo hướng feature-first: business code nằm trong từng `features/<feature>`, còn phần dùng chung như Axios client, table, pagination, select, theme, utility nằm trong `shared`.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- React Router 7
- Redux Toolkit + React Redux
- TanStack Query
- Axios
- Ant Design 5, có `@ant-design/v5-patch-for-react-19`
- Tailwind CSS 3
- Dayjs
- ESLint + TypeScript build

## Chức Năng Chính

### Public Website

- Trang chủ HomeFeel với hero, dịch vụ nổi bật và đánh giá nổi bật.
- Trang dịch vụ public có tìm kiếm, lọc ngày, lọc danh mục và phân trang.
- Trang chi tiết dịch vụ có gallery ảnh, thông tin dịch vụ, thống kê đánh giá, danh sách đánh giá có phân trang và chọn nhân viên khả dụng theo ngày giờ.
- Trang khuyến mãi public dùng API phân trang.
- Trang giới thiệu thương hiệu.

### Auth & Session

- Login popup gồm đăng nhập, đăng ký, quên mật khẩu và Google callback.
- FE không lưu access token hoặc refresh token trong `localStorage`/`sessionStorage`.
- Auth sử dụng HttpOnly cookie từ backend, FE gửi request với `withCredentials: true`.
- `axiosClient` tự gọi refresh token khi gặp `401`, retry request đang lỗi và phát event `auth:expired` nếu session hết hạn.
- `AppInit` bootstrap session bằng `users/me`, sau đó lưu user hiện tại vào Redux để route, navbar và các page dùng lại.

### Customer Booking Flow

Luồng đặt lịch hiện tại:

1. Khách hàng xem danh sách dịch vụ ở `/services`.
2. Khách hàng mở chi tiết dịch vụ ở `/services/:serviceId`.
3. FE lấy khung giờ khả dụng theo ngày và danh sách staff khả dụng theo dịch vụ, ngày, giờ.
4. Người dùng bấm đặt dịch vụ. Nếu chưa đăng nhập, hệ thống yêu cầu đăng nhập trước.
5. FE giữ slot tạm thời bằng API hold slot.
6. Người dùng sang trang `/appointments/confirm` để kiểm tra lại dịch vụ, staff, ngày giờ và nhập ghi chú.
7. Người dùng xác nhận đặt lịch. API trả về `invoiceId`.
8. FE chuyển sang `/invoices/checkout` để lấy chi tiết hóa đơn từ `/invoices/{invoiceId}`.
9. Người dùng có thể nhập mã khuyến mãi. Nếu áp dụng thành công, hóa đơn hiển thị mã và số tiền giảm.
10. Người dùng thanh toán bằng MoMo Sandbox. Thanh toán tiền mặt hiện được khóa ở FE vì chưa hỗ trợ.
11. Sau khi MoMo redirect về `/payment/result`, FE chỉ hiển thị trạng thái thân thiện cho người dùng và không lộ thông tin kỹ thuật nhạy cảm.

### Admin Workspace

Admin sử dụng layout dashboard riêng, không dùng header/footer của public site.

Các module đã tổ chức theo feature riêng:

- `admin-dashboard`: thống kê lịch hẹn, doanh thu, dịch vụ top, hiệu suất staff, cảnh báo vận hành.
- `admin-users`: quản lý người dùng, thống kê user, cập nhật role/status.
- `admin-categories`: quản lý danh mục, gồm màu tag `tagColor`.
- `admin-services`: quản lý dịch vụ, upload nhiều ảnh, ảnh chính là ảnh đứng đầu danh sách gửi lên backend.
- `admin-promotions`: quản lý khuyến mãi.
- `admin-reviews`: duyệt và xem chi tiết đánh giá.
- `admin-blocked-slots`: quản lý khóa lịch linh hoạt cho staff hoặc toàn bộ staff.
- `admin-staff-shifts`: quản lý ca làm việc.
- `admin-staff-services`: phân công staff phụ trách dịch vụ.

### Staff Workspace

Staff sử dụng dashboard layout riêng và sidebar riêng.

Các module chính:

- `staff-dashboard`: tổng quan ngày làm việc, lịch biểu tuần và trạng thái vận hành cá nhân.
- `staff-shifts`: xem ca làm việc của staff.
- `staff-leave-requests`: xin nghỉ và theo dõi số lần nghỉ.
- `staff-appointments`: quản lý lịch hẹn đã xác nhận/đã hoàn thành, upload ảnh kết quả khi hoàn tất lịch hẹn.

## Cấu Trúc Thư Mục

```text
src/
├── app/
│   ├── init/          # Bootstrap session/app
│   ├── layouts/       # Layout cấp route
│   ├── providers/     # Redux, AntD, Router providers
│   ├── redux/         # Store và typed hooks
│   └── router/        # Route tree và ProtectedRoute
├── features/
│   └── <feature>/
│       ├── api/       # API layer của feature
│       ├── components/ # Component chỉ dùng trong feature
│       ├── constants/ # Option, mapping, config form/filter
│       ├── pages/     # Page-level route component
│       ├── store/     # Redux slice/thunk nếu feature cần global state
│       ├── types/     # Type, payload, params, response model
│       └── utils/     # Helper riêng của feature nếu cần
├── shared/
│   ├── components/    # Component trung lập: DataTable, AppPagination, AppSelect
│   ├── constants/     # Hằng số dùng chung
│   ├── hooks/         # Hook dùng chung
│   ├── lib/           # Axios client và cấu hình thư viện
│   ├── theme/         # Ant Design theme token
│   ├── types/         # ApiResponse, PaginatedData, FilterParams
│   └── utils/         # api-error, asset-url, date, pagination, avatar
├── assets/
└── styles/
```

## Quy Ước Kiến Trúc

Các thay đổi mới nên bám theo `AGENT_IMPLEMENTATION_GUIDE.md`.

- Page/component không gọi Axios trực tiếp. API call phải nằm trong `features/<feature>/api`.
- Type request/response/payload đặt trong `features/<feature>/types`.
- Mapping dữ liệu backend sang model UI nên đặt ở API layer, mapper hoặc util của feature.
- State global chỉ dùng khi nhiều route/component thật sự cần chia sẻ. Hiện user hiện tại được lưu trong Redux.
- Server data chỉ phục vụ một page nên giữ trong state local của page hoặc hook của feature.
- Component thật sự dùng chung và không biết nghiệp vụ mới đưa vào `shared/components`.
- Pagination API dùng chuẩn:

```ts
interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

## API & Auth Flow

Axios client chung nằm tại:

```text
src/shared/lib/axios.ts
```

Cấu hình chính:

- `baseURL: import.meta.env.VITE_API_URL`
- `withCredentials: true`
- `Content-Type: application/json`
- Refresh token tự động khi backend trả `401`
- Không refresh lại đối với auth endpoints như login, register, refresh-token, logout

Auth/user flow:

```text
App start
→ AppInit dispatch fetchCurrentUser()
→ users/me đọc cookie HttpOnly ở backend
→ user slice lưu currentUser
→ ProtectedRoute kiểm tra role ADMIN/STAFF khi vào dashboard
```

Login/register flow:

```text
Auth form submit
→ auth API set cookie qua backend
→ auth slice tăng sessionVersion
→ AppInit chạy lại fetchCurrentUser()
→ navbar/dropdown/dashboard route dùng currentUser từ Redux
```

## Server-State Cache

TanStack Query được dùng cho các dữ liệu `GET` có thể cache/refetch:

- Danh sách dịch vụ public, danh mục dịch vụ và service detail fallback.
- Top services ở trang chủ.
- Top reviews ở trang chủ.
- Review stats và review pagination ở trang chi tiết dịch vụ.

Quy ước hiện tại:

- `src/shared/lib/query-client.ts`: cấu hình `QueryClient`.
- `features/<feature>/constants/*-query-keys.ts`: quản lý query key theo feature.
- `features/<feature>/hooks/use*Query.ts`: hook gọi API layer và unwrap `ApiResponse<T>`.
- Page chỉ giữ UI state như filter, page, selected date/time và render dữ liệu từ query hook.
- Redux không dùng để cache server data từng page.

## Payment Flow

Luồng MoMo hiện tại:

```text
Invoice checkout
→ POST /payments/momo/{invoiceId}
→ backend trả paymentUrl
→ FE redirect người dùng sang MoMo Sandbox
→ MoMo redirect về /payment/result
→ FE kiểm tra trạng thái payment theo paymentId hoặc latest invoice payment
→ UI hiển thị thành công, đang xử lý hoặc thất bại theo ngôn ngữ thân thiện
```

Lưu ý:

- FE không gọi IPN. IPN là callback giữa MoMo và backend.
- FE không hiển thị `paymentId`, `orderId`, `requestId`, IPN URL hoặc lỗi kỹ thuật nội bộ cho người dùng cuối.
- Thanh toán tiền mặt hiện bị disable ở UI vì backend/payment flow chưa hỗ trợ.

## Environment

Tạo `.env.local` từ `.env.example`:

```env
VITE_API_URL=http://localhost:8083/api
VITE_GOOGLE_CLIENT_ID=
```

Backend cần bật CORS credential và set cookie phù hợp để FE gửi request kèm cookie.

## Cài Đặt & Chạy Dự Án

```bash
npm install
npm run dev
```

Trên Windows PowerShell có thể dùng:

```bash
npm.cmd install
npm.cmd run dev
```

Mặc định Vite chạy ở:

```text
http://127.0.0.1:5173/
```

## Scripts

```bash
npm run dev      # Chạy dev server
npm run build    # TypeScript build + Vite production build
npm run lint     # Chạy ESLint
npm run preview  # Preview build
npm run g <name> # Generate skeleton feature
```

## Checklist Khi Review

- Luồng route public/admin/staff tách layout rõ ràng.
- API layer nằm trong đúng feature, không gọi Axios trực tiếp ở page.
- TypeScript model khớp API contract.
- Loading, empty, error và toast được xử lý nhất quán.
- Table dùng `DataTable`, phân trang dùng `AppPagination` khi phù hợp.
- Select option dùng component/helper chung khi có search/filter option.
- Hình ảnh từ backend đi qua `getAssetUrl`.
- Auth không lưu token vào Web Storage.
- Payment result không làm lộ thông tin kỹ thuật nhạy cảm.

## Tài Liệu Nội Bộ

- `AGENT_IMPLEMENTATION_GUIDE.md`: quy tắc tổ chức code và flow triển khai.
- `FE_FLOW_ANALYSIS.md`: phân tích flow frontend chi tiết.
- `PROJECT_CONTEXT.md`: bối cảnh dự án qua các giai đoạn.
- `TASK_LOG.md`: lịch sử các nhóm việc đã triển khai.

## Trạng Thái Chất Lượng

Quality gate hiện tại:

```bash
npm run lint
npm run build
```
