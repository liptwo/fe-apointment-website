// services/notification.service.ts
import api from '../lib/axios'
import { Notification, SendNotificationPayload, PaginatedData } from '@/types'

export const getMyNotifications = async (
  page?: number,
  limit?: number
): Promise<PaginatedData<Notification>> => {
  const response = await api.get<PaginatedData<Notification>>(
    '/notifications/my',
    {
      params: { page, limit }
    }
  )
  return response.data
}

export const sendNotification = async (
  payload: SendNotificationPayload
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    '/notifications/send',
    payload
  )
  return response.data
}

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await api.patch<Notification>(
    `/notifications/${notificationId}/read`
  )
  return response.data
}

export const markAllNotificationsAsRead = async (): Promise<{
  message: string
}> => {
  const response = await api.patch<{ message: string }>(
    '/notifications/read-all'
  )
  return response.data
}

export const deleteNotification = async (
  notificationId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/notifications/${notificationId}`
  )
  return response.data
}
