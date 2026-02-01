'use client'

import React, { useState } from 'react'
import {
  Plus,
  Search,
  Bell,
  CalendarDays,
  CheckCircle2,
  Hourglass,
  Stethoscope,
  Printer,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter
} from 'lucide-react'
import { Appointment, AppointmentStatus } from '@/src/types'

// Dữ liệu mẫu (Mock Data)
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '09:00 AM',
    patientName: 'Jane Doe',
    patientId: '#84920',
    phone: '(555) 123-4567',
    doctorName: 'Dr. Sarah Wilson',
    doctorAvatar: '/docs/dr1.jpg',
    status: 'Scheduled',
    initials: 'JD'
  },
  {
    id: '2',
    time: '09:15 AM',
    patientName: 'John Smith',
    patientId: '#93210',
    phone: '(555) 987-6543',
    doctorName: 'Dr. James Carter',
    doctorAvatar: '/docs/dr2.jpg',
    status: 'Late',
    initials: 'JS'
  },
  {
    id: '3',
    time: '09:30 AM',
    patientName: 'Alice Stone',
    patientId: '#74839',
    phone: '(555) 345-6789',
    doctorName: 'Dr. Sarah Wilson',
    doctorAvatar: '/docs/dr1.jpg',
    status: 'Checked-in',
    initials: 'AS'
  },
  {
    id: '4',
    time: '08:45 AM',
    patientName: 'Robert Fox',
    patientId: '#11204',
    phone: '(555) 234-5678',
    doctorName: 'Dr. Emily Chen',
    doctorAvatar: '/docs/dr3.jpg',
    status: 'In-consultation',
    initials: 'RF'
  }
]

export default function ReceptionPage() {
  const [filter, setFilter] = useState<string>('All')

  return (
    <div className='min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-sans'>
      {/* Top Navigation */}
      <header className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50'>
        <div className='px-6 md:px-10 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-4 text-slate-900 dark:text-white'>
            <div className='w-8 h-8 text-blue-600 flex items-center justify-center bg-blue-600/10 rounded-lg'>
              <Plus size={20} />
            </div>
            <h2 className='text-lg font-bold tracking-tight'>
              Reception Dashboard
            </h2>
          </div>
          <nav className='hidden md:flex items-center gap-8'>
            <div className='flex items-center gap-6 text-sm font-medium'>
              <a href='#' className='text-slate-500'>
                Dashboard
              </a>
              <a
                href='#'
                className='text-blue-600 border-b-2 border-blue-600 pb-1'
              >
                Queue
              </a>
              <a href='#' className='text-slate-500'>
                Schedule
              </a>
              <a href='#' className='text-slate-500'>
                Patients
              </a>
            </div>
            <div className='flex items-center gap-4 border-l pl-6'>
              <button className='relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition'>
                <Bell size={20} />
                <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white'></span>
              </button>
              <div className='w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden'>
                <img
                  src='https://avatar.iran.liara.run/public/receptionist'
                  alt='Avatar'
                />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className='max-w-[1440px] mx-auto p-6 md:p-10 space-y-8'>
        {/* Page Header & Actions */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
              Patient Check-in Queue
            </h1>
            <p className='text-slate-500 font-medium'>
              Today, Oct 24 •{' '}
              <span className='text-blue-600 font-bold'>42 Appointments</span>
            </p>
          </div>
          <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all font-bold text-sm'>
            <Plus size={18} />
            Add New Appointment
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            label='Total Appointments'
            value='42'
            icon={<CalendarDays size={20} />}
            color='blue'
          />
          <StatCard
            label='Checked In'
            value='12'
            icon={<CheckCircle2 size={20} />}
            color='green'
          />
          <StatCard
            label='Waiting Room'
            value='5'
            icon={<Hourglass size={20} />}
            color='orange'
          />
          <StatCard
            label='In Consultation'
            value='7'
            icon={<Stethoscope size={20} />}
            color='purple'
          />
        </div>

        {/* Main Table Card */}
        <div className='bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col'>
          {/* Filters Bar */}
          <div className='p-4 border-b flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800'>
            <div className='flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full lg:w-auto'>
              {[
                'All',
                'Scheduled',
                'Checked-in',
                'In-consultation',
                'Completed'
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    filter === tab
                      ? 'bg-white shadow-sm text-slate-900'
                      : 'text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className='flex gap-3 w-full lg:w-auto'>
              <div className='relative flex-1 lg:w-64'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <input
                  className='w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20'
                  placeholder='Search patients...'
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-slate-50/50 text-slate-400 text-[11px] uppercase font-bold tracking-wider'>
                <tr>
                  <th className='px-6 py-4'>Time</th>
                  <th className='px-6 py-4'>Patient Name</th>
                  <th className='px-6 py-4'>Phone Number</th>
                  <th className='px-6 py-4'>Doctor</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 dark:divide-slate-700'>
                {MOCK_APPOINTMENTS.map((apt) => (
                  <tr
                    key={apt.id}
                    className='group hover:bg-slate-50/50 transition-colors'
                  >
                    <td className='px-6 py-4 font-semibold text-slate-900 dark:text-white'>
                      {apt.time}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase'>
                          {apt.initials}
                        </div>
                        <div>
                          <p className='font-bold text-slate-900 dark:text-white'>
                            {apt.patientName}
                          </p>
                          <p className='text-[11px] text-slate-400'>
                            ID: {apt.patientId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-slate-500 font-mono text-xs'>
                      {apt.phone}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-6 h-6 rounded-full bg-slate-200 overflow-hidden'>
                          <img
                            src={`https://avatar.iran.liara.run/public/job/doctor?r=${apt.id}`}
                            alt='Doc'
                          />
                        </div>
                        <span className='text-sm font-medium text-slate-700'>
                          {apt.doctorName}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-end gap-2'>
                        <button className='p-2 text-slate-400 hover:text-blue-600 transition'>
                          <Printer size={18} />
                        </button>
                        {apt.status === 'Scheduled' || apt.status === 'Late' ? (
                          <button className='px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20'>
                            Check-in
                          </button>
                        ) : (
                          <button className='px-4 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50'>
                            Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- Sub-components ---

function StatCard({
  label,
  value,
  icon,
  color
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20'
  }

  return (
    <div className='bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]'>
      <div>
        <p className='text-slate-400 text-xs font-bold uppercase tracking-wider mb-1'>
          {label}
        </p>
        <p className='text-3xl font-black text-slate-900 dark:text-white'>
          {value}
        </p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-50 text-blue-600 border-blue-100',
    Late: 'bg-red-50 text-red-600 border-red-100',
    'Checked-in': 'bg-green-50 text-green-600 border-green-100',
    'In-consultation': 'bg-purple-50 text-purple-600 border-purple-100',
    Completed: 'bg-slate-50 text-slate-500 border-slate-100',
    Cancelled: 'bg-slate-100 text-slate-400 border-slate-200'
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${styles[status]}`}
    >
      {status}
    </span>
  )
}
