'use client'

import React, { useState } from 'react'
import Nav from './Nav'
import { useAuth } from '@/hooks/use-auth'
import { clearCookies, getUser } from '@/lib/auth-actions'
import { useLoadingOverlay } from '@/hooks/use-loading-overlay'
import LoadingOverlayProvider from '@/providers/loading-overlay-provider'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, onLogin, onLogout } = useAuth()
    const { onClose, onOpen } = useLoadingOverlay()
    const [isLoading, setIsLoading] = useState(true)


    const getCurrentUser = async () => {
        onOpen()
        setIsLoading(true)
        if (!user) {
            const res = await getUser()
            console.log(res)
            if (res) onLogin(res)
                else{
                await clearCookies()
                onLogout()
            }
        }
        onClose()
        setIsLoading(false)
    }

    React.useEffect(() => {
        getCurrentUser()
        .finally(() =>onClose())
    }, [])

    return (
        <>
            <LoadingOverlayProvider />
            {!isLoading ?
                <div className="flex flex-col min-h-screen">
                    <Nav />
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className='border-t border-input bg-transparent'>
                        <div className='container py-1 flex items-center justify-between'>
                            <p className='text-sm'>&copy; {new Date().getFullYear()} CAVS</p>
                            <div className='flex items-center gap-3'>
                                <Link href='/privacy' className='text-xs underline cursor-pointer'>Privacy Policy</Link>
                                <Link href='/terms' className='text-xs underline cursor-pointer'>Terms and Condition</Link>
                            </div>
                        </div>
                    </footer>
                </div>
                : null
            }
        </>
    )
}
