// services/patient.service.ts
import api from '../lib/axios'
import { Patient, CreatePatientPayload, UpdatePatientPayload } from '../types'

export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get<Patient[]>('/patients')
  return response.data
}

export const createPatient = async (
  payload: CreatePatientPayload
): Promise<Patient> => {
  const response = await api.post<Patient>('/patients', payload)
  return response.data
}

export const updatePatient = async (
  id: string,
  payload: UpdatePatientPayload
): Promise<Patient> => {
  const response = await api.patch<Patient>(`/patients/${id}`, payload)
  return response.data
}

export const deletePatient = async (id: string): Promise<void> => {
  await api.delete(`/patients/${id}`)
}
