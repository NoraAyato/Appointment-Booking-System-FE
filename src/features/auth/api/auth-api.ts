import type { LoginPayload, User } from '../types/auth-type';

const MOCK_USERS: Record<LoginPayload['role'], User> = {
  customer: {
    id: 'usr-001',
    fullName: 'Minh Anh',
    email: 'customer@yoedu.vn',
    role: 'customer',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    phone: '090 234 8899',
  },
  staff: {
    id: 'usr-102',
    fullName: 'Hoàng Staff',
    email: 'staff@yoedu.vn',
    role: 'staff',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    phone: '090 811 7722',
  },
  admin: {
    id: 'usr-900',
    fullName: 'Linh Admin',
    email: 'admin@yoedu.vn',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    phone: '091 555 1188',
  },
};

const delay = (duration = 450) => new Promise((resolve) => window.setTimeout(resolve, duration));

export const authApi = {
  login: async (payload: LoginPayload) => {
    await delay();

    if (!payload.email || !payload.password) {
      throw new Error('Vui lòng nhập email và mật khẩu.');
    }

    return {
      message: 'Đăng nhập thành công',
      data: MOCK_USERS[payload.role],
    };
  },

  logout: async () => {
    await delay(250);

    return {
      message: 'Đã đăng xuất',
      data: null,
    };
  },
};
