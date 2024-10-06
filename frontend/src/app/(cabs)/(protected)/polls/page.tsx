import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// import { MagicCard } from "@/components/ui/magic-card"
// import ShineBorder from "@/components/ui/shine-border"
import Link from "next/link"
import { FadeUp } from "@/components/Animation"
import { Input } from "@/components/ui/input"

interface Pool {
    title: string
    description: string
    timeLeft: {
        days: number
        hours: number
        minutes: number
        seconds: number
    }
}

const pools: Pool[] = [
    {
        title: "Presidential Election",
        description: "Cast your vote for the next president of our nation. Every vote counts in shaping our future.",
        timeLeft: { days: 1, hours: 12, minutes: 35, seconds: 15 }
    },
    {
        title: "Local Referendum",
        description: "Vote on the proposed city infrastructure project. Your opinion matters in improving our community.",
        timeLeft: { days: 0, hours: 6, minutes: 45, seconds: 30 }
    },
    {
        title: "School Board Election",
        description: "Select the candidates who will guide our education system. Help shape the future of our schools.",
        timeLeft: { days: 2, hours: 8, minutes: 20, seconds: 0 }
    }
]

export default function Polls() {
    return (
        <>
            <div className="min-h-screen text-white p-8 container space-y-6">
                <div className="max-w-[600px] w-full mx-auto">
                    <Input
                        type="search"
                        placeholder="Search Polls"
                    />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Button variant="default" size="sm">All</Button>
                    <Button variant="outline" size="sm">Popular</Button>
                    <Button variant="outline" size="sm">On Going</Button>
                    <Button variant="outline" size="sm">Finished</Button>
                </div>

                <div className="flex flex-col items-stretch justify-center gap-6 max-w-[700px] w-full mx-auto">
                    {pools.map((pool, index) => (
                        <FadeUp key={index} delay={index * .3}>
                            {/* <ShineBorder
                                className="border bg-background md:shadow-xl p-0.5 max-w-[600px] w-full"
                                color={["#A07CFE", "#FE8FB5", "#7be7ff"]}
                            > */}
                            {/* <MagicCard className="bg-background md:shadow-xl p-0.5"> */}
                                <Card className="!w-full">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">{pool.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between mb-4 max-w-[400px] mx-auto">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{pool.timeLeft.days.toString().padStart(2, '0')}</div>
                                                <div className="text-sm text-gray-400">Days</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{pool.timeLeft.hours.toString().padStart(2, '0')}</div>
                                                <div className="text-sm text-gray-400">Hours</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{pool.timeLeft.minutes.toString().padStart(2, '0')}</div>
                                                <div className="text-sm text-gray-400">Minutes</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{pool.timeLeft.seconds.toString().padStart(2, '0')}</div>
                                                <div className="text-sm text-gray-400">Seconds</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">{pool.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={`/polls/vote/${index}`} className="w-full">
                                            <Button variant='outline' className="w-full">Vote Now</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            {/* </MagicCard> */}
                            {/* </ShineBorder> */}
                        </FadeUp>
                    ))}
                </div>
            </div>
        </>
    )
}