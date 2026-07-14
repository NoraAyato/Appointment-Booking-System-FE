import { Empty, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import type { CSSProperties } from 'react';

import { formatTimeRange } from '@/shared/utils/date-format';

import {
  getStaffAppointmentStatusMeta,
  getStaffApprovalStatusMeta,
  staffScheduleEventMeta,
} from '../constants/staff-dashboard-options';
import type { StaffScheduleEvent } from '../types/staff-dashboard-type';

interface StaffScheduleBoardProps {
  dateRange: [Dayjs, Dayjs];
  events: StaffScheduleEvent[];
}

const getDateRange = ([startDate, endDate]: [Dayjs, Dayjs]) => {
  const days: Dayjs[] = [];
  let cursor = startDate.startOf('day');
  const finalDate = endDate.startOf('day');

  while (cursor.isBefore(finalDate) || cursor.isSame(finalDate)) {
    days.push(cursor);
    cursor = cursor.add(1, 'day');
  }

  return days;
};

const getStatusTag = (event: StaffScheduleEvent) => {
  const meta =
    event.type === 'APPOINTMENT'
      ? getStaffAppointmentStatusMeta(event.status)
      : getStaffApprovalStatusMeta(event.status);

  return (
    <Tag className="!m-0" color={meta.color}>
      {meta.label}
    </Tag>
  );
};

export function StaffScheduleBoard({ dateRange, events }: StaffScheduleBoardProps) {
  const days = getDateRange(dateRange);
  const eventsByDate = events.reduce<Record<string, StaffScheduleEvent[]>>((result, event) => {
    result[event.date] = [...(result[event.date] ?? []), event];

    return result;
  }, {});

  return (
    <div className="staff-schedule-board">
      {days.map((day) => {
        const dayKey = day.format('YYYY-MM-DD');
        const dayEvents = [...(eventsByDate[dayKey] ?? [])].sort((first, second) =>
          String(first.startTime ?? '00:00:00').localeCompare(String(second.startTime ?? '00:00:00')),
        );

        return (
          <div key={dayKey} className="staff-schedule-day">
            <div className="staff-schedule-day-header">
              <Typography.Text strong>{day.format('ddd')}</Typography.Text>
              <span>{day.format('DD/MM')}</span>
            </div>

            <div className="staff-schedule-day-body">
              {dayEvents.length ? (
                dayEvents.map((event) => {
                  const meta = staffScheduleEventMeta[event.type];
                  const eventKey =
                    event.appointmentDetailId ?? event.blockedSlotId ?? event.shiftId ?? event.title;

                  return (
                    <article
                      key={`${event.type}-${eventKey}`}
                      className={`staff-schedule-event ${event.type.toLowerCase()}`}
                      style={{ '--event-color': meta.color } as CSSProperties}
                    >
                      <div className="staff-schedule-event-top">
                        <span>{formatTimeRange(event.startTime, event.endTime, 'Cả ngày')}</span>
                        {getStatusTag(event)}
                      </div>
                      <Typography.Text strong className="staff-schedule-event-title">
                        {event.title || meta.label}
                      </Typography.Text>
                      {event.customerName ? (
                        <Typography.Text className="staff-schedule-event-subtitle">
                          {event.customerName}
                          {event.customerPhone ? ` · ${event.customerPhone}` : ''}
                        </Typography.Text>
                      ) : null}
                      {event.reason ? (
                        <Typography.Text className="staff-schedule-event-subtitle">
                          {event.reason}
                        </Typography.Text>
                      ) : null}
                    </article>
                  );
                })
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
