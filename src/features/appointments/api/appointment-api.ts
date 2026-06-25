import {
  mockAppointments,
  mockServices,
  mockSpecialists,
} from '../constants/appointment-mock-data';
import type { BookingPayload } from '../types/appointment-type';

const delay = (duration = 350) => new Promise((resolve) => window.setTimeout(resolve, duration));

export const appointmentApi = {
  getServices: async () => {
    await delay();

    return {
      data: mockServices,
    };
  },

  getSpecialists: async () => {
    await delay();

    return {
      data: mockSpecialists,
    };
  },

  getBookingHistory: async () => {
    await delay();

    return {
      data: mockAppointments,
    };
  },

  createBooking: async (payload: BookingPayload) => {
    await delay(500);

    return {
      message: 'Đặt lịch thành công',
      data: payload,
    };
  },
};
