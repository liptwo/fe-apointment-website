import React from 'react'
import Link from 'next/link'
import { Heart, Calendar, Users, Shield, ArrowRight } from 'lucide-react'
import { Button } from '@/src/components/ui/button'

export default function HomePage() {
  return (
    <main className='min-h-screen flex flex-col'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Heart className='h-5 w-5' />
              </div>
              <span className='text-xl font-semibold text-foreground'>
                MediCare
              </span>
            </div>
            <div className='flex items-center gap-3'>
              <Button variant='ghost' asChild>
                <Link href='/login'>Đăng Nhập</Link>
              </Button>
              <Button asChild>
                <Link href='/register'>Bắt Đầu</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='flex-1 flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance'>
              Hành trình chăm sóc sức khỏe của bạn bắt đầu từ đây
            </h1>
            <p className='mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty'>
              Kết nối với các chuyên gia chăm sóc sức khỏe và quản lý lịch hẹn y
              tế của bạn một cách dễ dàng. Đặt lịch, theo dõi và nắm bắt thông
              tin về sức khỏe của bạn.
            </p>
            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Button size='lg' asChild className='w-full sm:w-auto'>
                <Link href='/register'>
                  Tạo tài khoản
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='w-full sm:w-auto bg-transparent'
              >
                <Link href='/hosts'>Duyệt danh sách bác sĩ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='border-t border-border bg-card py-16 lg:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-2xl sm:text-3xl font-semibold text-foreground'>
              Tại sao chọn MediCare?
            </h2>
            <p className='mt-3 text-muted-foreground'>
              Mọi thứ bạn cần để quản lý sức khỏe tốt hơn
            </p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            <FeatureCard
              icon={<Calendar className='h-6 w-6' />}
              title='Đặt lịch dễ dàng'
              description='Đặt lịch hẹn chỉ trong vài giây với hệ thống lập lịch trực quan của chúng tôi.'
            />
            <FeatureCard
              icon={<Users className='h-6 w-6' />}
              title='Bác sĩ chuyên gia'
              description='Tiếp cận mạng lưới các chuyên gia chăm sóc sức khỏe được xác minh.'
            />
            <FeatureCard
              icon={<Shield className='h-6 w-6' />}
              title='An toàn & Bảo mật'
              description='Dữ liệu y tế của bạn luôn được bảo vệ bằng bảo mật cấp doanh nghiệp.'
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border py-8'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Heart className='h-4 w-4' />
              <span className='text-sm'>
                &copy; 2026 MediCare. Bảo lưu tất cả các quyền.
              </span>
            </div>
            <div className='flex items-center gap-6 text-sm text-muted-foreground'>
              <Link
                href='/hosts'
                className='hover:text-foreground transition-colors'
              >
                Tìm bác sĩ
              </Link>
              <Link
                href='/login'
                className='hover:text-foreground transition-colors'
              >
                Đăng nhập
              </Link>
              <Link
                href='/register'
                className='hover:text-foreground transition-colors'
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className='flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border'>
      <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4'>
        {icon}
      </div>
      <h3 className='font-medium text-foreground'>{title}</h3>
      <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
    </div>
  )
}
