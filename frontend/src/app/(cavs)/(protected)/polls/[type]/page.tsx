'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation'
import Filter, { pollsFilterType } from '@/components/filter'
import PollCard, { PollCardFallback } from '@/components/PollCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import useDebounce from '@/hooks/use-debounce'
import { getUser } from '@/lib/auth-actions'
import { axios } from '@/lib/axios'
import { PollType, UserType } from '@/types'
import { notFound } from 'next/navigation'

interface PollsResponseTypes {
  data: PollType[]
  count: number
}

export default function PollsPage() {
  const params = useParams()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [polls, setPolls] = useState<PollType[]>([])
  const [totalPoll, setTotalPoll] = useState<number>(0)
  const [user, setUser] = useState<UserType | null>(null)
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [skip, setSkip] = useState(0)
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const fetchPolls = useCallback(async (isNewSearch = false) => {
    const pollType = Array.isArray(params?.type) ? params.type[0] : params?.type
    if (!pollType || !pollsFilterType.includes(pollType)) return notFound()

    const access_token = localStorage.getItem('access_token')
    const queryParams = new URLSearchParams({
      search: searchValue,
      limit: limit.toString(),
      skip: skip.toString(),
    })

    const url = `/api/v1/polls/${params.type !== 'all' ? params.type : ''}?${queryParams.toString()}`

    try {
      setIsLoading(isNewSearch)
      setIsLoadingMore(!isNewSearch)

      const res = await axios<PollsResponseTypes>(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${access_token}` }
      })

      if (res.success) {
        setTotalPoll(res.data.count)
        setPolls(prevPolls => {
          const newPolls = isNewSearch ? res.data.data : [...prevPolls, ...res.data.data]
          return Array.from(new Set(newPolls.map(poll => poll.id)))
            .map(id => newPolls.find(poll => poll.id === id)!)
        })
      }
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [params.type, searchValue, skip, limit])

  const debouncedSearch = useDebounce((value: string) => {
    router.replace(`${pathname}?search=${value}`)
    setSkip(0)
    fetchPolls(true)
  }, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart()
    setSearchValue(value)
    debouncedSearch(value)
  }

  const updatePollsAfterDelete = useCallback((pollId: string) => {
    setPolls(prev => prev.filter(p => p.id !== pollId))
    setTotalPoll(prev => prev - 1)
  }, [])

  const handleLoadMore = useCallback(() => {
    setSkip(prevSkip => prevSkip + limit)
  }, [limit])

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  useEffect(() => {
    fetchPolls(skip === 0)
  }, [fetchPolls, skip])

  return (
    <div className="min-h-screen p-8 container space-y-6 max-w-[800px]">
      <div className="w-full mx-auto">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search Polls"
            value={searchValue}
            className="pl-8 pr-4 bg-background"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <Filter />

      <div className="flex flex-col items-stretch justify-center gap-6 w-full mx-auto">
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            updatePollsAfterDelete={updatePollsAfterDelete}
            user={user}
          />
        ))}
      </div>

      {(isLoading || isLoadingMore) && (
        <div className="flex flex-col items-center space-y-6">
          {[...Array(2)].map((_, index) => (
            <PollCardFallback key={index} />
          ))}
        </div>
      )}

      {!isLoading && !polls.length && (
        <div className="text-center text-muted-foreground mt-8">
          No Polls Found
        </div>
      )}

      {!isLoading && polls.length < totalPoll && (
        <div className="flex justify-center items-center">
          <Button
            disabled={isLoadingMore}
            variant="outline"
            onClick={handleLoadMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}