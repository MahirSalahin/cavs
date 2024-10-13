'use client'

import React from 'react'
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { Badge } from './ui/badge';

export default function CountDown({ start, end }: { start: Date, end: Date }) {
    const [isMounted, setIsMounted] = React.useState(false)
    const now = new Date();

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    let countdownDate;
    let message;

    if (now < start) {
        countdownDate = start;
        message = "Starts in";
    } else if (now >= start && now < end) {
        countdownDate = end;
        message = "Ends in";
    } else {
        message = "Finished";
    }

    return (
        <div className='flex flex-col jusce gap-2 items-start mb-4'>
            <Badge className='text-[10px]'>{message}</Badge>
            {now<=end && 
            <Countdown
                date={countdownDate}
                renderer={renderer}
            />}
        </div>
    )
}

const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        return null;
    }

    return (
        <div className='flex mx-auto w-full rounded-md text-white gap-2'>
            {
                [[days, 'Days'], [hours, 'Hours'], [minutes, 'Minutes'], [seconds, 'seconds']].map((time, i) => (
                    <div key={i} className='flex gap-2'>
                        <div className='flex flex-col justify-end items-center gap-1'>
                            <span className='text-sm'>{time[0]}</span>
                            <span className='text-[8px]'>{time[1]}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}