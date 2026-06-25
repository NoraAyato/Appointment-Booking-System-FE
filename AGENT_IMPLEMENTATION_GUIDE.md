# Hướng dẫn triển khai frontend cho Agent

## 1. Mục đích

Tài liệu này mô tả cách triển khai **chung** cho frontend YoEdu. Agent phải dùng tài
liệu như một bộ quy tắc kiến trúc khi thêm hoặc sửa tính năng.

Mục tiêu:

- Giữ code nhất quán với cấu trúc hiện tại.
- Đặt business code đúng feature, chỉ đưa phần thực sự dùng chung vào `shared`.
- Tái sử dụng các component và hook sẵn có trước khi tạo abstraction mới.
- Giữ page tập trung vào việc phối hợp dữ liệu và UI, không chứa hạ tầng dùng chung.
- Không lưu access token hoặc refresh token trong Web Storage.

Tài liệu chỉ quy định pattern chung. Tên endpoint, trường dữ liệu, quyền và giao diện
cụ thể phải lấy từ yêu cầu của từng tính năng và API contract thực tế.

## 2. Stack và nguyên tắc nền

- React + TypeScript + Vite.
- React Router quản lý route.
- Redux Toolkit quản lý state toàn cục thực sự cần chia sẻ; hiện tại auth là state
  toàn cục chính.
- Axios là HTTP client chung.
- Ant Design là thư viện UI chính.
- Tailwind CSS dùng cho layout và style bổ sung.
- Alias `@/` trỏ tới `src/`.
- ESLint và TypeScript là hàng rào chất lượng bắt buộc.

Nguyên tắc:

1. Ưu tiên type an toàn, không thêm `any` nếu có thể mô tả kiểu dữ liệu.
2. Ưu tiên code cục bộ trong feature; chỉ đưa lên `shared` khi ít nhất nhiều feature
   có cùng nhu cầu và abstraction không chứa nghiệp vụ riêng.
3. Không gọi Axios trực tiếp trong page/component. API call phải nằm trong thư mục
   `api` của feature và dùng `axiosClient`.
4. Không sao chép component chung để sửa riêng. Mở rộng component chung nếu thay đổi
   vẫn có ý nghĩa tổng quát; nếu không, tạo component trong feature.
5. Không đưa server data của mọi màn hình vào Redux. Dùng state/hook cục bộ khi dữ
   liệu chỉ phục vụ một page hoặc một luồng ngắn.
6. Reducer phải thuần: không gọi API, redirect, ghi cookie hoặc ghi Web Storage trong
   reducer.

## 3. Ranh giới thư mục

```text
src/
├── app/                       # Hạ tầng cấp ứng dụng
│   ├── init/                  # Khởi tạo session/app
│   ├── layouts/               # Khung giao diện cấp route
│   ├── providers/             # Provider toàn ứng dụng
│   ├── redux/                 # Store và typed Redux hooks
│   └── router/                # Route tree và route guard
├── features/
│   └── <feature-name>/        # Một miền nghiệp vụ
│       ├── api/               # Hàm giao tiếp API
│       ├── components/        # UI chỉ dùng trong feature
│       ├── constants/         # Form, filter, option, mapping của feature
│       ├── pages/             # Component cấp route
│       ├── store/             # Chỉ tạo khi feature cần state toàn cục
│       ├── styles/            # Style riêng khi thực sự cần
│       └── types/             # Model, payload, params của feature
├── shared/
│   ├── components/            # UI tổng quát, không biết nghiệp vụ
│   ├── constants/             # Hằng số dùng xuyên feature
│   ├── hooks/                 # Hành vi UI/data tổng quát
│   ├── lib/                   # Cấu hình thư viện/hạ tầng, ví dụ Axios
│   ├── theme/                 # Design token
│   ├── types/                 # Type tổng quát
│   └── utils/                 # Hàm thuần dùng chung
├── assets/                    # Tài nguyên tĩnh được import
└── styles/                    # Global style
```

