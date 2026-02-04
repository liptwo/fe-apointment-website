import React from 'react'
import { RegisterForm } from '@/src/components/register-form'
import { Heart, UserPlus, Stethoscope, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Đăng ký - MediCare',
  description: 'Tạo tài khoản MediCare để bắt đầu quản lý lịch hẹn y tế'
}

export default function RegisterPage() {
  return (
    <main className='min-h-screen flex'>
      {/* Left Panel - Brand & Features */}
      <div className='hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12'>
        <div>
          <Link href='/' className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10'>
              <Heart className='h-5 w-5' />
            </div>
            <span className='text-xl font-semibold'>MediCare</span>
          </Link>
        </div>

        <div className='space-y-8'>
          <div>
            <h1 className='text-4xl font-semibold leading-tight text-balance'>
              Tham gia cộng đồng chăm sóc sức khỏe của chúng tôi
            </h1>
            <p className='mt-4 text-lg text-primary-foreground/80 max-w-md'>
              Dù bạn là bệnh nhân tìm kiếm chăm sóc hay nhà cung cấp dịch vụ,
              MediCare kết nối bạn.
            </p>
          </div>

          <div className='grid gap-4'>
            <FeatureItem
              icon={<UserPlus className='h-5 w-5' />}
              title='Cho Bệnh nhân'
              description='Tìm và đặt lịch hẹn dễ dàng'
            />
            <FeatureItem
              icon={<Stethoscope className='h-5 w-5' />}
              title='Cho Nhà cung cấp'
              description='Quản lý phòng khám của bạn một cách hiệu quả'
            />
            <FeatureItem
              icon={<CalendarCheck className='h-5 w-5' />}
              title='Lập lịch thông minh'
              description='Nhắc nhở tự động và cập nhật'
            />
          </div>
        </div>

        <div className='text-sm text-primary-foreground/60'>
          &copy; 2026 MediCare. Bảo lưu tất cả các quyền.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className='w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12'>
        {/* Mobile Logo */}
        <Link href='/' className='lg:hidden flex items-center gap-3 mb-8'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Heart className='h-5 w-5' />
          </div>
          <span className='text-xl font-semibold text-foreground'>
            MediCare
          </span>
        </Link>

        <RegisterForm />

        <p className='mt-8 text-center text-sm text-muted-foreground'>
          Đã có tài khoản?{' '}
          <Link
            href='/login'
            className='font-medium text-primary underline underline-offset-4 hover:text-primary/90 transition-colors'
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}

function FeatureItem({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className='flex items-start gap-4'>
      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10'>
        {icon}
      </div>
      <div>
        <h3 className='font-medium'>{title}</h3>
        <p className='text-sm text-primary-foreground/70'>{description}</p>
      </div>
    </div>
  )
}
