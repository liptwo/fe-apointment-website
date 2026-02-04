'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, addDays, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Calendar,
  FileText,
  Heart,
  Brain,
  Eye,
  Ear,
  Bone,
  Baby,
  Stethoscope,
  Activity,
  Pill,
  Scissors,
  Smile,
  Leaf,
  Zap,
  Shield,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  TreeDeciduous,
  UserRound,
  HeartPulse,
  Microscope,
  Syringe,
  Ribbon,
  Dna,
  Footprints,
  Hand,
  Sparkles
} from 'lucide-react'
import { AppHeader } from '@/src/components/app-header'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import { Skeleton } from '@/src/components/ui/skeleton'
import { cn } from '@/src/lib/utils'
import { HOST_SPECIALTIES } from '@/src/utils/constants'
import { Subject } from '@/src/types'

export default function BookPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectSpecialty = (specialty: Subject) => {
    router.push(`/booking?specialty=${specialty.id}`)
  }
  // Filter specialties based on search
  const filteredSpecialties = HOST_SPECIALTIES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />

      <main className='container mx-auto px-4 py-6'>
        {/* Breadcrumb */}
        <nav className='mb-6 text-sm'>
          <ol className='flex items-center gap-2'>
            <li>
              <Link
                href='/'
                className='text-muted-foreground hover:text-foreground'
              >
                Trang chủ
              </Link>
            </li>
            <li className='text-muted-foreground'>/</li>
            <li className='text-primary font-medium'>Đặt khám chuyên khoa</li>
          </ol>
        </nav>

        {/* Step 1: Select Specialty */}
        <div className='max-w-5xl mx-auto'>
          {/* Search Bar */}
          <div className='mb-8 max-w-xl mx-auto'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Tìm kiếm chuyên khoa...'
                value={searchQuery}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> }
                }) => setSearchQuery(e.target.value)}
                className='pl-12 h-12 text-base rounded-full border-2 border-muted bg-card'
              />
            </div>
          </div>

          {/* Specialty Grid */}
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4'>
            {filteredSpecialties.map((specialty) => {
              const IconComponent = specialty.icon
              return (
                <button
                  key={specialty.id}
                  type='button'
                  onClick={() => handleSelectSpecialty(specialty)}
                  className='group flex flex-col items-center p-4 rounded-xl hover:bg-primary/5 transition-colors'
                >
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 group-hover:bg-sky-100 transition-colors mb-3'>
                    <img
                      src={specialty.icon}
                      alt={specialty.name}
                      width={30}
                      height={30}
                      className='h-full w-full object-contain'
                    />
                  </div>
                  <span className='text-sm text-center text-foreground font-medium leading-tight'>
                    {specialty.name}
                  </span>
                </button>
              )
            })}
          </div>

          {filteredSpecialties.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                Không tìm thấy chuyên khoa phù hợp với "{searchQuery}"
              </p>
            </div>
          )}

          {/* Link to book by doctor */}
          <div className='mt-12 text-center'>
            <p className='text-muted-foreground mb-3'>
              Hoặc bạn muốn chọn bác sĩ cụ thể?
            </p>
            <Button variant='outline' asChild>
              <Link href='/hosts'>
                <UserRound className='h-4 w-4 mr-2' />
                Đặt khám theo bác sĩ
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
