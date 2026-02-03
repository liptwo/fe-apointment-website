import api from '@/src/lib/axios'

export const getAllSpecialty = async () => {
  const response = await api.get(`/specialties`)
  return response.data
}
