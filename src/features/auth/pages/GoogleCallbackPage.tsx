import { Button, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAppDispatch } from '@/app/redux/hooks';
import { fetchCurrentUser } from '@/features/users/store/user-thunk';

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(searchParams.get('success') === 'true');
  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const error = searchParams.get('error');
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!success) {
      return;
    }

    dispatch(fetchCurrentUser())
      .unwrap()
      .finally(() => {
        setLoading(false);
        setLoaded(true);
      });
  }, [dispatch, success]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
        <Spin size="large" tip="Đang hoàn tất đăng nhập Google..." />
      </main>
    );
  }

  if (success && loaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
        <Result
          status="success"
          title="Đăng nhập Google thành công"
          subTitle="Cookie đăng nhập đã được lưu, bạn có thể tiếp tục sử dụng hệ thống."
          extra={
            <Link to="/">
              <Button type="primary">Về trang chủ</Button>
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ee] px-4 py-10">
      <Result
        status="error"
        title="Đăng nhập Google thất bại"
        subTitle={error || 'Không thể hoàn tất đăng nhập Google.'}
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </main>
  );
}
