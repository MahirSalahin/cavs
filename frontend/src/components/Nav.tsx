'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import { LinkButton } from './ui/linkButton'
import { getUser, signout } from '@/lib/auth-actions'
import AnimatedText from './AnimatedText'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar } from './ui/avatar'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { UserType } from '@/types'
import ThemeToggle from './theme/them-change'

export default function Nav() {
    const [isMounted, setIsMounted] = React.useState(false)
    const [user, setUser] = React.useState<UserType | null>(null)
    const router = useRouter()

    useEffect(() => {
        getUser()
            .then((user) => {
                setIsMounted(true)
                setUser(user)
            })
    }, [])

    return (
        <div className="sticky left-0 top-0 z-50 w-full bg-background/30 backdrop-blur-[12px] h-[60px] flex justify-center items-center border-b overflow-hidden">
            <nav className="flex justify-between items-center container">
                <Link className="text-md flex items-center" href="/"><AnimatedText text='CAVS' className='sm:text-[36px] text-xl' /></Link>
                <div className='flex items-center justify-center gap-3 sm:gap-6'>
                    {
                        isMounted ?
                            user ?
                                <>
                                    <Link href='/polls/all' className='sm:text-sm text-xs'>All Polls</Link>
                                    <LinkButton variant='secondary' size='sm' className='flex items-center gap-1 sm:px-3 px-2 sm:h-8 h-7' href="/polls/create">
                                        Create Poll
                                        <Plus size={14} />
                                    </LinkButton>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="size-6 sm:size-8 cursor-pointer">
                                                <Image
                                                    src={user.avatar_url}
                                                    alt={user.full_name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel className='text-center'>My Account</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href="/profile">Profile</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    localStorage.clear()
                                                    await signout()
                                                    router.push('/')
                                                    setUser(null)
                                                }}
                                                variant='destructive'
                                            >
                                                Sign Out
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                                :
                                <>
                                    <LinkButton variant='secondary' href='/login'>Join</LinkButton>
                                </>
                            :
                            null
                    }
                    <ThemeToggle />
                </div>
            </nav>
        </div>
    )
}