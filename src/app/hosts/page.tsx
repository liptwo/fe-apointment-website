'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Loader2,
  CheckCircle,
  Users,
  Building2
} from 'lucide-react'
import { AppHeader } from '@/src/components/app-header'
import { HostCard } from '@/src/components/host-card'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Card, CardContent } from '@/src/components/ui/card'
import { getHosts } from '@/src/services/host.service'
import { useAuth } from '@/src/providers/auth-provider'
import { DEMO_DOCTORS, HOST_SPECIALTIES } from '@/src/utils/constants'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'
import { Doctor } from '@/src/types'
const BENEFITS = [
  'Chu dong chon bac si tin tuong, dat cang som, cang co co hoi co so thu tu thap nhat, tranh het suc',
  'Dat kham theo gio khong can cho lay so thu tu, chi thanh toan (doi voi csyt yeu cau thanh toan online)',
  'Duoc hoan phi kham neu huy phieu',
  'Duoc huong chinh sach hoan tien khi dat lich tren medicare (doi voi cac csyt co ap dung)'
]
const SPECIALTIES = [
  'Tất cả chuyên khoa',
  'Chuyên khoa Nội',
  'Tim mạch',
  'Da liễu',
  'Thần kinh',
  'Chỉnh hình',
  'Nhi khoa',
  'Tâm thần',
  'Chẩn đoán hình ảnh',
  'Nha sĩ'
]
type TabType = 'doctor' | 'facility'
export default function HostsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [hosts, setHosts] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchName, setSearchName] = useState('')
  const [specialty, setSpecialty] = useState('Tat ca chuyen khoa')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('doctor')

  // Check authentication
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // // Debounce search input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedSearch(searchName)
  //   }, 300)
  //   return () => clearTimeout(timer)
  // }, [searchName])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchName)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchName])

  const fetchHosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('name', debouncedSearch)
      if (specialty && specialty !== 'Tat ca chuyen khoa') {
        params.append('specialty', specialty)
      }

      const queryString = params.toString()
      const url = `/hosts${queryString ? `?${queryString}` : ''}`

      const response = await fetch(`/api${url}`)

      if (!response.ok) {
        throw new Error('Failed to fetch hosts')
      }

      const data = await response.json()
      setHosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Mock data for demo purposes
      setHosts(DEMO_DOCTORS)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, specialty])

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  // Filter hosts based on search and specialty
  const filteredHosts = hosts.filter((host) => {
    const matchesName = host.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
    const matchesSpecialty =
      specialty === 'Tat ca chuyen khoa' || host.specialty === specialty
    return matchesName && matchesSpecialty
  })

  // if (isLoading) {
  //   return (
  //     <div className='min-h-screen bg-background'>
  //       <AppHeader />
  //       <main className='container mx-auto px-4 py-8'>
  //         <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
  //           {[...Array(6)].map((_, i) => (
  //             <Card key={i}>
  //               <CardContent className='pt-6'>
  //                 <div className='flex items-start gap-4'>
  //                   <Skeleton className='h-12 w-12 rounded-full' />
  //                   <div className='flex-1'>
  //                     <Skeleton className='h-5 w-32' />
  //                     <Skeleton className='mt-2 h-5 w-20' />
  //                   </div>
  //                 </div>
  //                 <Skeleton className='mt-4 h-16 w-full' />
  //               </CardContent>
  //               <div className='p-6 pt-0'>
  //                 <Skeleton className='h-10 w-full' />
  //               </div>
  //             </Card>
  //           ))}
  //         </div>
  //       </main>
  //     </div>
  //   )
  // }

  if (!user) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <p className='text-muted-foreground'>Đang chuyển hướng đến login... </p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border'>
        <div className='container mx-auto px-4 py-8 lg:py-12'>
          <div className='grid lg:grid-cols-2 gap-8 items-center'>
            <div>
              <h1 className='text-2xl lg:text-3xl font-bold text-foreground'>
                DAT KHAM THEO BAC SI
              </h1>
              <ul className='mt-6 space-y-3'>
                {BENEFITS.map((benefit, index) => (
                  <li key={index} className='flex items-start gap-3'>
                    <CheckCircle className='h-5 w-5 text-accent shrink-0 mt-0.5' />
                    <span className='text-sm text-muted-foreground'>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='hidden lg:flex justify-center'>
              <img
                src='./doctor.png'
                alt='Dat kham bac si'
                className='w-100 h-auto object-contain opacity-90'
              />
            </div>
          </div>
        </div>
      </section>

      <main className='container max-w-6xl mx-auto px-4 py-8'>
        {/* Search Bar */}
        <div className='mb-6 flex flex-col sm:flex-row gap-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              type='text'
              placeholder='Tim kiem bac si...'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className='pl-10 h-11'
            />
          </div>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className='sm:w-64 h-11'>
              <SelectValue placeholder='Tuy chon hien thi' />
            </SelectTrigger>
            <SelectContent>
              {HOST_SPECIALTIES.map((s) => (
                <SelectItem key={s.id} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Area */}
        {/* <div className='grid lg:grid-cols-3 gap-6'> */}
        <div className='flex gap-6 items-center justify-center'>
          {/* Main Content */}
          {/* <div className='lg:col-span-3 space-y-4'> */}
          <div className='flex flex-col container max-w-6xl space-y-4'>
            {/* Loading State */}
            {loading && (
              <div className='space-y-4'>
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className='p-5'>
                      <div className='flex gap-4'>
                        <Skeleton className='h-16 w-16 rounded-full' />
                        <div className='flex-1 space-y-2'>
                          <Skeleton className='h-5 w-48' />
                          <Skeleton className='h-4 w-full' />
                          <Skeleton className='h-4 w-32' />
                          <Skeleton className='h-4 w-24' />
                        </div>
                      </div>
                      <div className='mt-4 flex justify-between'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-9 w-24' />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {/* Error State */}
            {error && !loading && (
              <div className='mb-4 rounded-lg bg-accent/10 p-4 text-sm text-accent'>
                Dang hien thi du lieu mau. {error}
              </div>
            )}
            {/* Doctor Cards */}
            {!loading && activeTab === 'doctor' && filteredHosts.length > 0 && (
              <div className='space-y-4'>
                {filteredHosts.map((host) => (
                  <HostCard key={host.id} doctor={host} />
                ))}
              </div>
            )}
            {/* Facility Tab Placeholder
            {!loading && activeTab === 'facility' && (
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                  <Building2 className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='mt-4 text-lg font-medium text-foreground'>
                  Co so y te
                </h3>
                <p className='mt-2 text-sm text-muted-foreground max-w-sm'>
                  Tinh nang dang duoc phat trien. Vui long quay lai sau.
                </p>
              </div>
            )} */}
            {/* Empty State */}
            {!loading &&
              activeTab === 'doctor' &&
              filteredHosts.length === 0 && (
                <div className='flex flex-col items-center justify-center py-16 text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                    <Search className='h-8 w-8 text-muted-foreground' />
                  </div>
                  <h3 className='mt-4 text-lg font-medium text-foreground'>
                    Khong tim thay bac si
                  </h3>
                  <p className='mt-2 text-sm text-muted-foreground max-w-sm'>
                    Thu dieu chinh tim kiem hoac bo loc de tim bac si phu hop.
                  </p>
                </div>
              )}
            {/* Results Count & Pagination */}
            {!loading && activeTab === 'doctor' && filteredHosts.length > 0 && (
              <div className='flex items-center justify-between pt-4'>
                <p className='text-sm text-muted-foreground'>
                  Hien thi {filteredHosts.length} bac si
                </p>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? 'default' : 'outline'}
                      size='sm'
                      className={cn(
                        'w-9 h-9',
                        page === 1 ? 'bg-accent hover:bg-accent/90' : ''
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                  <span className='flex items-center px-2 text-muted-foreground'>
                    ...
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-9 h-9 bg-transparent'
                  >
                    287
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {/* <div className='hidden lg:block'>
            <Card className='sticky top-24 overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10'>
              <CardContent className='p-6 text-center'>
                <div className='text-2xl font-bold text-accent'>mp</div>
                <h3 className='mt-2 text-lg font-semibold text-foreground'>
                  Tai app <span className='text-accent'>MEDICARE</span>
                </h3>
                <p className='mt-1 text-sm text-muted-foreground'>
                  De dat lich nhanh chong
                </p>
                <div className='mt-4 flex justify-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-xs bg-transparent'
                  >
                    App Store
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-xs bg-transparent'
                  >
                    Google Play
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </main>
    </div>
  )
}