### Quy tắc chọn nơi đặt code

| Câu hỏi                                                 | Nơi đặt                                                 |
| ------------------------------------------------------- | ------------------------------------------------------- |
| Đây là route, provider, store hoặc layout cấp ứng dụng? | `app/`                                                  |
| Code có chứa khái niệm nghiệp vụ của một module?        | `features/<feature>/`                                   |
| Code không biết nghiệp vụ và được dùng ở nhiều feature? | `shared/`                                               |
| Chỉ một page dùng đoạn UI này?                          | Component trong feature hoặc giữ trong page nếu rất nhỏ |
| Đây là model/payload/filter riêng của feature?          | `features/<feature>/types/`                             |
| Đây là helper thuần, tổng quát?                         | `shared/utils/`                                         |

Không import ngược từ `shared` vào `features`. `shared` phải độc lập với business
feature. Nếu component chung cần role hoặc model riêng của một feature, cần xem lại
ranh giới abstraction và chuyển type tổng quát phù hợp sang `shared`.

## 4. Cấu trúc chuẩn của một feature

Tạo skeleton bằng:

```bash
npm.cmd run g <feature-name>
```

Cấu trúc mặc định:

```text
features/<feature-name>/
├── api/
│   └── <feature>-api.ts
├── components/
├── constants/
│   ├── <feature>-form-fields.ts
│   └── <feature>-filter-table.ts
├── pages/
│   └── <Feature>Page.tsx
└── types/
    ├── <feature>-type.ts
    └── <feature>-filter-params-type.ts
```

Không bắt buộc tạo file rỗng cho mọi thư mục. Chỉ thêm `store`, `styles` hoặc các
type phụ khi tính năng có nhu cầu thật.

## 5. Trình tự triển khai một tính năng

### Bước 1: Xác nhận contract

Trước khi code, xác định:

- Endpoint và HTTP method.
- Request params, request body.
- Response data và pagination.
- Trạng thái loading, empty và error.
- Quyền được xem/thực hiện action.
- Điều kiện create, view, edit, delete, active/inactive.

Không đoán field hoặc response nếu contract chưa rõ.

### Bước 2: Khai báo type

Tạo riêng các type cần thiết:

- Entity/model trả về từ server.
- Create/update payload nếu khác entity.
- Filter params kế thừa `FilterParams` khi dùng pagination/filter chuẩn.
- Union type cho status/role nếu API chỉ cho phép một tập giá trị.

Ví dụ tổng quát:

```ts
export interface Entity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityPayload {
  name: string;
}

export interface EntityFilterParams extends FilterParams {
  status?: EntityStatus;
}
```

Không dùng entity đầy đủ làm form payload khi server chỉ nhận một phần field.

### Bước 3: Tạo API layer

Mọi request của feature nằm trong `api/<feature>-api.ts`:

```ts
import { axiosClient } from "@/shared/lib/axios";
import type { EntityFilterParams, EntityPayload } from "../types/...";

const API_URL_PREFIX = "/entities";

export const entityRoleAdminApi = {
  getAll: async (params: EntityFilterParams) => {
    const response = await axiosClient.get(API_URL_PREFIX, { params });
    return response.data;
  },

  create: async (payload: EntityPayload) => {
    const response = await axiosClient.post(API_URL_PREFIX, payload);
    return response.data;
  },

  update: async (id: string, payload: EntityPayload) => {
    const response = await axiosClient.patch(
      `${API_URL_PREFIX}/${id}`,
      payload,
    );
    return response.data;
  },

  remove: async (id: string) => {
    const response = await axiosClient.delete(`${API_URL_PREFIX}/${id}`);
    return response.data;
  },
};
```

### Mẫu đầy đủ cho file `<feature>-api.ts`

Agent có thể sao chép mẫu dưới đây và thay các placeholder:

