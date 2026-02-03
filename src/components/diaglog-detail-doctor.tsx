'use client'
import * as React from 'react'
import { Button } from '@/src/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/src/components/ui/command'
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon
} from 'lucide-react'
import { HOST_SPECIALTIES } from '../utils/constants'
import Image from 'next/image'
import { Card, CardContent } from './ui/card'
import { Badge } from '@/src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { formatPrice, getInitials } from './host-card'
import { Doctor } from '../types'
import Link from 'next/link'
interface DialogDetailDoctorProps {
  open: boolean
  setOpen: (open: boolean) => void
  doctor: Doctor
}
export function DialogDetailDoctor({
  open,
  setOpen,
  doctor
}: DialogDetailDoctorProps) {
  return (
    <div className='flex flex-col gap-4'>
      {/* <Button onClick={() => setOpen(true)} variant='outline' className='w-fit'>
        Open Menu
      </Button> */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <Card className='flex flex-col transition-shadow hover:shadow-lg border-border/60'>
            <CardContent className='p-5'>
              {/* Header with Avatar and Basic Info */}
              <div className='flex gap-4'>
                <Avatar className='h-16 w-16 border-2 border-primary/20'>
                  <AvatarImage
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
                        <span className='text-muted-foreground'>
                          {doctor.title}{' '}
                        </span>
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
                    <div className='flex'>
                      <span className='text-muted-foreground w-24 shrink-0'>
                        Lịch khám:
                      </span>
                      <span className='text-foreground'>
                        {doctor.schedule || 'Thu 2,3,4,5,6,7,Chu nhat'}
                      </span>
                    </div>
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
                    {/* <div className='flex'>
                      <span className='text-muted-foreground w-24 shrink-0'>
                        Quá trình đào tạo:
                      </span>
                      <span className='text-foreground font-medium'>
                        {doctor.description}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Command>
      </CommandDialog>
    </div>
  )
}
