import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Rate,
  Space,
  Typography,
  Upload,
  notification,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

import { getApiErrorMessage } from '@/shared/utils/api-error';
import { getAvatarInitial } from '@/shared/utils/avatar';

import { appointmentHistoryApi } from '../api/appointment-history-api';
import type { AppointmentHistoryModel } from '../types/appointment-type';

interface AppointmentReviewModalProps {
  appointment: AppointmentHistoryModel | null;
  onClose: () => void;
  onSuccess: () => void;
  open: boolean;
}

interface FormValues {
  description: string;
  serviceScore: number;
}

export function AppointmentReviewModal({
  appointment,
  onClose,
  onSuccess,
  open,
}: AppointmentReviewModalProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [toast, toastContextHolder] = notification.useNotification();

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPreviewOpen(false);
    setPreviewImage('');
    onClose();
  };

  const handlePreview = (file: UploadFile) => {
    const url = file.url || (file.thumbUrl as string) || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '');
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const handleSubmit = async (values: FormValues) => {
    if (!appointment) return;

    try {
      setSubmitting(true);
      const pictureFile = fileList[0]?.originFileObj ?? null;

      await appointmentHistoryApi.createReview(appointment.appointmentId, {
        description: values.description.trim(),
        picture: pictureFile,
        serviceScore: values.serviceScore,
      });

      toast.success({
        description: 'Cảm ơn bạn đã chia sẻ trải nghiệm dịch vụ.',
        message: 'Gửi đánh giá thành công!',
        placement: 'topRight',
      });

      handleCancel();
      onSuccess();
    } catch (err) {
      toast.error({
        description: getApiErrorMessage(err, 'Không thể gửi đánh giá. Vui lòng thử lại sau.'),
        message: 'Lỗi gửi đánh giá',
        placement: 'topRight',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const uploadedFile = fileList[0];
  const uploadedImageUrl = uploadedFile
    ? uploadedFile.url || (uploadedFile.thumbUrl as string) || (uploadedFile.originFileObj ? URL.createObjectURL(uploadedFile.originFileObj) : '')
    : '';

  return (
    <>
      <Modal
        destroyOnClose
        confirmLoading={submitting}
        footer={null}
        open={open}
        title="Đánh giá dịch vụ"
        onCancel={handleCancel}
      >
        {toastContextHolder}
        {appointment ? (
          <div className="py-2">
            <div className="mb-4 rounded-lg bg-slate-50 p-3 border border-slate-100">
              <Typography.Text className="block !font-semibold !text-ink">
                {appointment.serviceName}
              </Typography.Text>
              <Space size={8} className="mt-1">
                <Avatar size={24} src={appointment.staffAvatarUrl}>
                  {getAvatarInitial(appointment.staffName)}
                </Avatar>
                <Typography.Text className="!text-xs !text-slate-500">
                  Nhân viên: <strong>{appointment.staffName}</strong>
                </Typography.Text>
              </Space>
            </div>

            <Form<FormValues>
              form={form}
              initialValues={{ serviceScore: 5 }}
              layout="vertical"
              onFinish={(values) => void handleSubmit(values)}
            >
              <Form.Item
                label="Mức độ hài lòng"
                name="serviceScore"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ hài lòng' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                label="Nội dung đánh giá"
                name="description"
                rules={[
                  { required: true, message: 'Vui lòng nhập nội dung đánh giá' },
                  { min: 5, message: 'Nội dung đánh giá tối thiểu 5 ký tự' },
                ]}
              >
                <Input.TextArea
                  maxLength={500}
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ, không gian và tay nghề nhân viên..."
                  rows={4}
                  showCount
                />
              </Form.Item>

              <Form.Item label="Hình ảnh đính kèm (không bắt buộc)">
                {uploadedFile && uploadedImageUrl ? (
                  <div className="relative group overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5 p-1 h-44 flex items-center justify-center">
                    <img
                      alt="Đã chọn"
                      className="h-full w-full object-cover rounded-lg cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      src={uploadedImageUrl}
                      onClick={() => handlePreview(uploadedFile)}
                    />
                    <div
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      onClick={() => handlePreview(uploadedFile)}
                    >
                      <span className="text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">
                        Nhấp để xem ảnh lớn
                      </span>
                    </div>
                    <Button
                      className="!absolute top-2 right-2 !bg-black/60 hover:!bg-red-600 !text-white !border-none z-10"
                      icon={<CloseOutlined />}
                      shape="circle"
                      size="small"
                      title="Xóa hình ảnh"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileList([]);
                      }}
                    />
                  </div>
                ) : (
                  <Upload.Dragger
                    accept="image/*"
                    beforeUpload={() => false}
                    fileList={[]}
                    maxCount={1}
                    showUploadList={false}
                    onChange={({ fileList: nextList }) => {
                      setFileList(
                        nextList.map((file) => {
                          if (file.originFileObj && !file.url) {
                            file.url = URL.createObjectURL(file.originFileObj);
                          }
                          return file;
                        }),
                      );
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="!text-3xl !text-amber-600" />
                    </p>
                    <p className="ant-upload-text !text-sm !font-medium">
                      Kéo thả hoặc nhấp vào đây để tải hình ảnh lên
                    </p>
                    <p className="ant-upload-hint !text-xs !text-slate-400">
                      Hỗ trợ các định dạng PNG, JPG, JPEG, WEBP (Tối đa 1 ảnh)
                    </p>
                  </Upload.Dragger>
                )}
              </Form.Item>

              <div className="mt-6 flex justify-end gap-2">
                <Button disabled={submitting} onClick={handleCancel}>
                  Hủy bỏ
                </Button>
                <Button loading={submitting} type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </div>
            </Form>
          </div>
        ) : null}
      </Modal>

      <Modal
        centered
        footer={null}
        open={previewOpen}
        title="Xem trước hình ảnh"
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Xem trước hình ảnh đánh giá" className="max-h-[70vh] w-full rounded-lg object-contain" src={previewImage} />
      </Modal>
    </>
  );
}
