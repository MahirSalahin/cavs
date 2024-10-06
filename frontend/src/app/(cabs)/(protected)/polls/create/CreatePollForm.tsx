'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import toast from 'react-hot-toast'
// import { useRouter } from 'next/navigation'
import { CreatePollSchema } from '@/schema/createPoll.schema'
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {DateTimePicker} from '@/components/ui/DateTimePicker'
// import { LoadingOverlay } from '@/components/LoadingOverlay'

export default function CreatePollForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // const router = useRouter()

    const form = useForm<z.infer<typeof CreatePollSchema>>({
        resolver: zodResolver(CreatePollSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: new Date(),
            endTime: new Date(),
            rollFrom: 0,
            rollTo: 0,
        }
    })

    const onSubmit = async (values: z.infer<typeof CreatePollSchema>) => {
        setIsLoading(true)
        // const toastId = toast.loading('Loading...');
        console.log({ values })
        // CreatePollSchema(values)
        //     .then((res) => {
        //         if (res.success) {
        //             toast.success(res.message, { id: toastId })
        //             form.reset()
        //             router.push('/admin/contact')
        //         } else throw new Error(res.message)
        //     })
        //     .catch((error) => {
        //         toast.error(error.message, { id: toastId })
        //     })
        //     .finally(() => setIsLoading(false))
    }


    return (
        <div className='space-y-4'>
            {/* <LoadingOverlay open={isLoading} /> */}
            <div className='flex justify-between items-center'>
                <h4>Create New Poll</h4>
            </div>

            <Card className='p-4 space-y-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder='Enter the url'
                                            type='text'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder='Enter the url'
                                            type='text'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <DateTimePicker />
                        </div>
                        <Button disabled={isLoading} type='submit' className='w-full'>Submit</Button>
                    </form>
                </Form>
            </Card>
        </div>
    )
}