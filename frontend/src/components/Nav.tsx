import Link from 'next/link'
import React from 'react'
import { LinkButton } from './ui/linkButton'
import { getUser, signout } from '@/lib/auth-actions'
import { Button } from './ui/button'

export default async function Nav() {
    const user = await getUser()
    
    return (
        <div className="sticky left-0 top-0 z-50 w-full overflow-auto bg-background/30 backdrop-blur-[12px] h-[60px] flex justify-center items-center border-b">
            <nav className="flex justify-between items-center container">
                <Link className="text-md flex items-center" href="/">CAVS UI</Link>
                <div className='flex items-center justify-center gap-6'>
                    {
                        user ? <>
                            <Link href='/polls'>All Polls</Link>
                            <Link href="/polls/create">Create Pool</Link>
                            <form
                                action={signout}
                            >
                                <Button variant='secondary'>Sign Out</Button>
                            </form>
                        </>
                            :
                            <LinkButton variant='secondary' href='/login'>Join</LinkButton>

                    }
                </div>
            </nav>
        </div>
    )
}
