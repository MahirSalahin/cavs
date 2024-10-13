'use client'

import Filter, { pollsFilterType } from '@/components/filter'
import PollCard, { PollCardFallback } from '@/components/PollCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { getUser } from '@/lib/auth-actions'
import { axios } from '@/lib/axios'
import { PollType } from '@/types'
import { User } from '@supabase/supabase-js'
import { notFound, useParams, usePathname, useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PollsResponseTypes {
    data: PollType[]
    count: number
}

export default function PollsList() {
    const params: { type: string } = useParams()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()  // useRouter for navigation

    const [polls, setPolls] = useState<PollType[]>([])
    const [totalPoll, setTotalPoll] = useState<number>(0)
    const [user, setUser] = useState<User | null>(null)
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')  // Initial value from query params
    const [isLoading, setIsLoading] = useState(true)

    // Pagination state
    const limit = parseInt(searchParams.get('limit') ?? '20')  // Default to 20 if not
    const [skip, setSkip] = useState(parseInt(searchParams.get('skip') ?? '0'))  // Default to 0 if not


    const getQueryParams = () => {
        const queryParams = new URLSearchParams(searchParams.toString())
        if (searchValue) queryParams.set('search', searchValue)
        else queryParams.delete('search')

        queryParams.set('limit', limit.toString())
        queryParams.set('skip', skip.toString())

        return queryParams.toString()
    }

    // Fetch polls based on the current searchValue and poll type
    const getPolls = async (changeSearchValue = false) => {
        setIsLoading(true)
        const access_token = localStorage.getItem('access_token')
        let url = `/api/v1/polls/`
        if (params.type && params.type !== 'all') url += `${params.type}`
        url += `?${getQueryParams()}`

        const res = await axios<PollsResponseTypes>(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        setIsLoading(false)

        if (res.data) console.log(res.data?.data)

        if (res.success) {
            setTotalPoll(res.data.count)
            if (changeSearchValue) setPolls(res?.data?.data)
            else setPolls((pre) => ([...pre, ...res?.data?.data]))
        }
    }

    // Debounce the search function
    const debouncedFun = useDebounce(() => {
        if (searchValue) {
            // Update the URL with the search parameter
            router.push(`${pathname}?search=${searchValue}`, undefined)
        }
    })

    // Trigger debounced function when searchValue changes
    useEffect(() => {
        if (!searchValue) {
            router.push(pathname)
        }
        else debouncedFun()
    }, [searchValue])

    useEffect(() => {
        if (!pollsFilterType.includes(params?.type)) return notFound();
        getUser()
            .then(res => setUser(res))
    }, [])

    useEffect(() => {
        if (!pollsFilterType.includes(params?.type)) return notFound();
        getPolls()
    }, [skip, setSkip])

    useEffect(() => {
        if (!pollsFilterType.includes(params?.type)) return notFound();
        setSkip(0)
        getPolls(true)
    }, [searchParams.get('search')])

    return (
        <>
            <div className="min-h-screen text-white p-8 container space-y-6 max-w-[800px]">
                <div className="w-full mx-auto">
                    <Input
                        type="search"
                        placeholder="Search Polls"
                        value={searchValue}
                        onChange={(e) => {
                            let value = e.target.value
                            if (value == ' ') value = ''
                            setSearchValue(value)
                        }}
                    />
                </div>
                <Filter />

                <div className="flex flex-col items-stretch justify-center gap-6 w-full mx-auto">
                    {

                        !isLoading && !polls.length ?
                            <>
                                <div className="text-center text-muted-foreground mt-8">
                                    No Polls Found
                                </div>
                            </> :
                            polls.map((poll, index) => (
                                <PollCard key={index} index={index} poll={poll} user={user} />
                            ))
                    }
                    {
                        isLoading ?
                            [1, 2].map((i) => <PollCardFallback key={i} />) : null
                    }
                </div>

                <div className='flex justify-center items-center'>
                    {
                        !isLoading && polls.length && polls.length < totalPoll ?
                            <Button
                                disabled={isLoading}
                                variant='outline'
                                onClick={() => {
                                    setSkip(skip + limit)
                                }}
                            >
                                Load More
                            </Button> : null
                    }
                </div>

            </div>
        </>
    )
}
