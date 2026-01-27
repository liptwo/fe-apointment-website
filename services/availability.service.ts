import api from "@/lib/axios"

export const createAvailabilityRule = async (data: any) => {
  const response = await api.post("/availability-rules", data)
  return response.data
}

export const generateTimeslots = async (data: any) => {
  const response = await api.post("/timeslots/generate", data)
  return response.data
}

export const getAvailabilityRules = async (hostId: string) => {
  const response = await api.get(`/availability-rules/${hostId}`)
  return response.data
}

