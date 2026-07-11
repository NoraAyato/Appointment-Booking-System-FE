import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  ReloadOutlined,
  StarFilled,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import type { Dayjs } from 'dayjs';

import type {
  PublicServiceAvailableTimeSlotModel,
  PublicServiceStaffModel,
} from '../types/public-service-type';
import {
  formatSlotTime,
  isDateBeforeToday,
  isSameTimeValue,
  parseApiTime,
} from '../utils/public-service-time';

interface ServiceBookingPanelProps {
  date: Dayjs | null;
  loading?: boolean;
  onBook: () => void;
  onDateChange: (date: Dayjs | null) => void;
  onStaffChange: (staffId: string) => void;
  onStaffRetry?: () => void;
  onTimeSlotRetry?: () => void;
  onTimeChange: (time: Dayjs | null) => void;
  selectedStaffId?: string;
  staffError?: string | null;
  staffList: PublicServiceStaffModel[];
  staffLoading?: boolean;
  time: Dayjs | null;
  timeSlots: PublicServiceAvailableTimeSlotModel[];
  timeSlotsError?: string | null;
  timeSlotsLoading?: boolean;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getStaffSubtitle = (staff: PublicServiceStaffModel) =>
  staff.specialties.length ? staff.specialties.slice(0, 2).join(', ') : 'Nhân viên HomeFeel';

export function ServiceBookingPanel({
  date,
  loading,
  onBook,
  onDateChange,
  onStaffChange,
  onStaffRetry,
  onTimeSlotRetry,
  onTimeChange,
  selectedStaffId,
  staffError,
  staffList,
  staffLoading = false,
  time,
  timeSlots,
  timeSlotsError,
  timeSlotsLoading = false,
}: ServiceBookingPanelProps) {
  const selectedStaff = staffList.find((staff) => staff.id === selectedStaffId);
  const shouldShowStaffList = Boolean(date && time && !staffLoading && !staffError);

  return (
    <Card className="service-booking-panel">
      <Typography.Text className="!font-semibold uppercase tracking-[0.14em] !text-sage">
        Đặt lịch dịch vụ
      </Typography.Text>
      <Typography.Title level={3} className="!mb-2 !mt-2">
        Chọn thời gian và nhân viên
      </Typography.Title>
      <Typography.Paragraph className="!text-slate-500">
        Nhân viên phụ trách sẽ được lấy theo ngày và giờ bạn chọn.
      </Typography.Paragraph>

      <div className="mb-4">
        <div>
          <Typography.Text className="mb-2 block !font-semibold">Ngày</Typography.Text>
          <DatePicker
            className="w-full"
            disabledDate={isDateBeforeToday}
            format="DD/MM/YYYY"
            onChange={onDateChange}
            suffixIcon={<CalendarOutlined />}
            value={date}
          />
        </div>
      </div>

      <div className="service-time-slot-header">
        <Typography.Text className="!font-semibold">Khung giờ khả dụng</Typography.Text>
      </div>

      {!date ? (
        <Empty className="mt-4" description="Chọn ngày để xem khung giờ phù hợp" />
      ) : timeSlotsLoading ? (
        <div className="grid min-h-[132px] place-items-center">
          <Spin />
        </div>
      ) : timeSlotsError ? (
        <Empty className="mt-4" description={timeSlotsError}>
          {onTimeSlotRetry ? (
            <Button icon={<ReloadOutlined />} onClick={onTimeSlotRetry}>
              Tải lại khung giờ
            </Button>
          ) : null}
        </Empty>
      ) : timeSlots.length ? (
        <div className="service-time-slot-grid">
          {timeSlots.map((slot) => {
            const isSelected = isSameTimeValue(time, slot.startTime);

            return (
              <button
                className={`service-time-slot ${isSelected ? 'selected' : ''}`}
                key={`${slot.startTime}-${slot.endTime}`}
                onClick={() => onTimeChange(parseApiTime(slot.startTime))}
                type="button"
              >
                <span>
                  <ClockCircleOutlined />
                  {formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}
                </span>
                <small>{slot.availableStaffCount} nhân viên</small>
              </button>
            );
          })}
        </div>
      ) : (
        <Empty className="mt-4" description="Không có khung giờ khả dụng cho ngày này" />
      )}

      <div className="service-staff-list-header">
        <Typography.Text className="!font-semibold">Nhân viên phụ trách</Typography.Text>
      </div>

      {!date || !time ? (
        <Empty className="mt-4" description="Chọn ngày và khung giờ để xem nhân viên phù hợp" />
      ) : staffLoading ? (
        <div className="grid min-h-[180px] place-items-center">
          <Spin />
        </div>
      ) : staffError ? (
        <Empty className="mt-4" description={staffError}>
          {onStaffRetry ? (
            <Button icon={<ReloadOutlined />} onClick={onStaffRetry}>
              Tải lại nhân viên
            </Button>
          ) : null}
        </Empty>
      ) : shouldShowStaffList && staffList.length ? (
        <div className="service-staff-list">
          {staffList.map((staff) => {
            const isSelected = staff.id === selectedStaffId;

            return (
              <button
                className={`service-staff-option ${isSelected ? 'selected' : ''}`}
                key={staff.id}
                onClick={() => onStaffChange(staff.id)}
                type="button"
              >
                <Avatar size={46} src={staff.avatarUrl}>
                  {getInitials(staff.name)}
                </Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <Typography.Text className="block !font-semibold !text-ink">
                      {staff.name}
                    </Typography.Text>
                    {isSelected ? <Tag color="gold">Đang chọn</Tag> : null}
                  </div>
                  <Typography.Text className="block truncate !text-sm !text-slate-500">
                    {getStaffSubtitle(staff)}
                  </Typography.Text>
                  <Space size={10} className="mt-1 service-staff-meta">
                    <span>
                      <StarFilled /> {staff.rating}
                    </span>
                    <span>{staff.completedServices}+ lịch hẹn</span>
                  </Space>
                  {staff.specialties.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {staff.specialties.slice(0, 3).map((specialty) => (
                        <Tag key={specialty} className="!m-0">
                          {specialty}
                        </Tag>
                      ))}
                    </div>
                  ) : null}
                </div>
                {isSelected ? <CheckCircleFilled className="service-staff-check" /> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <Empty className="mt-4" description="Không có nhân viên phù hợp với thời gian này" />
      )}

      <Button
        block
        className="mt-5"
        disabled={!date || !time || !selectedStaff}
        loading={loading}
        onClick={onBook}
        size="large"
        type="primary"
      >
        Đặt dịch vụ
      </Button>
    </Card>
  );
}
