"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeUp } from "@/components/Animation"
import ShineBorder from "@/components/ui/shine-border"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface PollOption {
    language: string
    percentage: number
    selected: boolean
}

const initialPollOptions: PollOption[] = [
    { language: "HTML", percentage: 30, selected: false },
    { language: "Java", percentage: 20, selected: false },
    { language: "Python", percentage: 40, selected: true },
    { language: "jQuery", percentage: 10, selected: false },
]

export default function VotePage({ params: { id } }: { params: { id: string } }) {
    const [pollOptions, setPollOptions] = useState(initialPollOptions)
    const [selectedOption, setSelectedOption] = useState("Python")
    console.log({Poll_ID: id})

    const handleOptionClick = (language: string) => {
        setPollOptions(prevOptions =>
            prevOptions.map(option =>
                language === selectedOption
                    ? option
                    : option.language === language
                        ? { ...option, percentage: option.percentage + 1 }
                        : option.language === selectedOption
                            ? { ...option, percentage: option.percentage - 1 }
                            : option
            )
        )
        setSelectedOption(language)
    }

    // const totalVotes = pollOptions.reduce((sum, option) => sum + option.percentage, 0)

    return (
        <>
            <div className="container h-full">
                <FadeUp className="w-full flex justify-center items-center flex-col">
                    <ShineBorder
                        className="border bg-background md:shadow-xl p-0.5 max-w-[600px] w-full mt-12"
                        color={["#A07CFE", "#3364e0", "#9513d6"]}
                    >
                        <Card className="bg-transparent border-none w-full z-10">
                            <CardHeader>
                                <CardTitle className="text-2xl">{'Poll UI Design'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedOption}>
                                    {
                                        pollOptions.map((option, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "flex items-center justify-between mb-4 cursor-pointer select-none transition border p-3 rounded-md hover:border-foreground",
                                                    option.language === selectedOption? "border-foreground": ""
                                                )}
                                                onClick={() => handleOptionClick(option.language)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.language} id={option.language} />
                                                    <span>{option.language}</span>
                                                </div>
                                                <span>{option.percentage}%</span>
                                            </div>
                                        ))}
                                </RadioGroup>
                            </CardContent>
                            <CardFooter>
                                <Button variant='outline' className="w-full cursor-pointer">Submit</Button>
                            </CardFooter>
                        </Card>
                    </ShineBorder>
                </FadeUp>
            </div>
        </>
    )
}
