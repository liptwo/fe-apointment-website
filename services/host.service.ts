// services/host.service.ts
import api from "../lib/axios";
import { AvailabilityRulePayload } from "../types";

export const createAvailabilityRule = async (data: AvailabilityRulePayload) => {
  // The response type is not specified in the doc, using `any` for now.
  const response = await api.post<any>("/availability-rules", data);
  return response.data;
};
