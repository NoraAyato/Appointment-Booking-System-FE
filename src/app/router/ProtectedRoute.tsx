import { Result } from 'antd';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@/app/redux/hooks';
import type { UserRole } from '@/features/users/types/user-type';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="grid min-h-[65vh] place-items-center px-4">
        <Result
          status="403"
          title="Không có quyền truy cập"
          subTitle="Tài khoản hiện tại không có quyền xem trang này."
        />
      </div>
    );
  }

  return children;
}

