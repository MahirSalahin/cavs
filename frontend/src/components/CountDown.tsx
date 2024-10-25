'use client'

import React, { useEffect } from 'react'
import Countdown, { CountdownRendererFn } from 'react-countdown';
import { Badge } from './ui/badge';

export default function CountDown({ start, end }: { start: Date, end: Date }) {
    const [isMounted, setIsMounted] = React.useState(false)
    const [countdownDate, setCountdownDate] = React.useState<Date | null>(null)
    const [message, setMessage] = React.useState<string>('')

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            if (currentTime < start) {
                setCountdownDate(start);
                setMessage('Starts in');
            } else if (currentTime >= start && currentTime < end) {
                setCountdownDate(end);
                setMessage('Ends in');
            } else {
                setCountdownDate(null);
                setMessage('Ended');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [start, end]);

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || !message) return null;

    const now = new Date();

    return (
        <div className='flex flex-col jusce gap-2 items-start mb-4'>
            <Badge className='text-[10px]'>{message}</Badge>
            {countdownDate && now <= end &&
                <Countdown
                    key={countdownDate.getTime()}
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
                [[days, 'Days'], [hours, 'Hours'], [minutes, 'Minutes'], [seconds, 'Seconds']].map((time, i) => (
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