- `entity` bằng tên feature dạng số ít.
- `entities` bằng endpoint hoặc tên dạng số nhiều.
- `Entity`, `EntityPayload`, `EntityFilterParams` bằng type thực tế.
- Chỉ giữ các method mà API contract thực sự hỗ trợ.

```ts
import { axiosClient } from "@/shared/lib/axios";

import type { EntityFilterParams } from "../types/entity-filter-params-type";
import type {
  CreateEntityPayload,
  UpdateEntityPayload,
} from "../types/entity-type";

const API_URL_PREFIX = "/entities";

/**
 * API dùng chung cho select/options.
 * Xóa hàm này nếu feature không có endpoint options.
 */
export const getEntityOptions = async () => {
  const response = await axiosClient.get(`${API_URL_PREFIX}/options`);

  return response.data;
};

/**
 * API dành cho role admin.
 * Nếu endpoint không phân quyền theo role, có thể đổi thành `entityApi`.
 */
export const entityRoleAdminApi = {
  getAll: async (params: EntityFilterParams) => {
    const response = await axiosClient.get(API_URL_PREFIX, {
      params,
    });

    return response.data;
  },

  getDetail: async (id: string) => {
    const response = await axiosClient.get(`${API_URL_PREFIX}/${id}`);

    return response.data;
  },

  create: async (payload: CreateEntityPayload) => {
    const response = await axiosClient.post(API_URL_PREFIX, payload);

    return response.data;
  },

  update: async (id: string, payload: UpdateEntityPayload) => {
    const response = await axiosClient.patch(
      `${API_URL_PREFIX}/${id}`,
      payload,
    );

    return response.data;
  },

  active: async (id: string) => {
    const response = await axiosClient.patch(`${API_URL_PREFIX}/${id}/active`);

    return response.data;
  },

  inactive: async (id: string) => {
    const response = await axiosClient.patch(
      `${API_URL_PREFIX}/${id}/inactive`,
    );

    return response.data;
  },

  remove: async (id: string) => {
    const response = await axiosClient.delete(`${API_URL_PREFIX}/${id}`);

    return response.data;
  },
};

/**
 * Ví dụ API cho user hiện tại.
 * Chỉ tạo khi backend có endpoint `/me`.
 */
export const entityCurrentUserApi = {
  get: async () => {
    const response = await axiosClient.get(`${API_URL_PREFIX}/me`);

    return response.data;
  },

  update: async (payload: UpdateEntityPayload) => {
    const response = await axiosClient.patch(`${API_URL_PREFIX}/me`, payload);

    return response.data;
  },
};
```

#### Mẫu type đi kèm

```ts
import type { FilterParams } from "@/shared/types/filter-params-type";

export interface Entity {
  id: string;
  name: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export type EntityStatus = "active" | "inactive";

export interface CreateEntityPayload {
  name: string;
}

export interface UpdateEntityPayload {
  name?: string;
  status?: EntityStatus;
}

export interface EntityFilterParams extends FilterParams {
  status?: EntityStatus;
}
```

Không giữ tất cả method chỉ để “đủ mẫu”. Ví dụ backend không có `getDetail`,
`active`, `inactive`, `/options` hoặc `/me` thì phải xóa method tương ứng.

Quy tắc:

- Dùng một `API_URL_PREFIX`.
- Dùng `axiosClient`, không lặp cấu hình base URL/auth.
- API layer không hiển thị notification, không điều hướng và không giữ React state.
- Đặt tên nhóm API theo phạm vi quyền khi endpoint/hành vi khác nhau theo role.
- Dùng payload type cụ thể, không để `payload: any`.
- Chuẩn hóa việc trả `response.data`; page/hook không phụ thuộc vào toàn bộ
  `AxiosResponse`.

### Bước 4: Khai báo form, filter và mapping

Đưa cấu hình form/filter/options/status mapping vào `constants` khi chúng đủ lớn hoặc
được tái sử dụng trong feature.

