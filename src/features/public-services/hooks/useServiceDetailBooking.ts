import type { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { getApiErrorMessage } from '@/shared/utils/api-error';

import { publicServiceApi } from '../api/public-service-api';
import type {
  PublicServiceAvailableTimeSlotModel,
  PublicServiceStaffModel,
} from '../types/public-service-type';
import {
  getApiTimeValue,
  getPreferredTimeSlotValue,
  getSelectableTimeSlots,
  isSameTimeValue,
} from '../utils/public-service-time';

interface UseServiceDetailBookingParams {
  initialDate: Dayjs;
  initialTime: Dayjs;
  serviceId?: string;
}

export function useServiceDetailBooking({
  initialDate,
  initialTime,
  serviceId,
}: UseServiceDetailBookingParams) {
  const [date, setDate] = useState<Dayjs | null>(initialDate);
  const [time, setTime] = useState<Dayjs | null>(initialTime);
  const [timeSlots, setTimeSlots] = useState<PublicServiceAvailableTimeSlotModel[]>([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [timeSlotsError, setTimeSlotsError] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>();
  const [staffList, setStaffList] = useState<PublicServiceStaffModel[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  const selectedDate = date?.format('YYYY-MM-DD');
  const selectedTime = getApiTimeValue(time);
  const selectedTimeSlotAvailable = timeSlots.some((slot) => isSameTimeValue(time, slot.startTime));
  const selectedStaff = staffList.find((staff) => staff.id === selectedStaffId);

  const fetchTimeSlotData = useCallback(async () => {
    if (!serviceId || !selectedDate) {
      setTimeSlots([]);
      setTime(null);
      setTimeSlotsError(null);
      return;
    }

    setTimeSlotsLoading(true);
    setTimeSlotsError(null);

    try {
      const response = await publicServiceApi.getAvailableTimeSlots({
        date: selectedDate,
        serviceId,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải khung giờ trống.');
      }

      const selectableTimeSlots = getSelectableTimeSlots(response.data, selectedDate);

      setTimeSlots(selectableTimeSlots);
      setTime((currentTime) => getPreferredTimeSlotValue(currentTime, selectableTimeSlots));
      setSelectedStaffId(undefined);
    } catch (fetchError) {
      setTimeSlots([]);
      setTime(null);
      setSelectedStaffId(undefined);
      setTimeSlotsError(getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'));
    } finally {
      setTimeSlotsLoading(false);
    }
  }, [selectedDate, serviceId]);

  useEffect(() => {
    void fetchTimeSlotData();
  }, [fetchTimeSlotData]);

  const fetchStaffData = useCallback(async () => {
    if (!serviceId || !selectedDate || !selectedTime || !selectedTimeSlotAvailable) {
      setStaffList([]);
      setSelectedStaffId(undefined);
      setStaffError(null);
      return;
    }

    setStaffLoading(true);
    setStaffError(null);

    try {
      const response = await publicServiceApi.getAvailableStaff({
        date: selectedDate,
        serviceId,
        time: selectedTime,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách nhân viên.');
      }

      setStaffList(response.data);
      setSelectedStaffId((currentStaffId) => {
        const currentStaffStillAvailable = response.data.some(
          (staff) => staff.id === currentStaffId,
        );

        return currentStaffStillAvailable ? currentStaffId : response.data[0]?.id;
      });
    } catch (fetchError) {
      setStaffList([]);
      setSelectedStaffId(undefined);
      setStaffError(getApiErrorMessage(fetchError, 'Vui lòng thử lại sau.'));
    } finally {
      setStaffLoading(false);
    }
  }, [selectedDate, selectedTime, selectedTimeSlotAvailable, serviceId]);

  useEffect(() => {
    void fetchStaffData();
  }, [fetchStaffData]);

  const handleDateChange = (nextDate: Dayjs | null) => {
    setDate(nextDate);
    setTime(null);
    setTimeSlots([]);
    setSelectedStaffId(undefined);
    setStaffList([]);
    setStaffError(null);
  };

  return {
    date,
    fetchStaffData,
    fetchTimeSlotData,
    handleDateChange,
    selectedStaff,
    selectedStaffId,
    setSelectedStaffId,
    setTime,
    staffError,
    staffList,
    staffLoading,
    time,
    timeSlots,
    timeSlotsError,
    timeSlotsLoading,
  };
}
