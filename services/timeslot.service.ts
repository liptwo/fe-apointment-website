import api from "@/lib/axios"

export const getTimeslotsByHostId = async (hostId: string) => {
  const response = await api.get(`/timeslots/host/${hostId}`)
  return response.data
}

export const findTimeslots = async (params: { hostId: string }) => {
  const response = await api.get("/timeslots", { params })
  return response.data
}
