import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type { PublicServiceAvailableTimeSlotModel } from '../types/public-service-type';

export const normalizeApiTime = (time: string) => (time.length === 5 ? `${time}:00` : time);

export const getApiTimeValue = (time?: Dayjs | null) => time?.format('HH:mm:ss');

export const getCurrentBookingTime = () => dayjs().second(0).millisecond(0);

export const formatSlotTime = (time: string) => normalizeApiTime(time).slice(0, 5);

export const isDateBeforeToday = (date: Dayjs) => date.isBefore(dayjs().startOf('day'));

export const parseBookingDate = (date?: string) => {
  const parsedDate = date ? dayjs(date) : null;

  return parsedDate?.isValid() ? parsedDate : dayjs();
};

export const parseBookingTime = (time?: string) => {
  const [hour, minute] = time?.split(':').map(Number) ?? [];

  if (Number.isInteger(hour) && Number.isInteger(minute)) {
    return dayjs().hour(hour).minute(minute).second(0).millisecond(0);
  }

  return getCurrentBookingTime();
};

export const parseApiTime = (time: string) => {
  const parsedTime = dayjs(`2026-01-01T${normalizeApiTime(time)}`);

  return parsedTime.isValid() ? parsedTime : null;
};

export const isSameTimeValue = (time: Dayjs | null | undefined, apiTime: string) =>
  getApiTimeValue(time) === normalizeApiTime(apiTime);

export const isPastTimeSlot = (date: string, slot: PublicServiceAvailableTimeSlotModel) => {
  const selectedDate = dayjs(date);

  if (!selectedDate.isSame(dayjs(), 'day')) {
    return false;
  }

  const slotStartDateTime = dayjs(`${date}T${normalizeApiTime(slot.startTime)}`);

  return slotStartDateTime.isBefore(dayjs(), 'minute');
};

export const getSelectableTimeSlots = (
  slots: PublicServiceAvailableTimeSlotModel[],
  date: string,
) => slots.filter((slot) => slot.availableStaffCount > 0 && !isPastTimeSlot(date, slot));

export const getPreferredTimeSlotValue = (
  currentTime: Dayjs | null,
  slots: PublicServiceAvailableTimeSlotModel[],
) => {
  if (!slots.length) {
    return null;
  }

  const exactSlot = slots.find((slot) => isSameTimeValue(currentTime, slot.startTime));

  if (exactSlot) {
    return parseApiTime(exactSlot.startTime);
  }

  const currentTimeValue = getApiTimeValue(currentTime);
  const nextSlot = currentTimeValue
    ? slots.find((slot) => normalizeApiTime(slot.startTime) >= currentTimeValue)
    : undefined;

  return parseApiTime((nextSlot ?? slots[0]).startTime);
};
