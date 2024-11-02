"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Share2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AlertModal from '@/components/modal/AlertModal'
import { usePollActions } from '@/lib/pollUtils'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { axios } from '@/lib/axios'
import CountDown from '@/components/CountDown'
import { PollType, OptionType } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeUp } from "@/components/Animation"
import ShineBorder from "@/components/ui/shine-border"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import AlertModel from "@/components/modal/AlertModal"
import useDebounce from "@/hooks/use-debounce"
import { format } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"

interface PollResultType {
    data: {
        option_text: string
        votes: number
        votesPercentage: number
        isWinner: boolean
    }[],
    total_votes: number
}

export default function VotePoll({ poll_id }: { poll_id: string }) {
    const { toast } = useToast()
    const { user } = useAuth()
    const [poll, setPoll] = useState<PollType | null>(null)
    const [pollOptions, setPollOptions] = useState<OptionType[]>([])
    const [pollResult, setPollResult] = useState<PollResultType | null>(null)
    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const { onDelete, onShare } = usePollActions()
    const router = useRouter()

    const handleOptionClick = (optionId: string) => {
        if (poll?.selected_option || (poll && new Date(poll.start_time) >= new Date())) return;
        setSelectedOption(optionId)
    }

    const getPoll = async () => {
        setIsLoading(true)
        const access_token = localStorage.getItem('access_token')
        const res = await axios<PollType>(`/api/v1/polls/${poll_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })

        if (res.success) {
            setSelectedOption(res.data.selected_option?.id)
            setPoll(res.data)
            setPollOptions(res.data.options)
        }
        else {
            toast({
                title: "Error ❌",
                description: res.message ?? "Something went wrong!",
            })
            router.push('/polls/all')
        }
        setIsLoading(false)
    }

    const getPollResult = async () => {
        setIsLoading(true)
        const access_token = localStorage.getItem('access_token')
        const res = await axios<PollResultType>(`/api/v1/polls/${poll_id}/result`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        if (res.success) {
            const totalVotes = res.data.total_votes
            const updatedData = res.data.data.map((option: { option_text: string, votes: number }) => ({
                ...option,
                votesPercentage: totalVotes ? parseFloat(((option.votes / totalVotes) * 100).toFixed(2)) : 0,
                isWinner: option.votes === Math.max(...res.data.data.map((opt: { votes: number }) => opt.votes))
            }))
            setPollResult({ ...res.data, data: updatedData })
        }
        setIsLoading(false)
    }

    const handlePollSubmit = useDebounce(async () => {
        setSubmitting(true)
        const access_token = localStorage.getItem('access_token')
        const res = await axios<{ message: string }>(`/api/v1/votes/vote`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
            data: {
                option_id: selectedOption
            }
        })

        setOpen(false)
        if (res.success) {
            setTimeout(() => router.push('/polls/all'), 200)
            toast({
                title: "Success ✅",
                description: "Vote submitted successfully!",
            })
        } else {
            toast({
                title: "Error ❌",
                description: res.message ?? "Something went wrong!",
            })
        }
        setSubmitting(false)
    }, 100)

    const debounceHandlePllSubmit = useDebounce(handlePollSubmit, 300)

    useEffect(() => {
        getPoll()
        getPollResult()
    }, [])

    const handleDelete = async () => {
        setIsLoading(true)
        await onDelete(poll_id)
        setOpenDelete(false)
        setIsLoading(false)
    }

    return (
        <>
            <AlertModel
                isOpen={open}
                title='Confirm Vote'
                description='Are you sure you want to vote this option?'
                onClose={() => setOpen(false)}
                isLoading={submitting}
                onConfirm={() => {
                    setSubmitting(true)
                    debounceHandlePllSubmit()
                }}
            />
            <AlertModal
                isOpen={openDelete}
                title='Delete Poll❗'
                description='Are you sure you want to delete this poll?'
                onClose={() => setOpenDelete(false)}
                isLoading={isLoading}
                onConfirm={handleDelete}
            />
            <div className="container h-full">
                <FadeUp className="w-full flex justify-center items-center flex-col">
                    <ShineBorder
                        className="border bg-background md:shadow-xl p-0.5 max-w-[600px] w-full mt-12"
                        color={["#A07CFE", "#3364e0", "#9513d6"]}
                    >
                        {
                            !isLoading ?
                                (poll ?
                                    <Card className="bg-transparent border-none w-full z-10">
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
                                                    {user?.email === poll.creator_email && (
                                                        <Button
                                                            onClick={() => setOpenDelete(true)}
                                                            variant='outline'
                                                            className="rounded-full"
                                                            size='icon'
                                                            aria-label="Delete poll"
                                                        >
                                                            <Trash2 className='text-red-500' size={16} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400">{poll.description}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <div>
                                                <CountDown start={new Date(poll.start_time)} end={new Date(poll.end_time)} />
                                            </div>
                                            <RadioGroup value={selectedOption}>
                                                {
                                                    pollResult ?
                                                        pollResult.data.map((option, index) => (
                                                            <div
                                                                key={index}
                                                                className={cn(
                                                                    "flex items-center justify-between mb-4 select-none transition border p-3 rounded-md",
                                                                    option.isWinner && option.votes ? "border-green-500 bg-green-500/10" : ""
                                                                )}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <span>{option.option_text}</span>
                                                                </div>
                                                                <span>{option.votesPercentage}% <span className="text-xs text-muted-foreground">({option.votes})</span></span>
                                                            </div>
                                                        ))
                                                        :
                                                        pollOptions.map((option, index) => (
                                                            <div
                                                                key={index}
                                                                className={cn(
                                                                    "flex items-center justify-between mb-4 cursor-pointer select-none transition border p-3 rounded-md",
                                                                    poll.selected_option || new Date(poll.start_time) >= new Date() ? "" : "hover:border-foreground",
                                                                    option.id === selectedOption ? "border-foreground" : ""
                                                                )}
                                                                onClick={() => handleOptionClick(option.id)}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={option.id} id={option.id} />
                                                                    <span>{option.option_text}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                }
                                            </RadioGroup>
                                        </CardContent>
                                        {!isLoading && !pollResult && !poll.selected_option && new Date(poll.start_time) < new Date() &&
                                            <CardFooter>
                                                <Button
                                                    variant='outline'
                                                    className="w-full cursor-pointer"
                                                    onClick={() => setOpen(true)}
                                                    disabled={!selectedOption || isLoading}
                                                >
                                                    Submit
                                                </Button>
                                            </CardFooter>}
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
                                    :
                                    null
                                )
                                :
                                <Card className="bg-transparent border-none w-full z-10">
                                    <CardHeader>
                                        <Skeleton className="h-7 w-1/2" />
                                        <Skeleton className="h-7 w-3/4" />
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* <Skeleton className="h-12 w-1/3" /> */}
                                        <div className="space-y-4">
                                            <Skeleton className="h-10 border" />
                                            <Skeleton className="h-10 border" />
                                            <Skeleton className="h-10 border" />
                                        </div>
                                    </CardContent>
                                    <CardFooter className='flex items-center justify-between text-muted-foreground text-xs'>

                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </CardFooter>
                                </Card>
                        }
                    </ShineBorder>
                    <Accordion type="single" collapsible className="max-w-[600px] w-full">
                        <AccordionItem value="rollRanges">
                            <AccordionTrigger>Allowed Voters</AccordionTrigger>
                            <AccordionContent>
                                {poll?.roll_ranges && poll.roll_ranges.length > 0 ? (
                                    <div className="space-y-2">
                                        {poll.roll_ranges.map((range) => (
                                            <div key={range.id} className="flex justify-center p-2 border rounded-md">
                                                {range.start} ~ {range.end}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>All CUETians can vote.</p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </FadeUp>
            </div>
        </>
    )
}