- Form dùng `FormField<T>[]` và `FormFieldType`.
- Filter dùng cấu trúc mà `FilterTableCustom` hỗ trợ.
- Option tĩnh và mapping status nằm trong constants.
- Option lấy từ server dùng hàm `fetchOptions` của feature API.
- Validation hiển thị gần field.

Không đặt request side effect trong file constants.

### Bước 5: Ghép page

Page CRUD chuẩn ưu tiên dùng:

- `PageHeader` cho tiêu đề/action chính.
- `useTable` cho fetch list, filter, pagination và action trạng thái phổ biến.
- `FilterTableCustom` cho filter.
- `TablePaginationCustom` cho bảng có phân trang.
- `ActionGroup` cho action theo record.
- `useFormModal` cho trạng thái create/view/edit.
- `ModalFormCustom` và `DynamicForm` cho form cấu hình.
- `useNotification` cho phản hồi người dùng ngoài các abstraction đã tự xử lý.

Page chịu trách nhiệm:

- Chọn API phù hợp.
- Khai báo column và action theo nghiệp vụ.
- Ghép hook/component.
- Điều phối mở/đóng modal, refetch và navigation.

Page không nên:

- Tự cấu hình Axios.
- Lặp logic pagination/filter đã có trong `useTable`.
- Chứa model type hoặc danh sách option dài.
- Ghi token hoặc session.
- Trộn nhiều feature không liên quan vào một file.

### Bước 6: Thêm route và navigation

- Page cấp route được khai báo trong `app/router/routes.tsx`.
- Route private nằm dưới `ProtectedRoute` mặc định.
- Route login/register nằm dưới `ProtectedRoute requireAuth={false}`.
- Layout được quyết định ở route tree, không lặp layout trong page.
- Nếu cần menu/sidebar, cập nhật cấu hình navigation tương ứng và kiểm tra quyền hiển
  thị.
- Không dùng `window.location` cho điều hướng nội bộ thông thường; dùng React Router.

### Bước 7: Kiểm tra

Tối thiểu chạy:

```bash
npm.cmd run lint
npm.cmd run build
```

Kiểm tra thủ công:

- Loading, empty, success và error.
- Filter submit/reset và đổi page size.
- Create/view/edit/delete.
- Permission và action visibility.
- Refresh trang ở route private.
- Session hết hạn và nhiều request đồng thời bị `401`.
- Không tạo warning React, request lặp hoặc vòng lặp render.

## 6. State management

Dùng state cục bộ khi dữ liệu:

- Chỉ phục vụ một page/component.
- Có thể fetch lại từ API.
- Không cần đồng bộ giữa các route xa nhau.

Dùng Redux khi state:

- Cần ở nhiều khu vực cấp ứng dụng.
- Sống qua nhiều route.
- Đại diện session, identity hoặc trạng thái toàn cục có vòng đời rõ ràng.

Redux async flow:

```text
page/component -> dispatch thunk -> feature API -> reducer cập nhật state
```

Side effect như notification, navigation, cookie và Web Storage không đặt trong
reducer. Theme preference có thể dùng `localStorage`; thông tin xác thực thì không.

## 7. Quy ước code

- Component, type, interface: `PascalCase`.
- Biến, hàm, hook: `camelCase`.
- Hằng số thực sự bất biến: `CONSTANT_CASE`.
- Hook bắt đầu bằng `use`.
- Component file dùng `PascalCase.tsx`.
- Các file API/type/constant hiện theo `kebab-case`.
- Dùng `import type` cho import chỉ dùng ở type level.
- Ưu tiên alias `@/` cho import khác vùng; relative import cho file gần trong cùng
  feature.
- Format theo Prettier: 2 spaces, single quote, semicolon, trailing comma, line width 100.
- Không sửa code ngoài phạm vi yêu cầu chỉ để “dọn đẹp”.

