# HÆ°á»›ng dáº«n triá»ƒn khai frontend cho Agent

## 1. Má»¥c Ä‘Ă­ch

TĂ i liá»‡u nĂ y mĂ´ táº£ cĂ¡ch triá»ƒn khai **chung** cho frontend YoEdu. Agent pháº£i dĂ¹ng tĂ i
liá»‡u nhÆ° má»™t bá»™ quy táº¯c kiáº¿n trĂºc khi thĂªm hoáº·c sá»­a tĂ­nh nÄƒng.

Má»¥c tiĂªu:

- Giá»¯ code nháº¥t quĂ¡n vá»›i cáº¥u trĂºc hiá»‡n táº¡i.
- Äáº·t business code Ä‘Ăºng feature, chá»‰ Ä‘Æ°a pháº§n thá»±c sá»± dĂ¹ng chung vĂ o `shared`.
- TĂ¡i sá»­ dá»¥ng cĂ¡c component vĂ  hook sáºµn cĂ³ trÆ°á»›c khi táº¡o abstraction má»›i.
- Giá»¯ page táº­p trung vĂ o viá»‡c phá»‘i há»£p dá»¯ liá»‡u vĂ  UI, khĂ´ng chá»©a háº¡ táº§ng dĂ¹ng chung.
- KhĂ´ng lÆ°u access token hoáº·c refresh token trong Web Storage.

TĂ i liá»‡u chá»‰ quy Ä‘á»‹nh pattern chung. TĂªn endpoint, trÆ°á»ng dá»¯ liá»‡u, quyá»n vĂ  giao diá»‡n
cá»¥ thá»ƒ pháº£i láº¥y tá»« yĂªu cáº§u cá»§a tá»«ng tĂ­nh nÄƒng vĂ  API contract thá»±c táº¿.

## 2. Stack vĂ  nguyĂªn táº¯c ná»n

- React + TypeScript + Vite.
- React Router quáº£n lĂ½ route.
- Redux Toolkit quáº£n lĂ½ state toĂ n cá»¥c thá»±c sá»± cáº§n chia sáº»; hiá»‡n táº¡i auth lĂ  state
  toĂ n cá»¥c chĂ­nh.
- Axios lĂ  HTTP client chung.
- Ant Design lĂ  thÆ° viá»‡n UI chĂ­nh.
- Tailwind CSS dĂ¹ng cho layout vĂ  style bá»• sung.
- Alias `@/` trá» tá»›i `src/`.
- ESLint vĂ  TypeScript lĂ  hĂ ng rĂ o cháº¥t lÆ°á»£ng báº¯t buá»™c.

NguyĂªn táº¯c:

1. Æ¯u tiĂªn type an toĂ n, khĂ´ng thĂªm `any` náº¿u cĂ³ thá»ƒ mĂ´ táº£ kiá»ƒu dá»¯ liá»‡u.
2. Æ¯u tiĂªn code cá»¥c bá»™ trong feature; chá»‰ Ä‘Æ°a lĂªn `shared` khi Ă­t nháº¥t nhiá»u feature
   cĂ³ cĂ¹ng nhu cáº§u vĂ  abstraction khĂ´ng chá»©a nghiá»‡p vá»¥ riĂªng.
3. KhĂ´ng gá»i Axios trá»±c tiáº¿p trong page/component. API call pháº£i náº±m trong thÆ° má»¥c
   `api` cá»§a feature vĂ  dĂ¹ng `axiosClient`.
4. KhĂ´ng sao chĂ©p component chung Ä‘á»ƒ sá»­a riĂªng. Má»Ÿ rá»™ng component chung náº¿u thay Ä‘á»•i
   váº«n cĂ³ Ă½ nghÄ©a tá»•ng quĂ¡t; náº¿u khĂ´ng, táº¡o component trong feature.
5. KhĂ´ng Ä‘Æ°a server data cá»§a má»i mĂ n hĂ¬nh vĂ o Redux. DĂ¹ng state/hook cá»¥c bá»™ khi dá»¯
   liá»‡u chá»‰ phá»¥c vá»¥ má»™t page hoáº·c má»™t luá»“ng ngáº¯n.
6. Reducer pháº£i thuáº§n: khĂ´ng gá»i API, redirect, ghi cookie hoáº·c ghi Web Storage trong
   reducer.

## 3. Ranh giá»›i thÆ° má»¥c

```text
src/
â”œâ”€â”€ app/                       # Háº¡ táº§ng cáº¥p á»©ng dá»¥ng
â”‚   â”œâ”€â”€ init/                  # Khá»Ÿi táº¡o session/app
â”‚   â”œâ”€â”€ layouts/               # Khung giao diá»‡n cáº¥p route
â”‚   â”œâ”€â”€ providers/             # Provider toĂ n á»©ng dá»¥ng
â”‚   â”œâ”€â”€ redux/                 # Store vĂ  typed Redux hooks
â”‚   â””â”€â”€ router/                # Route tree vĂ  route guard
â”œâ”€â”€ features/
â”‚   â””â”€â”€ <feature-name>/        # Má»™t miá»n nghiá»‡p vá»¥
â”‚       â”œâ”€â”€ api/               # HĂ m giao tiáº¿p API
â”‚       â”œâ”€â”€ components/        # UI chá»‰ dĂ¹ng trong feature
â”‚       â”œâ”€â”€ constants/         # Form, filter, option, mapping cá»§a feature
â”‚       â”œâ”€â”€ pages/             # Component cáº¥p route
â”‚       â”œâ”€â”€ store/             # Chá»‰ táº¡o khi feature cáº§n state toĂ n cá»¥c
â”‚       â”œâ”€â”€ styles/            # Style riĂªng khi thá»±c sá»± cáº§n
â”‚       â””â”€â”€ types/             # Model, payload, params cá»§a feature
â”œâ”€â”€ shared/
â”‚   â”œâ”€â”€ components/            # UI tá»•ng quĂ¡t, khĂ´ng biáº¿t nghiá»‡p vá»¥
â”‚   â”œâ”€â”€ constants/             # Háº±ng sá»‘ dĂ¹ng xuyĂªn feature
â”‚   â”œâ”€â”€ hooks/                 # HĂ nh vi UI/data tá»•ng quĂ¡t
â”‚   â”œâ”€â”€ lib/                   # Cáº¥u hĂ¬nh thÆ° viá»‡n/háº¡ táº§ng, vĂ­ dá»¥ Axios
â”‚   â”œâ”€â”€ theme/                 # Design token
â”‚   â”œâ”€â”€ types/                 # Type tá»•ng quĂ¡t
â”‚   â””â”€â”€ utils/                 # HĂ m thuáº§n dĂ¹ng chung
â”œâ”€â”€ assets/                    # TĂ i nguyĂªn tÄ©nh Ä‘Æ°á»£c import
â””â”€â”€ styles/                    # Global style
```

### Quy táº¯c chá»n nÆ¡i Ä‘áº·t code

| CĂ¢u há»i                                                 | NÆ¡i Ä‘áº·t                                                 |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ÄĂ¢y lĂ  route, provider, store hoáº·c layout cáº¥p á»©ng dá»¥ng? | `app/`                                                  |
| Code cĂ³ chá»©a khĂ¡i niá»‡m nghiá»‡p vá»¥ cá»§a má»™t module?        | `features/<feature>/`                                   |
| Code khĂ´ng biáº¿t nghiá»‡p vá»¥ vĂ  Ä‘Æ°á»£c dĂ¹ng á»Ÿ nhiá»u feature? | `shared/`                                               |
| Chá»‰ má»™t page dĂ¹ng Ä‘oáº¡n UI nĂ y?                          | Component trong feature hoáº·c giá»¯ trong page náº¿u ráº¥t nhá» |
| ÄĂ¢y lĂ  model/payload/filter riĂªng cá»§a feature?          | `features/<feature>/types/`                             |
| ÄĂ¢y lĂ  helper thuáº§n, tá»•ng quĂ¡t?                         | `shared/utils/`                                         |

