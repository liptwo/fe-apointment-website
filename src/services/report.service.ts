// services/report.service.ts
import api from "../lib/axios";

interface AppointmentStats {
  total: number;
  confirmed: number;
  canceled: number;
}

export const getAppointmentStats = async (): Promise<AppointmentStats> => {
  const response = await api.get<AppointmentStats>("/reports/appointments");
  return response.data;
};