## 8. Chuẩn response mà các abstraction hiện tại mong đợi

List có pagination:

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

Mutation thường trả:

```json
{
  "message": "Operation completed",
  "data": {}
}
```

Nếu backend trả shape khác, chuẩn hóa trong API layer hoặc tạo adapter có type rõ
ràng. Không rải logic đọc nhiều response shape khác nhau trong các page.

## 9. Quy tắc authentication mục tiêu: HttpOnly cookie

### 9.1. Bất biến bảo mật

- Không lưu access token hoặc refresh token trong `localStorage`,
  `sessionStorage`, IndexedDB, Redux persist hoặc JavaScript-readable cookie.
- Frontend không được đọc token.
- Chỉ backend có thể tạo cookie `HttpOnly` bằng header `Set-Cookie`.
- Frontend giữ `user`, `initialized`, `loading`, `error`; không giữ token.
- Cookie auth cần xử lý cả XSS lẫn CSRF. `HttpOnly` giảm rủi ro token bị đọc bởi XSS
  nhưng không tự giải quyết CSRF.

`localStorage` vẫn được phép cho dữ liệu không nhạy cảm như lựa chọn theme.

### 9.2. Hợp đồng backend bắt buộc

Sau login thành công, backend đặt cookie thay vì trả token cho JavaScript:

```http
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=...
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh-token; Max-Age=...
```

Backend cần cung cấp:

- `POST /auth/login`: xác thực, đặt cookie, trả user hoặc dữ liệu không chứa token.
- `POST /auth/refresh-token`: đọc refresh cookie, rotate token, đặt cookie mới.
- `GET /.../me` hoặc `GET /auth/session`: đọc access cookie và trả current user.
- `POST /auth/logout`: revoke refresh session nếu có và xóa cả hai cookie.

Khi xóa cookie, backend phải dùng cùng `Path`, `Domain`, `SameSite` và các thuộc tính
liên quan đã dùng lúc tạo.

Khuyến nghị:

- Access token sống ngắn.
- Refresh token rotation và phát hiện reuse.
- Refresh token/session được revoke ở server khi logout.
- Không đặt `Domain` nếu không cần chia sẻ cookie giữa subdomain.
- Production luôn dùng HTTPS và `Secure`.
- Nếu frontend và API thực sự cross-site, dùng `SameSite=None; Secure`, CORS với
  origin cụ thể và cơ chế CSRF token. Không dùng `Access-Control-Allow-Origin: *`
  cùng credentials.

### 9.3. Axios phía frontend

Axios client gửi cookie tự động:

```ts
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Thay đổi so với token trong Web Storage:

- Xóa request interceptor đọc `accessToken`.
- Không tự gắn `Authorization: Bearer ...`.
- Refresh request không gửi refresh token trong body.
- Refresh request cần `withCredentials: true`.
- Queue chỉ chờ refresh hoàn tất rồi retry request cũ; queue không truyền token.

Nên có client riêng cho refresh để không đi lại qua response interceptor của
`axiosClient`:

```ts
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

Pseudo-flow:

```text
request private -> 401
  -> nếu request đã retry: reject
  -> nếu đang refresh: đưa request vào queue
  -> nếu chưa refresh:
       POST /auth/refresh-token bằng refreshClient
       thành công -> giải phóng queue -> retry các request
       thất bại   -> reject queue -> clear auth state -> về login
```

Interceptor phải:

- Chỉ refresh khi `401`, không refresh khi `403`.
- Có `_retry` để tránh vòng lặp.
- Không refresh chính request login/register/refresh/logout.
- Chỉ có một refresh request tại một thời điểm.
- Không phụ thuộc vào token value ở JavaScript.
- Phát tín hiệu session-expired cho auth layer thay vì âm thầm sửa Redux từ module
  hạ tầng.

### 9.4. Khởi tạo ứng dụng

`AppInit` không kiểm tra token trong `localStorage`. Khi app mở:

