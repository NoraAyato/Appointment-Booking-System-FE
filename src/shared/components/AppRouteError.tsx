import { Button, Result } from 'antd';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function AppRouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Đã có lỗi ngoài dự kiến.';

  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f4ee] px-4">
      <Result
        status="500"
        title="Ứng dụng gặp lỗi"
        subTitle={message}
        extra={
          <Button type="primary" onClick={() => window.location.assign('/')}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
}
