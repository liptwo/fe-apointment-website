import { AppHeader } from '@/src/components/app-header'

export default function GuestLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <AppHeader />
            {children}
        </>
    )
}
