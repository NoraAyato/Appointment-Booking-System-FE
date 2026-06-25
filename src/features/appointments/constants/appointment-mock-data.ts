import type { Appointment, Service, Specialist } from '../types/appointment-type';

export const mockServices: Service[] = [
  {
    id: 'srv-01',
    name: 'Tư vấn sức khỏe tổng quát',
    category: 'Clinic',
    durationMinutes: 45,
    price: 350000,
    rating: 4.9,
    description: 'Buổi tư vấn cá nhân với lịch hẹn linh hoạt và hồ sơ theo dõi rõ ràng.',
    accentColor: '#2f7d67',
  },
  {
    id: 'srv-02',
    name: 'Chăm sóc da chuyên sâu',
    category: 'Wellness',
    durationMinutes: 60,
    price: 520000,
    rating: 4.8,
    description: 'Liệu trình thư giãn, soi da và đề xuất routine chăm sóc phù hợp.',
    accentColor: '#de7d62',
  },
  {
    id: 'srv-03',
    name: 'Tư vấn dinh dưỡng',
    category: 'Nutrition',
    durationMinutes: 50,
    price: 420000,
    rating: 4.7,
    description: 'Kế hoạch ăn uống thực tế theo mục tiêu sức khỏe và lịch sinh hoạt.',
    accentColor: '#d99530',
  },
  {
    id: 'srv-04',
    name: 'Vật lý trị liệu',
    category: 'Therapy',
    durationMinutes: 70,
    price: 650000,
    rating: 4.9,
    description: 'Đánh giá vận động, giảm đau và phục hồi thể trạng cùng chuyên viên.',
    accentColor: '#445c8f',
  },
];

export const mockSpecialists: Specialist[] = [
  {
    id: 'sp-01',
    fullName: 'Nguyễn Hà Linh',
    title: 'Chuyên viên tư vấn',
    avatarUrl: 'https://i.pravatar.cc/120?img=5',
    availableServiceIds: ['srv-01', 'srv-03'],
  },
  {
    id: 'sp-02',
    fullName: 'Trần Bảo Nam',
    title: 'Therapist',
    avatarUrl: 'https://i.pravatar.cc/120?img=15',
    availableServiceIds: ['srv-04', 'srv-01'],
  },
  {
    id: 'sp-03',
    fullName: 'Phạm Ngọc Mai',
    title: 'Skin specialist',
    avatarUrl: 'https://i.pravatar.cc/120?img=23',
    availableServiceIds: ['srv-02'],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1004',
    serviceName: 'Chăm sóc da chuyên sâu',
    specialistName: 'Phạm Ngọc Mai',
    scheduledAt: '2026-06-28T09:30:00',
    status: 'confirmed',
    location: 'YoEdu Wellness - Quận 3',
    price: 520000,
  },
  {
    id: 'apt-0978',
    serviceName: 'Tư vấn dinh dưỡng',
    specialistName: 'Nguyễn Hà Linh',
    scheduledAt: '2026-06-18T14:00:00',
    status: 'completed',
    location: 'Tư vấn online',
    price: 420000,
  },
  {
    id: 'apt-0944',
    serviceName: 'Vật lý trị liệu',
    specialistName: 'Trần Bảo Nam',
    scheduledAt: '2026-06-05T16:30:00',
    status: 'completed',
    location: 'YoEdu Clinic - Quận 1',
    price: 650000,
  },
];

export const timeSlots = ['08:30', '09:30', '10:30', '13:30', '14:30', '16:00', '17:00'];
