import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

type DateValue = string | number | Date | Dayjs | null | undefined;

const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';
const DEFAULT_DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
const DEFAULT_FALLBACK = 'Chưa cập nhật';

export const formatDate = (
  value?: DateValue,
  fallback = DEFAULT_FALLBACK,
  outputFormat = DEFAULT_DATE_FORMAT,
) => {
  if (!value) {
    return fallback;
  }

  const parsedDate = dayjs(value);

  return parsedDate.isValid() ? parsedDate.format(outputFormat) : String(value);
};

export const formatDateTime = (
  value?: DateValue,
  fallback = DEFAULT_FALLBACK,
  outputFormat = DEFAULT_DATE_TIME_FORMAT,
) => formatDate(value, fallback, outputFormat);

export const formatTime = (value?: string | null, fallback = DEFAULT_FALLBACK) => {
  if (!value) {
    return fallback;
  }

  const parsedDate = dayjs(value);

  if (parsedDate.isValid()) {
    return parsedDate.format('HH:mm');
  }

  return value.length >= 5 ? value.slice(0, 5) : value;
};

export const formatTimeRange = (
  startTime?: string | null,
  endTime?: string | null,
  fallback = DEFAULT_FALLBACK,
) => {
  if (!startTime && !endTime) {
    return fallback;
  }

  if (startTime && endTime) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  if (startTime) {
    return `Từ ${formatTime(startTime)}`;
  }

  return `Đến ${formatTime(endTime)}`;
};

export const formatAppointmentDateTimeRange = (
  startTime: string,
  endTime: string,
  startFormat = DEFAULT_DATE_TIME_FORMAT,
  endFormat = 'HH:mm',
) => {
  const parsedStart = dayjs(startTime);
  const parsedEnd = dayjs(endTime);

  if (!parsedStart.isValid() || !parsedEnd.isValid()) {
    return `${startTime} - ${endTime}`;
  }

  return `${parsedStart.format(startFormat)} - ${parsedEnd.format(endFormat)}`;
};
