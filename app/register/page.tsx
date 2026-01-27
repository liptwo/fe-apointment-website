import React from 'react'
import { RegisterForm } from '@/components/register-form'
import { Heart, UserPlus, Stethoscope, CalendarCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Register - MediCare',
  description:
    'Create your MediCare account to start managing medical appointments'
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
              Join our healthcare community
            </h1>
            <p className='mt-4 text-lg text-primary-foreground/80 max-w-md'>
              Whether you&apos;re a patient seeking care or a provider offering
              services, MediCare connects you.
            </p>
          </div>

          <div className='grid gap-4'>
            <FeatureItem
              icon={<UserPlus className='h-5 w-5' />}
              title='For Patients'
              description='Find and book appointments easily'
            />
            <FeatureItem
              icon={<Stethoscope className='h-5 w-5' />}
              title='For Providers'
              description='Manage your practice efficiently'
            />
            <FeatureItem
              icon={<CalendarCheck className='h-5 w-5' />}
              title='Smart Scheduling'
              description='Automated reminders and updates'
            />
          </div>
        </div>

        <div className='text-sm text-primary-foreground/60'>
          &copy; 2026 MediCare. All rights reserved.
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
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-primary underline underline-offset-4 hover:text-primary/90 transition-colors'
          >
            Sign in
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
