'use client'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table'
import { Badge } from '@/src/components/ui/badge'
import {
  getDoctorDashboard,
  getDoctorTodayAppointments
} from '@/src/services/appointment.service'
import { DoctorDashboard, DoctorTodayAppointment } from '@/src/types'
// DashboardHeader now in dashboard/layout.tsx

export default function DoctorDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DoctorDashboard | null>(
    null
  )
  const [todayAppointments, setTodayAppointments] = useState<
    DoctorTodayAppointment[]
  >([])
  const [activeTab, setActiveTab] = useState<'all' | 'today'>('all')

  useEffect(() => {
    if (activeTab === 'all') {
      getDoctorDashboard().then(setDashboardData)
    } else {
      getDoctorTodayAppointments().then(setTodayAppointments)
    }
  }, [activeTab])

  return (
    <div className='min-h-screen bg-background'>
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-4'>
          <div className='flex space-x-4 border-b'>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'all'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
                }`}
              onClick={() => setActiveTab('all')}
            >
              Thống kê tất cả lịch hẹn
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'today'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
                }`}
              onClick={() => setActiveTab('today')}
            >
              Lịch hẹn hôm nay
            </button>
          </div>

          {activeTab === 'all' && (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader>
                  <CardTitle>Tổng số lịch hẹn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold'>
                    {dashboardData?.total}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Đã xác nhận</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold'>
                    {dashboardData?.confirmed}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chờ xác nhận</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold'>
                    {dashboardData?.pending}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Đã hủy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-2xl font-bold'>
                    {dashboardData?.canceled}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'today' && (
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn hôm nay</CardTitle>
                <CardDescription>
                  Danh sách lịch hẹn của bạn hôm nay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bệnh nhận</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead>Ngày đặt lịch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patient_name}</TableCell>
                        <TableCell>{appointment.phone}</TableCell>
                        <TableCell>
                          {appointment.timeslots?.start_time} -{' '}
                          {appointment.timeslots?.end_time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === 'confirmed'
                                ? 'default'
                                : appointment.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.payment_status === 'paid'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {appointment.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            appointment.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
