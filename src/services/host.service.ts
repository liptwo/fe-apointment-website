// services/host.service.ts
import api from '../lib/axios'
import { AvailabilityRulePayload, Doctor, PaginatedData, User } from '../types'

// TODO: This seems misplaced, consider moving to a dedicated availability service.
export const createAvailabilityRule = async (data: AvailabilityRulePayload) => {
  // The response type is not specified in the doc, using `any` for now.
  const response = await api.post<any>('/availability-rules', data)
  return response.data
}

interface Host extends User {
  specialty: string
  description: string
  address: string
  availabilityRules?: any[] // Define more strictly if needed
}

export const getHosts = async (
  specialty?: string
): Promise<PaginatedData<Host>> => {
  const params = new URLSearchParams()
  if (specialty) {
    params.append('specialty', specialty)
  }

  const response = await api.get<PaginatedData<Host>>(
    `/hosts?${params.toString()}`
  )
  return response.data
}

export const getHostById = async (id: string): Promise<Doctor> => {
  const response = await api.get<Host>(`/hosts/${id}`)
  return response.data
}
