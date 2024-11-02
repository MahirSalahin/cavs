'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { PollType, UserType } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import CountDown from './CountDown'
import { Button } from './ui/button'
import { Users, Trash2, Share2 } from 'lucide-react'
import AlertModal from './modal/AlertModal'
import { format } from 'date-fns'
import { usePollActions } from '@/lib/pollUtils'

interface PollCardProps {
    poll: PollType
    updatePollsAfterDelete: (pollId: string) => void
    user: UserType | null
}

export default function PollCard({ poll, user, updatePollsAfterDelete }: PollCardProps) {
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { onDelete, onShare } = usePollActions()

    const handleDelete = async () => {
        setIsLoading(true)
        await onDelete(poll.id, updatePollsAfterDelete)
        setOpen(false)
        setIsLoading(false)
    }

    useEffect(() => setMounted(true), [])

    if (!mounted) return null;

    return (
        <>
            <AlertModal
                isOpen={open}
                title='Delete Poll❗'
                description='Are you sure you want to delete this poll?'
                onClose={() => setOpen(false)}
                isLoading={isLoading}
                onConfirm={handleDelete}
            />
            <Card className="!w-full">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-2xl">{poll.title}</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => onShare(poll.id)}
                                variant='outline'
                                className="rounded-full"
                                size='icon'
                                aria-label="Share poll"
                            >
                                <Share2 size={16} />
                            </Button>
                            {user?.email == poll.creator_email &&
                                <Button
                                    onClick={() => setOpen(true)}
                                    variant='outline'
                                    className="rounded-full"
                                    size='icon'
                                    aria-label="Delete poll"
                                >
                                    <Trash2 className='text-red-500' size={16} />
                                </Button>
                            }
                        </div>
                    </div>
                    <p className="text-sm text-accent-foreground/70">{poll.description}</p>
                </CardHeader>
                <CardContent>
                    <CountDown start={new Date(poll.start_time)} end={new Date(poll.end_time)} />
                    <Link href={`/polls/vote/${poll.id}`} className="w-full">
                        <Button variant='outline' className="w-full">
                            {
                                new Date(poll.end_time) >= new Date() ? 'Vote' : 'View Results'
                            }
                        </Button>
                    </Link>
                </CardContent>
                <CardFooter className='flex items-center justify-between text-muted-foreground text-xs'>
                    <span className='flex items-center'>
                        <Users size={12} className="inline mr-2" />
                        {poll.total_votes} Votes
                    </span>

                    <div className='text-right'>
                        Created by <span className='font-semibold'>{poll.creator_email.split('@')[0].substring(1)}</span>
                        <br />
                        <time className='text-[11px]'>{format(poll.created_at, 'MM/dd/yyyy hh:mm a')}</time>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}

export function PollCardFallback() {
    return (
        <Card className="!w-full animate-pulse">
            <CardHeader className='space-y-4'>
                <div className="h-3 bg-muted-foreground/30 rounded w-1/3"></div>
                <div className="h-6 bg-muted-foreground/30 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
                {/* <div className="h-4 text-muted-foreground rounded w-12"></div> */}
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <div className="h-3 bg-muted-foreground/30 rounded w-12"></div>
                <div className="h-3 bg-muted-foreground/30 rounded w-24"></div>
            </CardFooter>
        </Card>
    )
}