KhĂ´ng import ngÆ°á»£c tá»« `shared` vĂ o `features`. `shared` pháº£i Ä‘á»™c láº­p vá»›i business
feature. Náº¿u component chung cáº§n role hoáº·c model riĂªng cá»§a má»™t feature, cáº§n xem láº¡i
ranh giá»›i abstraction vĂ  chuyá»ƒn type tá»•ng quĂ¡t phĂ¹ há»£p sang `shared`.

## 4. Cáº¥u trĂºc chuáº©n cá»§a má»™t feature

Táº¡o skeleton báº±ng:

```bash
npm.cmd run g <feature-name>
```

Cáº¥u trĂºc máº·c Ä‘á»‹nh:

```text
features/<feature-name>/
â”œâ”€â”€ api/
â”‚   â””â”€â”€ <feature>-api.ts
â”œâ”€â”€ components/
â”œâ”€â”€ constants/
â”‚   â”œâ”€â”€ <feature>-form-fields.ts
â”‚   â””â”€â”€ <feature>-filter-table.ts
â”œâ”€â”€ pages/
â”‚   â””â”€â”€ <Feature>Page.tsx
â””â”€â”€ types/
    â”œâ”€â”€ <feature>-type.ts
    â””â”€â”€ <feature>-filter-params-type.ts
```

KhĂ´ng báº¯t buá»™c táº¡o file rá»—ng cho má»i thÆ° má»¥c. Chá»‰ thĂªm `store`, `styles` hoáº·c cĂ¡c
type phá»¥ khi tĂ­nh nÄƒng cĂ³ nhu cáº§u tháº­t.

## 5. TrĂ¬nh tá»± triá»ƒn khai má»™t tĂ­nh nÄƒng

### BÆ°á»›c 1: XĂ¡c nháº­n contract

TrÆ°á»›c khi code, xĂ¡c Ä‘á»‹nh:

- Endpoint vĂ  HTTP method.
- Request params, request body.
- Response data vĂ  pagination.
- Tráº¡ng thĂ¡i loading, empty vĂ  error.
- Quyá»n Ä‘Æ°á»£c xem/thá»±c hiá»‡n action.
- Äiá»u kiá»‡n create, view, edit, delete, active/inactive.

KhĂ´ng Ä‘oĂ¡n field hoáº·c response náº¿u contract chÆ°a rĂµ.

### BÆ°á»›c 2: Khai bĂ¡o type

Táº¡o riĂªng cĂ¡c type cáº§n thiáº¿t:

- Entity/model tráº£ vá» tá»« server.
- Create/update payload náº¿u khĂ¡c entity.
- Filter params káº¿ thá»«a `FilterParams` khi dĂ¹ng pagination/filter chuáº©n.
- Union type cho status/role náº¿u API chá»‰ cho phĂ©p má»™t táº­p giĂ¡ trá»‹.

VĂ­ dá»¥ tá»•ng quĂ¡t:

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

KhĂ´ng dĂ¹ng entity Ä‘áº§y Ä‘á»§ lĂ m form payload khi server chá»‰ nháº­n má»™t pháº§n field.

### BÆ°á»›c 3: Táº¡o API layer

Má»i request cá»§a feature náº±m trong `api/<feature>-api.ts`:

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

### Máº«u Ä‘áº§y Ä‘á»§ cho file `<feature>-api.ts`

Agent cĂ³ thá»ƒ sao chĂ©p máº«u dÆ°á»›i Ä‘Ă¢y vĂ  thay cĂ¡c placeholder:

- `entity` báº±ng tĂªn feature dáº¡ng sá»‘ Ă­t.
- `entities` báº±ng endpoint hoáº·c tĂªn dáº¡ng sá»‘ nhiá»u.
- `Entity`, `EntityPayload`, `EntityFilterParams` báº±ng type thá»±c táº¿.
- Chá»‰ giá»¯ cĂ¡c method mĂ  API contract thá»±c sá»± há»— trá»£.

