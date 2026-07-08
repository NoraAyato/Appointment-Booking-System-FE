import type { HomeAboutValue, HomeCustomerReview } from '../types/home-type';

export const homeCustomerReviews: HomeCustomerReview[] = [
  {
    id: 'review-01',
    customerName: 'Minh Anh',
    serviceName: 'Deep Facial',
    rating: 5,
    comment:
      'Không gian sạch, lịch hẹn rõ ràng và nhân viên tư vấn rất kỹ. Mình thích nhất là quy trình không bị vội.',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    visitedAt: '12/06/2026',
  },
  {
    id: 'review-02',
    customerName: 'Quốc Bảo',
    serviceName: 'Phục hồi cổ vai gáy',
    rating: 5,
    comment:
      'Đặt lịch nhanh, đến nơi không phải chờ lâu. Sau buổi trị liệu cổ vai gáy nhẹ hơn hẳn.',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    visitedAt: '18/06/2026',
  },
  {
    id: 'review-03',
    customerName: 'Hà Linh',
    serviceName: 'Gói thư giãn cuối tuần',
    rating: 4.8,
    comment:
      'Giao diện đặt lịch dễ hiểu, thông tin dịch vụ rõ nên mình chọn được khung giờ phù hợp ngay lần đầu.',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    visitedAt: '24/06/2026',
  },
];

export const homeAboutValues: HomeAboutValue[] = [
  {
    iconType: 'clock',
    title: 'Đúng lịch',
    text: 'Ngày giờ được chọn trước để giảm chờ đợi và nhầm lịch.',
  },
  {
    iconType: 'safety',
    title: 'Rõ thông tin',
    text: 'Dịch vụ hiển thị thời lượng, giá, địa điểm và mô tả liên quan.',
  },
  {
    iconType: 'team',
    title: 'Có đội ngũ',
    text: 'Hệ thống hỗ trợ phân công nhân viên theo dịch vụ và ca làm tại trung tâm.',
  },
  {
    iconType: 'heart',
    title: 'Cảm giác gần gũi',
    text: 'Tông giao diện ấm, sạch và dễ thao tác trên cả desktop lẫn mobile.',
  },
];
