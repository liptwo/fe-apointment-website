import api from '@/src/lib/axios'
import { TimeSlot } from '@/src/types'

export const getTimeslotsByHostId = async (hostId: string) => {
  const response = await api.get(`/timeslots/host/${hostId}`)
  return response.data
}

export const findTimeslots = async (params: { hostId: string }) => {
  const response = await api.get('/timeslots', { params })
  return response.data
}

export const getTimeslotById = async (id: string): Promise<TimeSlot> => {
  const response = await api.get<TimeSlot>(`/timeslots/${id}`)
  return response.data
}