```ts
import { axiosClient } from "@/shared/lib/axios";

import type { EntityFilterParams } from "../types/entity-filter-params-type";
import type {
  CreateEntityPayload,
  UpdateEntityPayload,
} from "../types/entity-type";

const API_URL_PREFIX = "/entities";

/**
 * API dĂ¹ng chung cho select/options.
 * XĂ³a hĂ m nĂ y náº¿u feature khĂ´ng cĂ³ endpoint options.
 */
export const getEntityOptions = async () => {
  const response = await axiosClient.get(`${API_URL_PREFIX}/options`);

  return response.data;
};

/**
 * API dĂ nh cho role admin.
 * Náº¿u endpoint khĂ´ng phĂ¢n quyá»n theo role, cĂ³ thá»ƒ Ä‘á»•i thĂ nh `entityApi`.
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
 * VĂ­ dá»¥ API cho user hiá»‡n táº¡i.
 * Chá»‰ táº¡o khi backend cĂ³ endpoint `/me`.
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

#### Máº«u type Ä‘i kĂ¨m

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

KhĂ´ng giá»¯ táº¥t cáº£ method chá»‰ Ä‘á»ƒ â€œÄ‘á»§ máº«uâ€. VĂ­ dá»¥ backend khĂ´ng cĂ³ `getDetail`,
`active`, `inactive`, `/options` hoáº·c `/me` thĂ¬ pháº£i xĂ³a method tÆ°Æ¡ng á»©ng.

Quy táº¯c:

- DĂ¹ng má»™t `API_URL_PREFIX`.
- DĂ¹ng `axiosClient`, khĂ´ng láº·p cáº¥u hĂ¬nh base URL/auth.
- API layer khĂ´ng hiá»ƒn thá»‹ notification, khĂ´ng Ä‘iá»u hÆ°á»›ng vĂ  khĂ´ng giá»¯ React state.
- Äáº·t tĂªn nhĂ³m API theo pháº¡m vi quyá»n khi endpoint/hĂ nh vi khĂ¡c nhau theo role.
- DĂ¹ng payload type cá»¥ thá»ƒ, khĂ´ng Ä‘á»ƒ `payload: any`.
- Chuáº©n hĂ³a viá»‡c tráº£ `response.data`; page/hook khĂ´ng phá»¥ thuá»™c vĂ o toĂ n bá»™
  `AxiosResponse`.

### BÆ°á»›c 4: Khai bĂ¡o form, filter vĂ  mapping

ÄÆ°a cáº¥u hĂ¬nh form/filter/options/status mapping vĂ o `constants` khi chĂºng Ä‘á»§ lá»›n hoáº·c
Ä‘Æ°á»£c tĂ¡i sá»­ dá»¥ng trong feature.

- Form dĂ¹ng `FormField<T>[]` vĂ  `FormFieldType`.
- Filter dĂ¹ng cáº¥u trĂºc mĂ  `FilterTableCustom` há»— trá»£.
- Option tÄ©nh vĂ  mapping status náº±m trong constants.
- Option láº¥y tá»« server dĂ¹ng hĂ m `fetchOptions` cá»§a feature API.
- Validation hiá»ƒn thá»‹ gáº§n field.

KhĂ´ng Ä‘áº·t request side effect trong file constants.

### BÆ°á»›c 5: GhĂ©p page

Page CRUD chuáº©n Æ°u tiĂªn dĂ¹ng:

- `PageHeader` cho tiĂªu Ä‘á»/action chĂ­nh.
- `useTable` cho fetch list, filter, pagination vĂ  action tráº¡ng thĂ¡i phá»• biáº¿n.
- `FilterTableCustom` cho filter.
- `TablePaginationCustom` cho báº£ng cĂ³ phĂ¢n trang.
- `ActionGroup` cho action theo record.
- `useFormModal` cho tráº¡ng thĂ¡i create/view/edit.
- `ModalFormCustom` vĂ  `DynamicForm` cho form cáº¥u hĂ¬nh.
- `useNotification` cho pháº£n há»“i ngÆ°á»i dĂ¹ng ngoĂ i cĂ¡c abstraction Ä‘Ă£ tá»± xá»­ lĂ½.

Page chá»‹u trĂ¡ch nhiá»‡m:

- Chá»n API phĂ¹ há»£p.
- Khai bĂ¡o column vĂ  action theo nghiá»‡p vá»¥.
- GhĂ©p hook/component.
- Äiá»u phá»‘i má»Ÿ/Ä‘Ă³ng modal, refetch vĂ  navigation.

Page khĂ´ng nĂªn:

- Tá»± cáº¥u hĂ¬nh Axios.
- Láº·p logic pagination/filter Ä‘Ă£ cĂ³ trong `useTable`.
- Chá»©a model type hoáº·c danh sĂ¡ch option dĂ i.
- Ghi token hoáº·c session.
- Trá»™n nhiá»u feature khĂ´ng liĂªn quan vĂ o má»™t file.

### BÆ°á»›c 6: ThĂªm route vĂ  navigation

- Page cáº¥p route Ä‘Æ°á»£c khai bĂ¡o trong `app/router/routes.tsx`.
- Route private náº±m dÆ°á»›i `ProtectedRoute` máº·c Ä‘á»‹nh.
- Route login/register náº±m dÆ°á»›i `ProtectedRoute requireAuth={false}`.
- Layout Ä‘Æ°á»£c quyáº¿t Ä‘á»‹nh á»Ÿ route tree, khĂ´ng láº·p layout trong page.
- Náº¿u cáº§n menu/sidebar, cáº­p nháº­t cáº¥u hĂ¬nh navigation tÆ°Æ¡ng á»©ng vĂ  kiá»ƒm tra quyá»n hiá»ƒn
  thá»‹.
- KhĂ´ng dĂ¹ng `window.location` cho Ä‘iá»u hÆ°á»›ng ná»™i bá»™ thĂ´ng thÆ°á»ng; dĂ¹ng React Router.

### BÆ°á»›c 7: Kiá»ƒm tra

Tá»‘i thiá»ƒu cháº¡y:

```bash
npm.cmd run lint
npm.cmd run build
```

Kiá»ƒm tra thá»§ cĂ´ng:

- Loading, empty, success vĂ  error.
- Filter submit/reset vĂ  Ä‘á»•i page size.
- Create/view/edit/delete.
- Permission vĂ  action visibility.
- Refresh trang á»Ÿ route private.
- Session háº¿t háº¡n vĂ  nhiá»u request Ä‘á»“ng thá»i bá»‹ `401`.
- KhĂ´ng táº¡o warning React, request láº·p hoáº·c vĂ²ng láº·p render.

## 6. PhĂ¢n tĂ­ch sĂ¢u vá» tá»• chá»©c code vĂ  tĂ¡i sá»­ dá»¥ng component

### 6.1. TÆ° duy tá»• chá»©c code cá»§a project

Project nĂ y Ä‘ang Ä‘i theo kiá»ƒu tá»• chá»©c theo **feature-first architecture**: business code Ä‘Æ°á»£c gom theo miá»n nghiá»‡p vá»¥ trong `features`, cĂ²n `shared` chá»‰ giá»¯ cĂ¡c khá»‘i háº¡ táº§ng hoáº·c UI tháº­t sá»± dĂ¹ng chung.

CĂ¡ch nghÄ© Ä‘Ăºng khi agent triá»ƒn khai má»™t mĂ n hĂ¬nh má»›i:

```text
Route/Page cáº§n lĂ m gĂ¬?
  -> feature nĂ o sá»Ÿ há»¯u nghiá»‡p vá»¥ nĂ y?
    -> API contract vĂ  type cá»§a feature lĂ  gĂ¬?
      -> cĂ³ form/filter/table/modal/action giá»‘ng pattern hiá»‡n cĂ³ khĂ´ng?
        -> dĂ¹ng shared hook/component trÆ°á»›c
          -> chá»‰ táº¡o component riĂªng khi UI hoáº·c business rule vÆ°á»£t khá»i pattern chung
```

Äiá»ƒm quan trá»ng lĂ  khĂ´ng chia code theo â€œloáº¡i file ká»¹ thuáº­tâ€ á»Ÿ cáº¥p toĂ n app, vĂ­ dá»¥ khĂ´ng gom táº¥t cáº£ API vĂ o má»™t thÆ° má»¥c `apis` chung hoáº·c táº¥t cáº£ form vĂ o má»™t thÆ° má»¥c `forms` chung. API, form fields, filter fields, type vĂ  page cá»§a `rooms` nĂªn á»Ÿ cáº¡nh nhau trong `features/rooms` Ä‘á»ƒ agent nhĂ¬n má»™t feature lĂ  hiá»ƒu toĂ n bá»™ luá»“ng.

### 6.2. Ranh giá»›i `app`, `features`, `shared`

`app` lĂ  táº§ng khá»Ÿi Ä‘á»™ng vĂ  Ä‘iá»u phá»‘i á»©ng dá»¥ng. Chá»‰ Ä‘Æ°a code vĂ o `app` khi code Ä‘Ă³ áº£nh hÆ°á»Ÿng toĂ n app: route tree, layout, provider, Redux store, route guard, app init/session.

`features/<feature>` lĂ  nÆ¡i Ä‘áº·t nghiá»‡p vá»¥. Má»™t feature Ä‘Æ°á»£c phĂ©p biáº¿t model, endpoint, status, quyá»n, form field vĂ  table column cá»§a chĂ­nh nĂ³. Feature khĂ´ng nĂªn import ngang sang feature khĂ¡c trá»« trÆ°á»ng há»£p cĂ³ quan há»‡ nghiá»‡p vá»¥ rĂµ rĂ ng vĂ  type/API Ä‘Ă³ tháº­t sá»± Ä‘Æ°á»£c public hĂ³a. Náº¿u nhiá»u feature cĂ¹ng cáº§n má»™t khĂ¡i niá»‡m, cĂ¢n nháº¯c tĂ¡ch type/helper trung láº­p sang `shared` thay vĂ¬ import chĂ©o tĂ¹y tiá»‡n.

`shared` lĂ  táº§ng khĂ´ng biáº¿t nghiá»‡p vá»¥. Component/hook trong `shared` cĂ³ thá»ƒ biáº¿t khĂ¡i niá»‡m UI nhÆ° table, modal, form, select, pagination, notification; nhÆ°ng khĂ´ng nĂªn biáº¿t khĂ¡i niá»‡m nhÆ° há»c viĂªn, giĂ¡o viĂªn, phĂ²ng há»c, lá»›p há»c, há»c phĂ­. Náº¿u má»™t component trong `shared` báº¯t Ä‘áº§u cáº§n prop kiá»ƒu `studentStatus`, `teacherRole`, `courseClassId`, Ä‘Ă³ lĂ  dáº¥u hiá»‡u abstraction Ä‘ang bá»‹ kĂ©o sai táº§ng.

Quy táº¯c ngáº¯n:

| Loáº¡i logic | NĂªn Ä‘áº·t á»Ÿ Ä‘Ă¢u | VĂ­ dá»¥ |
| --- | --- | --- |
| Äiá»u phá»‘i app | `app/` | route guard, app init, Redux store |
| Endpoint/model/filter cá»§a nghiá»‡p vá»¥ | `features/<feature>/` | `room-api.ts`, `room-type.ts` |
| Cáº¥u hĂ¬nh form/filter/table cá»§a má»™t feature | `features/<feature>/constants/` hoáº·c trong page náº¿u ráº¥t nhá» | `room-form-fields.ts` |
| UI tá»•ng quĂ¡t khĂ´ng chá»©a business | `shared/components/` | `ModalFormCustom`, `TablePaginationCustom` |
| Hook tá»•ng quĂ¡t cho hĂ nh vi láº·p láº¡i | `shared/hooks/` | `useTable`, `useFormModal` |
| Helper thuáº§n, khĂ´ng side effect nghiá»‡p vá»¥ | `shared/utils/` | format date, format form values |

### 6.3. Luá»“ng chuáº©n cá»§a má»™t page CRUD

Má»™t page CRUD trong project nĂªn lĂ  â€œcomposition layerâ€: page chá»n dá»¯ liá»‡u, ghĂ©p hook, ghĂ©p component vĂ  khai bĂ¡o action. Page khĂ´ng nĂªn tá»± trá»Ÿ thĂ nh framework nhá» riĂªng cá»§a nĂ³.

Luá»“ng chuáº©n:

```text
feature API -> useTable -> FilterTableCustom/TablePaginationCustom
                  |
                  -> page columns -> ActionGroup -> useFormModal
                                             |
                                             -> ModalFormCustom -> DynamicForm -> form fields constants
