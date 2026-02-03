'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Doctor } from '../types'
import { DialogDetailDoctor } from './diaglog-detail-doctor'

interface HostCardProps {
  doctor: Doctor
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(-2)
    .toUpperCase()
}

export function HostCard({ doctor }: HostCardProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <Card className='flex flex-col transition-shadow hover:shadow-lg border-border/60'>
      <CardContent className='px-5'>
        {/* Header with Avatar and Basic Info */}
        <div className='flex gap-4'>
          <Avatar className='h-16 w-16 border-2 border-primary/20'>
            <AvatarImage
              className='object-cover'
              src={doctor.avatar || '/placeholder.svg'}
              alt={doctor.name}
            />
            <AvatarFallback className='bg-primary/10 text-primary font-semibold text-lg'>
              {getInitials(doctor.name)}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-primary hover:underline'>
              <Link href={`/hosts/${doctor.id}`}>
                {doctor.title && (
                  <span className='text-muted-foreground'>{doctor.title} </span>
                )}
                {doctor.name}
              </Link>
            </h3>

            {/* Details Grid */}
            <div className='mt-2 space-y-1.5 text-sm'>
              <div className='flex'>
                <span className='text-muted-foreground w-24 shrink-0'>
                  Chuyên trị:
                </span>
                <span className='text-foreground line-clamp-2'>
                  {doctor.description}
                </span>
              </div>
              {/* <div className='flex'>
                <span className='text-muted-foreground w-24 shrink-0'>
                  Lịch khám:
                </span>
                <span className='text-foreground'>
                  {doctor.schedule || 'Thu 2,3,4,5,6,7'}
                </span>
              </div> */}
              <div className='flex'>
                <span className='text-muted-foreground w-24 shrink-0'>
                  Giá khám:
                </span>
                <span className='text-foreground font-medium'>
                  {doctor.price ? formatPrice(doctor.price) : 'Lien he'}
                </span>
              </div>
              <div className='flex'>
                <span className='text-muted-foreground w-24 shrink-0'>
                  Chuyên khoa:
                </span>
                <Badge
                  variant='outline'
                  className='text-primary border-primary/30 font-normal'
                >
                  {doctor.specialty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic Info */}
        {/* {doctor.clinicName && (
          <div className='mt-4 flex items-start gap-2 text-sm text-muted-foreground'>
            <MapPin className='h-4 w-4 mt-0.5 shrink-0 text-accent' />
            <div>
              <span className='font-medium text-accent'>
                {doctor.clinicName}
              </span>
              {doctor.clinicAddress && (
                <p className='text-xs mt-0.5 line-clamp-1'>
                  {doctor.clinicAddress}
                </p>
              )}
            </div>
          </div>
        )} */}
        <DialogDetailDoctor open={open} setOpen={setOpen} doctor={doctor} />

        {/* Actions */}
        <div className='mt-4 flex items-center justify-between gap-3'>
          <Button
            onClick={() => setOpen(true)}
            variant='outline'
            className='text-sm border-2 p-2 rounded-2xl text-muted-foreground bg-transparent hover:text-primary transition-colors hover:bg-background'
          >
            Xem chi tiết
          </Button>
          {/* <div></div> */}
          <Button
            asChild
            className='bg-accent hover:bg-accent/90 text-accent-foreground px-6'
          >
            <Link
              href={`/booking?doctorId=${doctor.id}&specialty=${doctor.specialtyId}`}
            >
              Đặt ngay
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