```text
dispatch getMe/session
  -> thành công: lưu user, initialized = true
  -> access hết hạn: interceptor refresh rồi retry
  -> refresh thất bại: user = null, initialized = true
```

Route guard chỉ dựa vào `user` và `initialized`.

### 9.5. Login và logout

Login:

```text
submit credentials
-> backend set cookie
-> response trả user hoặc frontend gọi getMe
-> Redux lưu user
-> navigate vào app
```

Logout:

```text
POST /auth/logout
-> backend revoke session và clear cookie
-> Redux xóa user
-> navigate tới login
```

Không coi việc chỉ `state.user = null` là logout hoàn chỉnh vì cookie HttpOnly vẫn
tồn tại và JavaScript không thể tự xóa.

### 9.6. CSRF

Nếu dùng cookie để xác thực request thay đổi dữ liệu (`POST`, `PUT`, `PATCH`,
`DELETE`), áp dụng ít nhất:

- `SameSite=Lax` hoặc `Strict` khi kiến trúc cho phép.
- Kiểm tra `Origin`/`Referer` ở backend.
- CSRF token cho kiến trúc cross-site hoặc yêu cầu bảo mật cao. CSRF token có thể
  được frontend đọc và gửi qua custom header; token xác thực vẫn giữ `HttpOnly`.

## 10. Kế hoạch chuyển auth hiện tại

Các vị trí hiện đang phụ thuộc token trong `localStorage` và cần được thay đổi đồng
bộ khi backend hỗ trợ cookie:

1. `src/shared/lib/axios.ts`
   - Bỏ đọc/ghi/xóa token.
   - Bật `withCredentials`.
   - Refresh bằng cookie và queue không truyền token.
2. `src/app/init/AppInit.tsx`
   - Luôn kiểm tra session/get-me thay vì kiểm tra access token.
3. `src/features/auth/store/auth-slice.ts`
   - Bỏ toàn bộ side effect Web Storage.
   - Reducer chỉ cập nhật auth state.
4. `src/features/auth/api/auth-api.ts`
   - Thêm logout API; login/refresh dựa trên cookie contract.
5. Auth thunk/UI
   - Login lấy user mà không nhận token.
   - Logout gọi backend trước khi clear state.
6. Backend/CORS
   - Thêm `Set-Cookie`, clear cookie, credentials CORS và CSRF protection.
7. Tài liệu cũ
   - Cập nhật các mô tả JWT còn hướng dẫn lưu token trong `localStorage`.

Không triển khai migration chỉ ở frontend. Nếu backend chưa đặt và đọc HttpOnly
cookie thì xóa cơ chế token hiện tại sẽ làm toàn bộ private API mất xác thực.

## 11. Checklist cho Agent trước khi hoàn thành

- [ ] Đã đọc feature gần nhất có cùng loại luồng để giữ convention.
- [ ] Code nằm đúng `app`, `features` hoặc `shared`.
- [ ] API call nằm trong feature API layer và dùng `axiosClient`.
- [ ] Request/response/payload/filter có type rõ ràng, không thêm `any` tùy tiện.
- [ ] Đã tái sử dụng hook/component chung phù hợp.
- [ ] Page chỉ phối hợp UI và data flow, không chứa hạ tầng.
- [ ] Route, layout, guard và navigation đã được cập nhật nếu cần.
- [ ] Loading, empty, error và permission đã được xử lý.
- [ ] Không ghi token vào Web Storage hoặc Redux persist.
- [ ] Cookie auth không dựa vào việc JavaScript đọc token.
- [ ] Mutation dùng cookie đã có biện pháp CSRF phù hợp.
- [ ] Không làm hỏng refresh queue hoặc tạo vòng lặp `401`.
- [ ] Không sửa file ngoài phạm vi yêu cầu.
- [ ] `npm.cmd run lint` đạt.
- [ ] `npm.cmd run build` đạt.