```

Vai trĂ² tá»«ng lá»›p:

- `api/<feature>-api.ts`: gá»i HTTP vĂ  tráº£ `response.data`.
- `types/`: mĂ´ táº£ entity, payload, filter params.
- `constants/*-form-fields.ts`: mĂ´ táº£ form báº±ng config, khĂ´ng fetch data trá»±c tiáº¿p trá»« hĂ m `fetchOptions` Ä‘Ă£ Ä‘Æ°á»£c truyá»n tá»« API layer.
- `constants/*-filter-table.ts`: mĂ´ táº£ filter báº±ng config phĂ¹ há»£p `FilterTableCustom`.
- `pages/<Feature>Page.tsx`: ná»‘i API + hook + component + action.
- `shared/hooks/useTable`: giá»¯ state list, loading, pagination, filter values vĂ  cĂ¡c handler fetch/delete/active/inactive phá»• biáº¿n.
- `shared/hooks/useFormModal`: giá»¯ state modal: create/view/edit + selected record.
- `shared/components`: render UI theo config.

Khi agent lĂ m page má»›i, nĂªn tĂ¬m page cĂ¹ng pattern gáº§n nháº¥t nhÆ° `RoomPage` rá»“i triá»ƒn khai theo nhá»‹p Ä‘Ă³ trÆ°á»›c. Chá»‰ lá»‡ch pattern khi yĂªu cáº§u UI/flow tháº­t sá»± khĂ¡c.

### 6.4. Khi nĂ o dĂ¹ng láº¡i component chung, khi nĂ o táº¡o component riĂªng

Æ¯u tiĂªn dĂ¹ng láº¡i component chung khi khĂ¡c biá»‡t chá»‰ náº±m á»Ÿ dá»¯ liá»‡u, label, columns, field config, endpoint hoáº·c action. VĂ­ dá»¥ má»™t mĂ n hĂ¬nh quáº£n lĂ½ má»›i cĂ³ list + filter + create/edit/view thĂ¬ nĂªn dĂ¹ng `useTable`, `FilterTableCustom`, `TablePaginationCustom`, `ActionGroup`, `useFormModal`, `ModalFormCustom`, `DynamicForm`.

Táº¡o component trong `features/<feature>/components` khi:

- UI chá»‰ cĂ³ Ă½ nghÄ©a trong feature Ä‘Ă³.
- Component cáº§n business rule riĂªng, vĂ­ dá»¥ tráº¡ng thĂ¡i lá»›p há»c, lá»‹ch há»c, há»c phĂ­, phĂ¢n cĂ´ng giĂ¡o viĂªn.
- Component cáº§n nhiá»u props nghiá»‡p vá»¥ cá»¥ thá»ƒ vĂ  náº¿u Ä‘Æ°a vĂ o `shared` sáº½ lĂ m shared bá»‹ â€œbáº©nâ€ business.
- Component Ä‘á»§ lá»›n Ä‘á»ƒ tĂ¡ch khá»i page, giĂºp page chá»‰ cĂ²n Ä‘iá»u phá»‘i.

Chá»‰ Ä‘Æ°a component lĂªn `shared` khi:

- Ăt nháº¥t hai hoáº·c nhiá»u feature cĂ³ cĂ¹ng má»™t nhu cáº§u UI/hĂ nh vi tháº­t sá»± giá»‘ng nhau.
- TĂªn component cĂ³ thá»ƒ Ä‘áº·t báº±ng khĂ¡i niá»‡m UI tá»•ng quĂ¡t, khĂ´ng cáº§n tĂªn nghiá»‡p vá»¥.
- Props cĂ³ thá»ƒ thiáº¿t káº¿ báº±ng type trung láº­p.
- Component khĂ´ng import tá»« `features/*`.

KhĂ´ng nĂªn táº¡o abstraction quĂ¡ sá»›m. Náº¿u má»›i cĂ³ má»™t mĂ n hĂ¬nh dĂ¹ng, giá»¯ trong feature trÆ°á»›c. Khi mĂ n hĂ¬nh thá»© hai/thá»© ba láº·p láº¡i cĂ¹ng pattern, lĂºc Ä‘Ă³ má»›i tĂ¡ch shared sáº½ sáº¯c hÆ¡n, Ă­t â€œáº£o thuáº­tâ€ hÆ¡n.

### 6.5. CĂ¡ch tĂ¡i sá»­ dá»¥ng nhĂ³m table/filter/action

`useTable<T, P>` lĂ  hook trung tĂ¢m cho list cĂ³ phĂ¢n trang. NĂ³ Ä‘ang giáº£ Ä‘á»‹nh response list cĂ³ dáº¡ng `response.data.items`, `response.data.total`, `response.data.page` và `response.data.limit`. VĂ¬ váº­y API layer hoáº·c backend cáº§n tráº£ Ä‘Ăºng shape, hoáº·c API layer pháº£i normalize trÆ°á»›c khi tráº£ vá» page.

DĂ¹ng `useTable` khi mĂ n hĂ¬nh cĂ³:

- danh sĂ¡ch dá»¯ liá»‡u dáº¡ng báº£ng;
- loading list;
- filter submit/reset;
- pagination page/limit;
- delete/active/inactive theo id;
- refetch sau mutation.

KhĂ´ng nĂªn dĂ¹ng `useTable` cho mĂ n hĂ¬nh dáº¡ng calendar, kanban, dashboard chart hoáº·c detail page khĂ´ng cĂ³ pagination, trá»« khi Ä‘Ă£ cĂ¢n nháº¯c ká»¹. Nhá»¯ng mĂ n hĂ¬nh Ä‘Ă³ nĂªn cĂ³ hook riĂªng trong feature, vĂ­ dá»¥ `useCourseClassCalendar`, rá»“i chá»‰ tĂ¡ch shared sau khi cĂ³ pattern láº·p.

`FilterTableCustom` nĂªn nháº­n config filter tá»« `constants`. File constants chá»‰ nĂªn mĂ´ táº£ field: `name`, `type`, `placeholder`, `options`, `fetchOptions`. Logic khi báº¥m tĂ¬m kiáº¿m/reset thuá»™c `useTable`, cĂ²n format ngĂ y/giá» Ä‘Ă£ Ä‘Æ°á»£c component xá»­ lĂ½ báº±ng util hiá»‡n cĂ³.

`TablePaginationCustom` dĂ¹ng khi báº£ng cĂ³ pagination chuáº©n. Page chá»‰ truyá»n `columns`, `data`, `loading`, `pagination`, `onChangePage`. KhĂ´ng láº·p láº¡i cáº¥u hĂ¬nh pagination cá»§a Ant Design trong tá»«ng page náº¿u khĂ´ng cáº§n.

`ActionGroup` dĂ¹ng Ä‘á»ƒ gom action theo record. Agent nĂªn khai bĂ¡o action theo dáº¡ng data:

```ts
<ActionGroup<Entity>
  record={record}
  actions={[
    { show: () => true, icon: <EyeOutlined />, tooltip: 'Chi tiáº¿t', onClick: openView },
    { show: canEdit, icon: <EditOutlined />, tooltip: 'Sá»­a', onClick: openEdit },
    {
      show: canDelete,
      icon: <DeleteOutlined />,
      tooltip: 'XĂ³a',
      danger: true,
      isPopconfirm: true,
      onClick: () => handleDelete(record.id),
    },
  ]}
/>
```

Pháº§n `show` nĂªn chá»©a Ä‘iá»u kiá»‡n hiá»ƒn thá»‹ action theo record/quyá»n/tráº¡ng thĂ¡i. KhĂ´ng render thá»§ cĂ´ng nhiá»u button láº·p láº¡i trong tá»«ng column náº¿u `ActionGroup` Ä‘Ă£ Ä‘Ă¡p á»©ng Ä‘Æ°á»£c.

### 6.6. CĂ¡ch tĂ¡i sá»­ dá»¥ng nhĂ³m modal/form

`useFormModal<T>` chuáº©n hĂ³a ba mode: create, view, edit. Page nĂªn dĂ¹ng hook nĂ y thay vĂ¬ tá»± táº¡o nhiá»u state nhÆ° `isCreateOpen`, `isEditOpen`, `editingItem`, `viewingItem`.

`ModalFormCustom<T>` chá»‹u trĂ¡ch nhiá»‡m:

- táº¡o form Ant Design;
- set initial values khi má»Ÿ modal;
- format form values theo section/field;
- gá»i `onSubmit`;
- hiá»ƒn thá»‹ notification success/error;
- reset form, Ä‘Ă³ng modal vĂ  gá»i `onSuccess`.

VĂ¬ `ModalFormCustom` Ä‘Ă£ xá»­ lĂ½ notification vĂ  refetch sau submit, page chá»‰ cáº§n truyá»n Ä‘Ăºng `onSubmit` vĂ  `onSuccess`. Vá»›i CRUD phá»• biáº¿n:

```ts
<ModalFormCustom<Entity>
  open={open}
  title="Entity"
  mode={mode}
  initialValues={selectedRecord}
  disabled={mode === FormModalMode.VIEW}
  onCancel={close}
  onSuccess={refetch}
  onSubmit={mode === FormModalMode.CREATE ? create : (values) => update(selectedRecord!.id, values)}
  sections={sections}
/>
```

`DynamicForm` render field theo `FormFieldType`. VĂ¬ váº­y agent nĂªn má»Ÿ rá»™ng báº±ng cĂ¡ch thĂªm field config trÆ°á»›c, khĂ´ng tá»± viáº¿t form JSX náº¿u chá»‰ lĂ  input/select/date/time/upload thĂ´ng thÆ°á»ng.

Chá»‰ viáº¿t form riĂªng trong feature khi:

- layout form khĂ´ng thá»ƒ biá»ƒu diá»…n tá»‘t báº±ng `sections` + `fields`;
- form cĂ³ tÆ°Æ¡ng tĂ¡c phá»©c táº¡p giá»¯a nhiá»u báº£ng/danh sĂ¡ch con;
- cáº§n UI Ä‘á»™ng vÆ°á»£t khá»i `DynamicForm`, vĂ­ dá»¥ drag/drop lá»‹ch há»c hoáº·c nested editable table;
- cáº§n preview hoáº·c wizard nhiá»u bÆ°á»›c.

Ngay cáº£ khi viáº¿t form riĂªng, váº«n nĂªn dĂ¹ng wrapper shared nhÆ° `ModalCustom`, input/select/date custom hiá»‡n cĂ³, `useNotification`, vĂ  type/payload rĂµ rĂ ng.

### 6.7. CĂ¡ch thiáº¿t káº¿ `constants` Ä‘á»ƒ page gá»n

CĂ¡c file constants trong feature khĂ´ng chá»‰ lĂ  nÆ¡i â€œnĂ©m máº£ng configâ€. ChĂºng giĂºp page khĂ´ng bá»‹ nhiá»…u bá»Ÿi chi tiáº¿t field/filter.

NĂªn Ä‘Æ°a vĂ o constants:

- form fields dĂ i;
- filter fields;
- status options;
- mapping label/color cho status;
- helper nhá» chá»‰ phá»¥c vá»¥ hiá»ƒn thá»‹ cá»§a feature.

KhĂ´ng nĂªn Ä‘Æ°a vĂ o constants:

- state React;
- gá»i API trá»±c tiáº¿p ngay khi import file;
- logic phá»¥ thuá»™c lifecycle component;
- dá»¯ liá»‡u cáº§n láº¥y theo runtime mĂ  khĂ´ng thĂ´ng qua function;
- rule quĂ¡ phá»©c táº¡p khiáº¿n config trá»Ÿ thĂ nh code khĂ³ Ä‘á»c.

Náº¿u field cáº§n option tá»« API, truyá»n function `fetchOptions` Ä‘á»ƒ component gá»i khi cáº§n. KhĂ´ng gá»i API á»Ÿ top-level cá»§a constants file.

### 6.8. Quy táº¯c thiáº¿t káº¿ type Ä‘á»ƒ tĂ¡i sá»­ dá»¥ng tá»‘t

Má»—i feature nĂªn tĂ¡ch rĂµ:

- entity server tráº£ vá»;
- payload create;
- payload update;
- filter params;
- option item náº¿u dĂ¹ng select;
- status/role union type náº¿u backend cĂ³ táº­p giĂ¡ trá»‹ cá»‘ Ä‘á»‹nh.

KhĂ´ng dĂ¹ng má»™t type cho má»i viá»‡c náº¿u shape thá»±c táº¿ khĂ¡c nhau. VĂ­ dá»¥ `Room` cĂ³ thá»ƒ cĂ³ `id`, `createdAt`, `updatedAt`, nhÆ°ng `CreateRoomPayload` khĂ´ng nĂªn báº¯t buá»™c cĂ¡c field Ä‘Ă³.

Khi component shared cáº§n generic type, truyá»n generic tá»« page:

```ts
useTable<Room, RoomFilterParams>(...)
useFormModal<Room>()
TablePaginationCustom<Room>
ModalFormCustom<Room>
ActionGroup<Room>
```

Generic giĂºp component shared khĂ´ng cáº§n biáº¿t business model nhÆ°ng váº«n giá»¯ type safety cho page.

### 6.9. Dáº¥u hiá»‡u code Ä‘ang bá»‹ tá»• chá»©c sai

Agent nĂªn dá»«ng láº¡i vĂ  xem láº¡i thiáº¿t káº¿ náº¿u gáº·p cĂ¡c dáº¥u hiá»‡u nĂ y:

- Page import `axiosClient` trá»±c tiáº¿p.
- `shared` import type hoáº·c API tá»« `features`.
- Má»™t component shared cĂ³ prop/tĂªn gáº¯n vá»›i nghiá»‡p vá»¥ cá»¥ thá»ƒ.
- Má»™t page chá»©a quĂ¡ nhiá»u form field/filter field inline dĂ¹ cĂ³ thá»ƒ Ä‘Æ°a vĂ o constants.
- Nhiá»u page copy nguyĂªn logic pagination/filter/delete thay vĂ¬ dĂ¹ng `useTable`.
- Form create/update dĂ¹ng trá»±c tiáº¿p entity type lá»›n dĂ¹ payload khĂ¡c entity.
- Reducer ghi `localStorage` hoáº·c táº¡o side effect ngoĂ i cáº­p nháº­t state.
- API layer hiá»ƒn thá»‹ notification hoáº·c navigate route.
- Constants file gá»i API á»Ÿ top-level khi Ä‘Æ°á»£c import.
- Component feature bá»‹ Ä‘Æ°a lĂªn shared chá»‰ vĂ¬ â€œcĂ³ thá»ƒ sau nĂ y dĂ¹ng láº¡iâ€.

### 6.10. Checklist nhanh khi agent triá»ƒn khai feature má»›i

1. TĂ¬m feature/page gáº§n nháº¥t cĂ³ cĂ¹ng loáº¡i luá»“ng.
2. Táº¡o hoáº·c cáº­p nháº­t `types` trÆ°á»›c Ä‘á»ƒ khĂ³a contract.
3. Viáº¿t API layer báº±ng `axiosClient`, tráº£ `response.data`.
4. Táº¡o form fields/filter fields trong `constants` náº¿u page cĂ³ form/filter chuáº©n.
5. DĂ¹ng `useTable` cho list cĂ³ pagination/filter/action phá»• biáº¿n.
6. DĂ¹ng `useFormModal` + `ModalFormCustom` + `DynamicForm` cho create/view/edit chuáº©n.
7. DĂ¹ng `ActionGroup` cho action theo record.
8. Chá»‰ táº¡o component trong feature khi UI/business vÆ°á»£t khá»i component shared.
9. Chá»‰ nĂ¢ng lĂªn `shared` khi abstraction tháº­t sá»± trung láº­p vĂ  láº·p á»Ÿ nhiá»u feature.
10. Kiá»ƒm tra láº¡i import direction: `app -> features/shared`, `features -> shared`, `shared -> khĂ´ng phá»¥ thuá»™c features`.

### 6.11. Rule ra quyết định trước khi tách shared component

Trước khi triển khai hoặc mở rộng một page quản lý mới, agent phải làm một lượt "component pre-check".
Mục tiêu là nhận ra sớm phần UI/hành vi có thể dùng chung, thay vì copy JSX giống nhau qua nhiều page rồi mới sửa.

Pre-check bắt buộc:

1. Liệt kê các khối UI page sẽ có: filter, table, pagination, action group, modal form, select list, upload, date/time picker, toast.
2. So sánh với component/hook đang có trong `shared`: `DataTable`, `AppPagination`, `useTable`, form/modal/select custom nếu đã tồn tại.
3. Nếu khác biệt chỉ là `label`, `placeholder`, `options`, `loading`, `allowClear`, `showSearch`, `columns`, `rowKey`, `onSubmit` hoặc `pagination`, ưu tiên mở rộng component shared bằng props trung lập.
4. Nếu UI có business rule riêng của feature, giữ trong `features/<feature>/components` hoặc trong page khi còn nhỏ.
5. Khi cùng một kiểu UI xuất hiện ở page thứ hai trở lên, phải cân nhắc tách shared ngay trong lần triển khai đó, trừ khi abstraction làm props bị gắn business.

Quy tắc đặt tên component shared:

- Tên theo UI trung lập: `AppSelect`, `SearchableSelect`, `FormSelect`, `DataTable`, `ActionGroup`.
- Không đặt tên theo nghiệp vụ: `StaffSelect`, `ServiceStatusSelect`, `UserRoleSelect` trong `shared`.
- Component shared không import từ `features/*`; option/data nghiệp vụ được truyền từ page hoặc từ API layer của feature.

Nếu chưa tách shared, page vẫn phải viết theo cách dễ tách sau:

- Dùng type option thống nhất `{ label: string; value: string | number }` khi phù hợp.
- Không nhúng logic filter/search phức tạp trực tiếp lặp lại trong nhiều `<Select />`.
- Không gọi API option ở constants top-level; page hoặc hook gọi API rồi truyền options vào component.

### 6.12. Chuẩn Select list và search option

Các select list trong form/filter quản lý phải có hành vi nhất quán. Khi dùng Ant Design `Select` trực tiếp hoặc component shared bọc `Select`, mặc định nên hỗ trợ:

- `allowClear` cho filter field.
- `showSearch` khi danh sách option có khả năng dài hoặc lấy từ API.
- `optionFilterProp="label"` để tìm theo tên hiển thị của option.
- `filterOption` trung lập để tìm theo cả `label` và `value` khi cần.
- `loading` khi option lấy từ API.
- `placeholder` rõ nghĩa: ví dụ `Tất cả trạng thái`, `Chọn nhân viên`, `Chọn danh mục`.

Mẫu filter option dùng chung nên ưu tiên:

```ts
export const filterSelectOptionByLabelValue = (
  input: string,
  option?: { label?: React.ReactNode; value?: string | number },
) => {
  const keyword = input.trim().toLowerCase();
  const label = String(option?.label ?? '').toLowerCase();
  const value = String(option?.value ?? '').toLowerCase();

  return label.includes(keyword) || value.includes(keyword);
};
```

Khi tạo component shared cho select, nên thiết kế props dạng trung lập:

```ts
interface AppSelectProps<ValueType extends string | number = string> {
  allowClear?: boolean;
  loading?: boolean;
  options: Array<{ label: React.ReactNode; value: ValueType }>;
  placeholder?: string;
  searchable?: boolean;
}
```

Quy tắc sử dụng:

- Option tĩnh như status/role đặt trong `features/<feature>/constants`.
- Option lấy từ API như staff/category đặt trong feature API, page hoặc hook fetch rồi truyền vào select.
- Với option "Tất cả", nếu backend mong không gửi field thì page phải map sentinel value thành `undefined` ở payload/filter layer, không để component shared biết nghiệp vụ đó.

## 7. State management

DĂ¹ng state cá»¥c bá»™ khi dá»¯ liá»‡u:

- Chá»‰ phá»¥c vá»¥ má»™t page/component.
- CĂ³ thá»ƒ fetch láº¡i tá»« API.
- KhĂ´ng cáº§n Ä‘á»“ng bá»™ giá»¯a cĂ¡c route xa nhau.

DĂ¹ng Redux khi state:

- Cáº§n á»Ÿ nhiá»u khu vá»±c cáº¥p á»©ng dá»¥ng.
- Sá»‘ng qua nhiá»u route.
- Äáº¡i diá»‡n session, identity hoáº·c tráº¡ng thĂ¡i toĂ n cá»¥c cĂ³ vĂ²ng Ä‘á»i rĂµ rĂ ng.

Redux async flow:

```text
page/component -> dispatch thunk -> feature API -> reducer cáº­p nháº­t state
```

Side effect nhÆ° notification, navigation, cookie vĂ  Web Storage khĂ´ng Ä‘áº·t trong
reducer. Theme preference cĂ³ thá»ƒ dĂ¹ng `localStorage`; thĂ´ng tin xĂ¡c thá»±c thĂ¬ khĂ´ng.

## 8. Quy Æ°á»›c code

- Component, type, interface: `PascalCase`.
- Biáº¿n, hĂ m, hook: `camelCase`.
- Háº±ng sá»‘ thá»±c sá»± báº¥t biáº¿n: `CONSTANT_CASE`.
- Hook báº¯t Ä‘áº§u báº±ng `use`.
- Component file dĂ¹ng `PascalCase.tsx`.
- CĂ¡c file API/type/constant hiá»‡n theo `kebab-case`.
- DĂ¹ng `import type` cho import chá»‰ dĂ¹ng á»Ÿ type level.
- Æ¯u tiĂªn alias `@/` cho import khĂ¡c vĂ¹ng; relative import cho file gáº§n trong cĂ¹ng
  feature.
- Format theo Prettier: 2 spaces, single quote, semicolon, trailing comma, line width 100.
- KhĂ´ng sá»­a code ngoĂ i pháº¡m vi yĂªu cáº§u chá»‰ Ä‘á»ƒ â€œdá»n Ä‘áº¹pâ€.

## 9. Chuáº©n response mĂ  cĂ¡c abstraction hiá»‡n táº¡i mong Ä‘á»£i

List cĂ³ pagination:

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

Mutation thÆ°á»ng tráº£:

```json
{
  "message": "Operation completed",
  "data": {}
}
```

Náº¿u backend tráº£ shape khĂ¡c, chuáº©n hĂ³a trong API layer hoáº·c táº¡o adapter cĂ³ type rĂµ
rĂ ng. KhĂ´ng ráº£i logic Ä‘á»c nhiá»u response shape khĂ¡c nhau trong cĂ¡c page.

## 10. Quy táº¯c authentication má»¥c tiĂªu: HttpOnly cookie

### 10.1. Báº¥t biáº¿n báº£o máº­t

- KhĂ´ng lÆ°u access token hoáº·c refresh token trong `localStorage`,
  `sessionStorage`, IndexedDB, Redux persist hoáº·c JavaScript-readable cookie.
- Frontend khĂ´ng Ä‘Æ°á»£c Ä‘á»c token.
- Chá»‰ backend cĂ³ thá»ƒ táº¡o cookie `HttpOnly` báº±ng header `Set-Cookie`.
- Frontend giá»¯ `user`, `initialized`, `loading`, `error`; khĂ´ng giá»¯ token.
- Cookie auth cáº§n xá»­ lĂ½ cáº£ XSS láº«n CSRF. `HttpOnly` giáº£m rá»§i ro token bá»‹ Ä‘á»c bá»Ÿi XSS
  nhÆ°ng khĂ´ng tá»± giáº£i quyáº¿t CSRF.

`localStorage` váº«n Ä‘Æ°á»£c phĂ©p cho dá»¯ liá»‡u khĂ´ng nháº¡y cáº£m nhÆ° lá»±a chá»n theme.

### 10.2. Há»£p Ä‘á»“ng backend báº¯t buá»™c

Sau login thĂ nh cĂ´ng, backend Ä‘áº·t cookie thay vĂ¬ tráº£ token cho JavaScript:

```http
Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=...
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Lax; Path=/auth/refresh-token; Max-Age=...
```

Backend cáº§n cung cáº¥p:

- `POST /auth/login`: xĂ¡c thá»±c, Ä‘áº·t cookie, tráº£ user hoáº·c dá»¯ liá»‡u khĂ´ng chá»©a token.
- `POST /auth/refresh-token`: Ä‘á»c refresh cookie, rotate token, Ä‘áº·t cookie má»›i.
- `GET /.../me` hoáº·c `GET /auth/session`: Ä‘á»c access cookie vĂ  tráº£ current user.
- `POST /auth/logout`: revoke refresh session náº¿u cĂ³ vĂ  xĂ³a cáº£ hai cookie.

Khi xĂ³a cookie, backend pháº£i dĂ¹ng cĂ¹ng `Path`, `Domain`, `SameSite` vĂ  cĂ¡c thuá»™c tĂ­nh
liĂªn quan Ä‘Ă£ dĂ¹ng lĂºc táº¡o.

Khuyáº¿n nghá»‹:

- Access token sá»‘ng ngáº¯n.
- Refresh token rotation vĂ  phĂ¡t hiá»‡n reuse.
- Refresh token/session Ä‘Æ°á»£c revoke á»Ÿ server khi logout.
- KhĂ´ng Ä‘áº·t `Domain` náº¿u khĂ´ng cáº§n chia sáº» cookie giá»¯a subdomain.
- Production luĂ´n dĂ¹ng HTTPS vĂ  `Secure`.
- Náº¿u frontend vĂ  API thá»±c sá»± cross-site, dĂ¹ng `SameSite=None; Secure`, CORS vá»›i
  origin cá»¥ thá»ƒ vĂ  cÆ¡ cháº¿ CSRF token. KhĂ´ng dĂ¹ng `Access-Control-Allow-Origin: *`
  cĂ¹ng credentials.

### 10.3. Axios phĂ­a frontend

Axios client gá»­i cookie tá»± Ä‘á»™ng:

```ts
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Thay Ä‘á»•i so vá»›i token trong Web Storage:

- XĂ³a request interceptor Ä‘á»c `accessToken`.
- KhĂ´ng tá»± gáº¯n `Authorization: Bearer ...`.
- Refresh request khĂ´ng gá»­i refresh token trong body.
- Refresh request cáº§n `withCredentials: true`.
- Queue chá»‰ chá» refresh hoĂ n táº¥t rá»“i retry request cÅ©; queue khĂ´ng truyá»n token.

NĂªn cĂ³ client riĂªng cho refresh Ä‘á»ƒ khĂ´ng Ä‘i láº¡i qua response interceptor cá»§a
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
  -> náº¿u request Ä‘Ă£ retry: reject
  -> náº¿u Ä‘ang refresh: Ä‘Æ°a request vĂ o queue
  -> náº¿u chÆ°a refresh:
       POST /auth/refresh-token báº±ng refreshClient
       thĂ nh cĂ´ng -> giáº£i phĂ³ng queue -> retry cĂ¡c request
       tháº¥t báº¡i   -> reject queue -> clear auth state -> vá» login
```

Interceptor pháº£i:

- Chá»‰ refresh khi `401`, khĂ´ng refresh khi `403`.
- CĂ³ `_retry` Ä‘á»ƒ trĂ¡nh vĂ²ng láº·p.
- KhĂ´ng refresh chĂ­nh request login/register/refresh/logout.
- Chá»‰ cĂ³ má»™t refresh request táº¡i má»™t thá»i Ä‘iá»ƒm.
- KhĂ´ng phá»¥ thuá»™c vĂ o token value á»Ÿ JavaScript.
- PhĂ¡t tĂ­n hiá»‡u session-expired cho auth layer thay vĂ¬ Ă¢m tháº§m sá»­a Redux tá»« module
  háº¡ táº§ng.

### 10.4. Khá»Ÿi táº¡o á»©ng dá»¥ng

`AppInit` khĂ´ng kiá»ƒm tra token trong `localStorage`. Khi app má»Ÿ:

```text
dispatch getMe/session
  -> thĂ nh cĂ´ng: lÆ°u user, initialized = true
  -> access háº¿t háº¡n: interceptor refresh rá»“i retry
  -> refresh tháº¥t báº¡i: user = null, initialized = true
```

Route guard chá»‰ dá»±a vĂ o `user` vĂ  `initialized`.

### 10.5. Login vĂ  logout

Login:

```text
submit credentials
-> backend set cookie
-> response tráº£ user hoáº·c frontend gá»i getMe
-> Redux lÆ°u user
-> navigate vĂ o app
```

Logout:

```text
POST /auth/logout
-> backend revoke session vĂ  clear cookie
-> Redux xĂ³a user
-> navigate tá»›i login
```

KhĂ´ng coi viá»‡c chá»‰ `state.user = null` lĂ  logout hoĂ n chá»‰nh vĂ¬ cookie HttpOnly váº«n
tá»“n táº¡i vĂ  JavaScript khĂ´ng thá»ƒ tá»± xĂ³a.

### 10.6. CSRF

Náº¿u dĂ¹ng cookie Ä‘á»ƒ xĂ¡c thá»±c request thay Ä‘á»•i dá»¯ liá»‡u (`POST`, `PUT`, `PATCH`,
`DELETE`), Ă¡p dá»¥ng Ă­t nháº¥t:

- `SameSite=Lax` hoáº·c `Strict` khi kiáº¿n trĂºc cho phĂ©p.
- Kiá»ƒm tra `Origin`/`Referer` á»Ÿ backend.
- CSRF token cho kiáº¿n trĂºc cross-site hoáº·c yĂªu cáº§u báº£o máº­t cao. CSRF token cĂ³ thá»ƒ
  Ä‘Æ°á»£c frontend Ä‘á»c vĂ  gá»­i qua custom header; token xĂ¡c thá»±c váº«n giá»¯ `HttpOnly`.

## 11. Káº¿ hoáº¡ch chuyá»ƒn auth hiá»‡n táº¡i

CĂ¡c vá»‹ trĂ­ hiá»‡n Ä‘ang phá»¥ thuá»™c token trong `localStorage` vĂ  cáº§n Ä‘Æ°á»£c thay Ä‘á»•i Ä‘á»“ng
bá»™ khi backend há»— trá»£ cookie:

1. `src/shared/lib/axios.ts`
   - Bá» Ä‘á»c/ghi/xĂ³a token.
   - Báº­t `withCredentials`.
   - Refresh báº±ng cookie vĂ  queue khĂ´ng truyá»n token.
2. `src/app/init/AppInit.tsx`
   - LuĂ´n kiá»ƒm tra session/get-me thay vĂ¬ kiá»ƒm tra access token.
3. `src/features/auth/store/auth-slice.ts`
   - Bá» toĂ n bá»™ side effect Web Storage.
   - Reducer chá»‰ cáº­p nháº­t auth state.
4. `src/features/auth/api/auth-api.ts`
   - ThĂªm logout API; login/refresh dá»±a trĂªn cookie contract.
5. Auth thunk/UI
   - Login láº¥y user mĂ  khĂ´ng nháº­n token.
   - Logout gá»i backend trÆ°á»›c khi clear state.
6. Backend/CORS
   - ThĂªm `Set-Cookie`, clear cookie, credentials CORS vĂ  CSRF protection.
7. TĂ i liá»‡u cÅ©
   - Cáº­p nháº­t cĂ¡c mĂ´ táº£ JWT cĂ²n hÆ°á»›ng dáº«n lÆ°u token trong `localStorage`.

KhĂ´ng triá»ƒn khai migration chá»‰ á»Ÿ frontend. Náº¿u backend chÆ°a Ä‘áº·t vĂ  Ä‘á»c HttpOnly
cookie thĂ¬ xĂ³a cÆ¡ cháº¿ token hiá»‡n táº¡i sáº½ lĂ m toĂ n bá»™ private API máº¥t xĂ¡c thá»±c.

## 12. Checklist cho Agent trÆ°á»›c khi hoĂ n thĂ nh

- [ ] ÄĂ£ Ä‘á»c feature gáº§n nháº¥t cĂ³ cĂ¹ng loáº¡i luá»“ng Ä‘á»ƒ giá»¯ convention.
- [ ] Code náº±m Ä‘Ăºng `app`, `features` hoáº·c `shared`.
- [ ] API call náº±m trong feature API layer vĂ  dĂ¹ng `axiosClient`.
- [ ] Request/response/payload/filter cĂ³ type rĂµ rĂ ng, khĂ´ng thĂªm `any` tĂ¹y tiá»‡n.
- [ ] ÄĂ£ tĂ¡i sá»­ dá»¥ng hook/component chung phĂ¹ há»£p.
- [ ] ÄĂ£ lĂ m component pre-check: filter/table/modal/select/pagination cĂ³ nĂªn dĂ¹ng shared hoáº·c táº¡o shared khĂ´ng.
- [ ] Select list cĂ³ `showSearch`/`optionFilterProp`/filter theo label-value khi danh sĂ¡ch option cĂ³ thá»ƒ dĂ i.
- [ ] Page chá»‰ phá»‘i há»£p UI vĂ  data flow, khĂ´ng chá»©a háº¡ táº§ng.
- [ ] Route, layout, guard vĂ  navigation Ä‘Ă£ Ä‘Æ°á»£c cáº­p nháº­t náº¿u cáº§n.
- [ ] Loading, empty, error vĂ  permission Ä‘Ă£ Ä‘Æ°á»£c xá»­ lĂ½.
- [ ] KhĂ´ng ghi token vĂ o Web Storage hoáº·c Redux persist.
- [ ] Cookie auth khĂ´ng dá»±a vĂ o viá»‡c JavaScript Ä‘á»c token.
- [ ] Mutation dĂ¹ng cookie Ä‘Ă£ cĂ³ biá»‡n phĂ¡p CSRF phĂ¹ há»£p.
- [ ] KhĂ´ng lĂ m há»ng refresh queue hoáº·c táº¡o vĂ²ng láº·p `401`.
- [ ] KhĂ´ng sá»­a file ngoĂ i pháº¡m vi yĂªu cáº§u.
- [ ] `npm.cmd run lint` Ä‘áº¡t.
- [ ] `npm.cmd run build` Ä‘áº¡t.

## TanStack Query cho server-state/cache

Áp dụng TanStack Query cho dữ liệu lấy từ server bằng `GET` khi dữ liệu đó có thể cache, refetch,
giữ dữ liệu cũ khi đổi filter/page hoặc được dùng lại giữa nhiều component/page.

Quy tắc tổ chức:

- Query client đặt ở `src/shared/lib/query-client.ts` và được inject một lần trong `AppProvider`.
- API function vẫn nằm trong `features/<feature>/api`; query hook không được gọi thẳng `axiosClient`.
- Query key đặt trong `features/<feature>/constants/<feature>-query-keys.ts`.
- Query hook đặt trong `features/<feature>/hooks/use<Feature>Query.ts`.
- Page chỉ giữ UI state như filter, page, selected item; dữ liệu server lấy qua query hook.
- Response `ApiResponse<T>` nên được unwrap trong hook bằng shared util trước khi trả `data` cho page.
- Dùng `placeholderData: keepPreviousData` cho list có pagination/filter để UX không bị giật khi đổi trang.
- Redux không dùng để cache server data từng page. Redux chỉ dùng cho global state thật sự cần chia sẻ,
  ví dụ current user/session.
- Mutation `POST`, `PUT`, `PATCH`, `DELETE` sau này nên dùng `useMutation` và invalidate đúng query key
  liên quan thay vì reload toàn bộ page.

Ví dụ flow đúng:

```text
Page filter/page state
-> feature query hook
-> feature API layer
-> axiosClient
-> unwrap ApiResponse
-> page render loading/empty/error/data
```

Không làm:

```text
Page useEffect
-> axiosClient trực tiếp
-> setLoading/setData lặp lại ở nhiều page
```
