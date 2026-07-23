import type { PublicServiceCardModel } from '../types/public-service-type';

export const publicServiceDetailHighlights = [
  'Tư vấn nhanh trước khi bắt đầu để chọn cường độ và phong cách chăm sóc phù hợp.',
  'Không gian riêng tại trung tâm HomeFeel, chuẩn bị sẵn khăn, tinh dầu và dụng cụ vệ sinh.',
  'Theo dõi cảm nhận sau dịch vụ để gợi ý lịch chăm sóc tiếp theo.',
];

export const publicServicePreparationNotes = [
  'Vui lòng đến trước lịch hẹn 10 phút để hoàn tất check-in.',
  'Nếu cần thay đổi giờ, bạn có thể điều chỉnh trước khi bấm đặt dịch vụ.',
  'Nhân viên phụ trách có thể thay đổi theo ngày và giờ thực tế.',
];

export const getServiceDetailGalleryImages = (service: PublicServiceCardModel) => {
  return service.imageUrls.filter(
    (imageUrl, index, imageUrls) => imageUrls.indexOf(imageUrl) === index,
  );
};
