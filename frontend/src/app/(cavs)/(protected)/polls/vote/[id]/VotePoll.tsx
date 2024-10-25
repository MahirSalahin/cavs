"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeUp } from "@/components/Animation"
import ShineBorder from "@/components/ui/shine-border"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { axios } from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import AlertModel from "@/components/modal/AlertModel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Users } from "lucide-react"
import { OptionType, PollType } from "@/types"
import CountDown from "@/components/CountDown"
import useDebounce from "@/hooks/use-debounce"
import {format} from 'date-fns'

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
    const [poll, setPoll] = useState<PollType>()
    const [pollOptions, setPollOptions] = useState<OptionType[]>([])
    const [pollResult, setPollResult] = useState<PollResultType | null>(null)
    const [open, setOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const router = useRouter()


    const handleOptionClick = (optionId: string) => {
        if (poll?.selected_option || (poll && new Date(poll.start_time)>=new Date())) return;
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
                votesPercentage: totalVotes ? (option.votes / totalVotes) * 100 : 0,
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

    if (!poll) return null;

    return (
        <>
            <AlertModel
                isOpen={open}
                title='Confirm Vote'
                description='Are you sure you want to vote this option?'
                onClose={() => setOpen(false)}
                isLoading={submitting}
                onConfirm={()=>{
                    setSubmitting(true)
                    debounceHandlePllSubmit()
                }}
            />
            <div className="container h-full">
                {
                    pollResult &&
                    <Alert className='mt-12 max-w-xl mx-auto'>
                        <Info className="h-4 w-4" />
                        <AlertTitle>
                            Published Result
                        </AlertTitle>
                        <AlertDescription>
                            Total Votes: {pollResult.total_votes}
                        </AlertDescription>
                    </Alert>
                }
                <FadeUp className="w-full flex justify-center items-center flex-col">
                    <ShineBorder
                        className="border bg-background md:shadow-xl p-0.5 max-w-[600px] w-full mt-12"
                        color={["#A07CFE", "#3364e0", "#9513d6"]}
                    >
                        <Card className="bg-transparent border-none w-full z-10">
                            <CardHeader>
                                <CardTitle className="text-2xl">{poll.title}</CardTitle>
                                <p className="text-sm text-gray-400">{poll.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <CountDown start={new Date(poll.start_time)} end={new Date(poll.end_time)} />
                                </div>
                                <RadioGroup value={selectedOption}>
                                    {
                                        isLoading ?
                                            [1, 2].map((option) => (
                                                <div
                                                    key={option}
                                                    className=" mb-4 bg-muted/60 border animate-pulse h-10 rounded-md"
                                                >
                                                </div>
                                            ))
                                            :
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
                                                            poll.selected_option || new Date(poll.start_time)>=new Date() ? "" : "hover:border-foreground",
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
                            {!isLoading && !pollResult && !poll.selected_option && new Date(poll.start_time)<new Date() &&
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

                                <div>
                                    Created at <span>{format(poll.created_at, 'MM/dd/yyyy hh:mm a')}</span> by <span className='font-semibold'>{poll.creator_email.split('@')[0].substring(1)}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </ShineBorder>
                </FadeUp>
            </div>
        </>
    )
}
