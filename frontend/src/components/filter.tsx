'use client'

import { useParams } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { LinkButton } from './ui/linkButton'

export const pollsFilterType = [
    'all',
    'public',
    'my-polls',
    'ongoing-polls',
    'upcoming-polls',
    'ended-polls',
    'popular-polls',
]

export default function Filter() {
    const params: { type: string } = useParams()

    const selectedValue = params?.type


    return (
        <div className='mb-8'>
            <div className='flex flex-wrap gap-2 justify-center'>
                {pollsFilterType.map((filter) => (
                    <div key={filter} className='flex items-center'>
                        <LinkButton
                            href={`/polls/${filter}`}
                            size='sm'
                            variant={
                                (filter == selectedValue) || (selectedValue == null && filter == 'all')
                                    ? 'default' : 'outline'
                            }
                            className={cn(
                                'capitalize',
                                // selectedValue == filter ? 'bg-gray-800 text-white' : ''
                            )}
                        >
                            {filter.split('-').join(' ')}
                        </LinkButton>
                    </div>
                ))}
            </div>

        </div>
    )
}
