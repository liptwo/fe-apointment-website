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
interface DialogSpecialtiesProps {
  open: boolean
  setOpen: (open: boolean) => void
  handleSelectSpecialty: (specialty: any) => void
}
export function DialogSpecialties({
  open,
  setOpen,
  handleSelectSpecialty
}: DialogSpecialtiesProps) {
  const [searchName, setSearchName] = React.useState('')
  const [debouncedSearch, setDebouncedSearch] = React.useState('')

  return (
    <div className='flex flex-col gap-4'>
      {/* <Button onClick={() => setOpen(true)} variant='outline' className='w-fit'>
        Open Menu
      </Button> */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            value={searchName}
            onValueChange={setSearchName}
            placeholder='Tìm chuyên khoa...'
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Chuyên khoa'>
              {HOST_SPECIALTIES.map((specialty) => (
                <CommandItem
                  key={specialty.id}
                  onSelect={() => handleSelectSpecialty(specialty)}
                >
                  <img
                    src={specialty.icon}
                    alt={specialty.name}
                    width={24}
                    height={24}
                  />
                  <span>{specialty.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
