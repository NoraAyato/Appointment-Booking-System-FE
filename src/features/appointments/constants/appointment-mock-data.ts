import type { Appointment, Specialist } from '../types/appointment-type';

const CENTER_LOCATION = 'HomeFeel Center - Quận 1';

export const mockSpecialists: Specialist[] = [
  {
    id: 'sp-01',
    fullName: 'Nguyễn Hà Linh',
    title: 'Chuyên viên tư vấn',
    avatarUrl: 'https://i.pravatar.cc/120?img=5',
    availableServiceIds: ['srv-01', 'srv-03', 'srv-07', 'srv-10', 'srv-12'],
  },
  {
    id: 'sp-02',
    fullName: 'Trần Bảo Nam',
    title: 'Therapist',
    avatarUrl: 'https://i.pravatar.cc/120?img=15',
    availableServiceIds: ['srv-04', 'srv-05', 'srv-09'],
  },
  {
    id: 'sp-03',
    fullName: 'Phạm Ngọc Mai',
    title: 'Skin specialist',
    avatarUrl: 'https://i.pravatar.cc/120?img=23',
    availableServiceIds: ['srv-02', 'srv-06', 'srv-08', 'srv-11'],
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1004',
    serviceName: 'Chăm sóc da chuyên sâu',
    specialistName: 'Phạm Ngọc Mai',
    scheduledAt: '2026-06-28T09:30:00',
    status: 'confirmed',
    location: CENTER_LOCATION,
    price: 520000,
  },
  {
    id: 'apt-0978',
    serviceName: 'Tư vấn dinh dưỡng',
    specialistName: 'Nguyễn Hà Linh',
    scheduledAt: '2026-06-18T14:00:00',
    status: 'completed',
    location: CENTER_LOCATION,
    price: 420000,
  },
  {
    id: 'apt-0944',
    serviceName: 'Vật lý trị liệu',
    specialistName: 'Trần Bảo Nam',
    scheduledAt: '2026-06-05T16:30:00',
    status: 'completed',
    location: CENTER_LOCATION,
    price: 650000,
  },
];
