// 'use client'

// import Filter, { pollsFilterType } from '@/components/filter'
// import PollCard, { PollCardFallback } from '@/components/PollCard'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import useDebounce from '@/hooks/use-debounce'
// import { getUser } from '@/lib/auth-actions'
// import { axios } from '@/lib/axios'
// import { PollType } from '@/types'
// import { notFound, useParams, usePathname, useSearchParams, useRouter } from 'next/navigation'
// import React, { useEffect, useState } from 'react'

// export default function PollsWithType() {
//     const params: { type: string } = useParams()
//     const pathname = usePathname()
//     const searchParams = useSearchParams()
//     const router = useRouter()

//     const [polls, setPolls] = useState<PollType[]>([])
//     const [user, setUser] = useState<User | null>()
//     const [searchValue, setSearchValue] = useState(searchParams.get('search') || '') // Initial value from query params
//     const [isLoading, setIsLoading] = useState(true)

//     // Pagination state
//     const [limit, setLimit] = useState(parseInt(searchParams.get('limit') ?? '20')) // Default to 20 if not provided
//     const [skip, setSkip] = useState(parseInt(searchParams.get('skip') ?? '0')) // Default to 0 if not

//     const getQueryParams = (newLimit: number | null = null, newSkip: number | null = null) => {
//         const queryParams = new URLSearchParams(searchParams.toString())
//         if (searchValue) queryParams.set('search', searchValue)
//         else queryParams.delete('search')

//         if (!searchParams.get('limit')) queryParams.append('limit', parseInt(searchParams.get('limit') ?? '20').toString())
//         else if (newLimit) queryParams.set('limit', newLimit.toString())

//         if (!searchParams.get('skip')) queryParams.append('skip', skip.toString())
//         else if (newSkip) queryParams.set('skip', newSkip.toString())

//         return queryParams.toString()
//     }

//     // Fetch polls based on the current searchValue, poll type, and pagination
//     const getPolls = async () => {
//         setIsLoading(true)
//         const access_token = localStorage.getItem('access_token')
//         let url = `/api/v1/polls/`
//         if (params.type && params.type !== 'all') url += `${params.type}`

//         url += `?${getQueryParams()}`

//         const res = await axios(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${access_token}`
//             }
//         });
//         setIsLoading(false)
//         setPolls(res?.data?.data)
//     }

//     // Debounce the search function
//     let debouncedFun = useDebounce(() => {

//         router.push(`${pathname}?${getQueryParams()}`, undefined)
//         // getPolls()
//     })

//     // Trigger debounced function when searchValue changes
//     useEffect(() => {
//         if (!searchValue) {
//             const newParams = new URLSearchParams(searchParams.toString())
//             if (searchValue) newParams.set('search', searchValue)
//             else newParams.delete('search')
//             router.push(`${pathname}?${getQueryParams()}`, undefined)
//         }
//         else debouncedFun()
//     }, [searchValue])

//     useEffect(() => {
//         if (!pollsFilterType.includes(params?.type)) return notFound();
//         getUser()
//             .then(res => setUser(res))
//     }, [])

//     useEffect(() => {
//         getPolls()
//     }, [searchParams.get('search'), searchParams.get('limit'), searchParams.get('skip')])

//     // Handle pagination actions
//     const handleNextPage = () => {
//         const newSkip = skip + limit
//         router.push(`${pathname}?${getQueryParams(null, newSkip)}`)
//     }

//     const handlePreviousPage = () => {
//         const newSkip = Math.max(skip - limit, 0) // Prevent negative skip values
//         router.push(`${pathname}?${getQueryParams(null, newSkip)}`)
//     }

//     return (
//         <div className='max-w-[700px] mx-auto'>
//             <div className="min-h-screen text-white p-8 container space-y-6">
//                 <div className="max-w-[600px] w-full mx-auto">
//                     <Input
//                         type="search"
//                         placeholder="Search Polls"
//                         value={searchValue}
//                         onChange={(e) => {
//                             let value = e.target.value
//                             if (value == ' ') value = ''
//                             setSearchValue(value)
//                         }}
//                     />
//                 </div>
//                 <Filter />

//                 <div className="flex flex-col items-stretch justify-center gap-6 w-full mx-auto">
//                     {
//                         isLoading ?
//                             [1, 2].map((i) => <PollCardFallback key={i} />)
//                             :
//                             !polls || !polls.length ?
//                                 <div className="text-center text-muted-foreground mt-8">
//                                     No Polls Found
//                                 </div> :
//                                 polls.map((poll, index) => (
//                                     <PollCard key={index} index={index} poll={poll} user={user} />
//                                 ))
//                     }
//                 </div>

//                 {/* Pagination controls */}
//                 {
//                     polls && polls.length && 0 ?
//                         <div className="flex justify-between mt-8">
//                             <Button
//                                 disabled={skip === 0}
//                                 onClick={handlePreviousPage}
//                             >
//                                 Previous
//                             </Button>
//                             <Button
//                                 onClick={handleNextPage}
//                             >
//                                 Next
//                             </Button>
//                         </div> : null
//                 }
//             </div>
//         </div>
//     )
// }


import React from 'react'
import PollsList from './PollsList'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Polls",
}

export default function PollsPage() {
  return (
    <PollsList />
  )
}
