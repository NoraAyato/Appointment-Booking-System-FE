import type { PromotionCardModel } from '../types/promotion-type';

export const PROMOTION_PAGE_SIZE = 6;

export const promotionStatusLabels: Record<PromotionCardModel['status'], string> = {
  ACTIVE: 'Đang áp dụng',
  ENDING_SOON: 'Sắp kết thúc',
  UPCOMING: 'Sắp mở',
};

export const promotionMockData: PromotionCardModel[] = [
  {
    id: 'promo-glow-20',
    accentColor: '#2F7D67',
    code: 'GLOW20',
    description:
      'Ưu đãi cho khách lần đầu chọn các dịch vụ chăm sóc da tại HomeFeel Center.',
    discountLabel: 'Giảm 20%',
    endDate: '2026-07-31',
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    minSpend: 300000,
    startDate: '2026-07-01',
    status: 'ACTIVE',
    title: 'Làn da sáng khỏe',
  },
  {
    id: 'promo-spa-reset',
    accentColor: '#D99530',
    code: 'RESET150',
    description:
      'Trừ trực tiếp cho lịch Body Spa hoặc các gói thư giãn từ 90 phút trở lên.',
    discountLabel: 'Giảm 150K',
    endDate: '2026-07-24',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80',
    minSpend: 500000,
    startDate: '2026-07-05',
    status: 'ENDING_SOON',
    title: 'Reset cuối tuần',
  },
  {
    id: 'promo-hair-care',
    accentColor: '#DE7D62',
    code: 'HAIRDUO',
    description:
      'Combo cắt tóc và phục hồi nhẹ cho khách đặt lịch trong khung giờ buổi sáng.',
    discountLabel: 'Combo tiết kiệm',
    endDate: '2026-08-10',
    imageUrl:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    startDate: '2026-07-12',
    status: 'UPCOMING',
    title: 'Tóc gọn ngày mới',
  },
  {
    id: 'promo-nail-shine',
    accentColor: '#8B5CF6',
    code: 'NAIL15',
    description:
      'Dành cho dịch vụ gel manicure và chăm sóc móng trong tháng tri ân khách hàng.',
    discountLabel: 'Giảm 15%',
    endDate: '2026-08-05',
    imageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    minSpend: 200000,
    startDate: '2026-07-03',
    status: 'ACTIVE',
    title: 'Móng xinh bền màu',
  },
  {
    id: 'promo-afterwork',
    accentColor: '#0EA5E9',
    code: 'AFTERWORK',
    description:
      'Ưu đãi nhẹ cho lịch đặt sau giờ làm, phù hợp khách cần thư giãn nhanh.',
    discountLabel: 'Giảm 80K',
    endDate: '2026-08-20',
    imageUrl:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    minSpend: 350000,
    startDate: '2026-07-08',
    status: 'ACTIVE',
    title: 'Thư giãn sau giờ làm',
  },
  {
    id: 'promo-family-day',
    accentColor: '#F97316',
    code: 'FAMILYDAY',
    description:
      'Đặt từ hai lịch trong cùng ngày cho người thân để nhận ưu đãi combo tại trung tâm.',
    discountLabel: 'Ưu đãi nhóm',
    endDate: '2026-08-15',
    imageUrl:
      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=900&q=80',
    minSpend: 650000,
    startDate: '2026-07-10',
    status: 'ACTIVE',
    title: 'Ngày chăm sóc gia đình',
  },
  {
    id: 'promo-facial-plus',
    accentColor: '#14B8A6',
    code: 'FACIALPLUS',
    description:
      'Tặng bước chăm sóc chuyên sâu khi đặt lịch facial trong các ngày đầu tuần.',
    discountLabel: 'Tặng bước chăm sóc',
    endDate: '2026-09-01',
    imageUrl:
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=900&q=80',
    startDate: '2026-07-15',
    status: 'UPCOMING',
    title: 'Facial đầu tuần',
  },
  {
    id: 'promo-spa-25',
    accentColor: '#22C55E',
    code: 'SPA25',
    description:
      'Giảm sâu cho các lịch spa trưa và đầu giờ chiều trong khung ngày thấp điểm.',
    discountLabel: 'Giảm 25%',
    endDate: '2026-07-22',
    imageUrl:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
    minSpend: 450000,
    startDate: '2026-07-01',
    status: 'ENDING_SOON',
    title: 'Spa giờ vàng',
  },
  {
    id: 'promo-care-100',
    accentColor: '#64748B',
    code: 'CARE100',
    description:
      'Trừ trực tiếp cho mọi dịch vụ khi khách đặt lịch online và thanh toán tại quầy.',
    discountLabel: 'Giảm 100K',
    endDate: '2026-08-31',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    minSpend: 400000,
    startDate: '2026-07-11',
    status: 'ACTIVE',
    title: 'Đặt online nhận ưu đãi',
  },
  {
    id: 'promo-weekend-touch',
    accentColor: '#EC4899',
    code: 'WEEKEND',
    description:
      'Ưu đãi cho khách đặt lịch cuối tuần từ hai dịch vụ chăm sóc trở lên.',
    discountLabel: 'Giảm 18%',
    endDate: '2026-09-05',
    imageUrl:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    minSpend: 550000,
    startDate: '2026-07-20',
    status: 'UPCOMING',
    title: 'Weekend chăm chút',
  },
];
