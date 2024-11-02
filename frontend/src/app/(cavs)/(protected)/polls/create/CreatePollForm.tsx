'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreatePollSchema } from '@/schema/createPoll.schema'
import { SmartDatetimeInput } from '@/components/ui/DateTime'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusIcon, XIcon, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { axios } from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import useDebounce from '@/hooks/use-debounce'

export default function MultiStepCreatePollForm() {
    const { toast } = useToast()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2'])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const form = useForm<z.infer<typeof CreatePollSchema>>({
        resolver: zodResolver(CreatePollSchema),
        defaultValues: {
            title: 'Poll Title',
            description: 'Poll Description',
            start_time: new Date(),
            end_time: new Date(Date.now() + 24 * 60 * 60 * 1000),
            id_pairs: [{ start_id: 2104001, end_id: 2104132 }],
            options: options,
            is_private: true,
        },
        mode: 'onBlur',
    })

    const handleSubmit = async (values: z.infer<typeof CreatePollSchema>) => {
        const access_token = localStorage.getItem('access_token')
        setIsLoading(true)
        form.setValue('options', options)

        try {
            const pollResponse = await axios<{ poll_id: string }>('/api/v1/polls/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                data: {
                    title: values.title,
                    description: values.description,
                    start_time: values.start_time,
                    end_time: values.end_time,
                    is_private: values.is_private,
                }
            })

            if (pollResponse.success && pollResponse?.data) {
                await axios<{ message: string }>(`/api/v1/polls/${pollResponse.data.poll_id}/options`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    data: {
                        option_texts: values.options
                    }
                })

                if (pollResponse.success && values.is_private) {
                    await axios<{ message: string }>(`/api/v1/polls/${pollResponse.data.poll_id}/roll-ranges`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        },
                        data: {
                            roll_ranges: values.id_pairs.map((pair) => ([pair.start_id, pair.end_id]))
                        }
                    })
                }

                setIsSubmitted(true)
                setTimeout(() => router.push('/polls/all'), 300)
                toast({
                    title: "Success ✅",
                    description: "Poll is created successfully!",
                })
            }
        } catch {
            toast({
                title: "Error ❌",
                description: "Something went wrong!",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = useDebounce(handleSubmit, 300)

    // Watch for changes in the form fields to reset the isSubmitted state
    const { watch } = form
    React.useEffect(() => {
        const subscription = watch(() => {
            setIsSubmitted(false)
        })
        return () => subscription.unsubscribe()
    }, [watch])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'id_pairs',
    })

    const nextStep = async () => {
        const isValid = await form.trigger(); // Validate current step
        if (isValid) {
            setCurrentStep(currentStep + 1);  // Move to next step if valid
        } else {
            toast({
                title: "🚫 Validation Error",
                description: "Please fill in all required fields before proceeding.",
            });
        }
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    return (
        <div className='space-y-4 max-w-[1000px] mx-auto'>
            <div className='flex justify-between items-center'>
                <h4>Create New Poll - Step {currentStep} of 4</h4>
            </div>

            <Card className='p-4 space-y-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {currentStep === 1 && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isLoading} placeholder='Enter the title' type='text' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isLoading} placeholder='Enter the description' type='text' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <SmartDatetimeInput value={field.value} onValueChange={field.onChange} disabled={isLoading} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <SmartDatetimeInput value={field.value} onValueChange={field.onChange} disabled={isLoading} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="is_private"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                                            <FormControl>
                                                <Checkbox disabled={isLoading} checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className='space-y-1 leading-none'>
                                                <FormLabel className='cursor-pointer'>Private</FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {currentStep === 2 && (
                            form.getValues('is_private') ?
                                <>
                                    {fields.map((field, index) => (
                                        <Card key={field.id}>
                                            <CardContent className={cn(
                                                "grid sm:grid-cols-2 gap-4 relative",
                                                'pt-4'
                                            )}>
                                                {fields.length > 1 ?
                                                    <Button
                                                        onClick={() => remove(index)}
                                                        variant='link'
                                                        size='icon'
                                                        className='absolute right-0 top-0'
                                                    >
                                                        <XIcon size={16} />
                                                    </Button>
                                                    : null}
                                                <FormField
                                                    control={form.control}
                                                    name={`id_pairs.${index}.start_id`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Start ID</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} disabled={isLoading} placeholder='Enter the start ID' type='number' />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`id_pairs.${index}.end_id`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>End ID</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} disabled={isLoading} placeholder='Enter the end ID' type='number' />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Button type='button' onClick={() => append({ start_id: 2104001, end_id: 2104132 })} disabled={isLoading} variant='outline' className='flex items-center gap-2'>
                                        Add Student ID Range
                                        <PlusIcon size={16} />
                                    </Button>
                                </> :
                                <>
                                    <h2 className="text-2xl font-bold text-center text-red-900">Poll is Public</h2>
                                    <p className="text-center text-gray-600">This poll is open to all CUETians. To restrict voting to specific students, please make the poll private and specify the student ID ranges. Otherwise, click next to proceed.</p>
                                </>
                        )}

                        {currentStep === 3 && (
                            <Card>
                                <CardContent className='space-y-6 mt-3'>
                                    {options.map((option, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`options.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className='flex items-center justify-between'>
                                                        <FormLabel>Option {index + 1}</FormLabel>
                                                        {options.length > 2 &&
                                                            <Button
                                                                type='button'
                                                                onClick={() => {
                                                                    setOptions((pre) => {
                                                                        const newOptions = [...pre]
                                                                        newOptions.splice(index, 1)
                                                                        form.setValue('options', newOptions)
                                                                        return newOptions
                                                                    })
                                                                }}
                                                                variant='link'
                                                                size='icon'
                                                                className='rounded-full'
                                                            >
                                                                <XIcon size={16} />
                                                            </Button>}
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                setOptions((pre) => {
                                                                    const newOptions = [...pre]
                                                                    newOptions[index] = e.target.value
                                                                    return newOptions
                                                                })
                                                            }}
                                                            value={option}
                                                            disabled={isLoading}
                                                            placeholder={`Option ${index + 1}`}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}

                                    <Button type='button' onClick={() => setOptions((pre) => ([...pre, '']))} disabled={isLoading} variant='outline' className='flex items-center gap-2'>
                                        Add Option
                                        <PlusIcon size={16} />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {currentStep === 4 && (
                            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                                {isSubmitted ? (
                                    <>
                                        <CheckCircle className="w-16 h-16 text-green-500" />
                                        <h2 className="text-2xl font-bold text-center">Poll Created Successfully!</h2>
                                        <p className="text-center text-gray-600">Your poll has been created and is now live. You can manage it from your dashboard.</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-center">Review and Submit</h2>
                                        <p className="text-center text-gray-600">Please review your poll details before submitting. Once submitted, you won&apos;t be able to make changes.</p>
                                        <Button type="submit" disabled={isLoading} className="mt-4">
                                            {isLoading
                                                ? <Loader2 className="size-6 animate-spin" />
                                                : 'Create Poll'}
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between">
                            {!isSubmitted &&
                                <Button size='sm' type="button" onClick={prevStep} disabled={isLoading || currentStep <= 1}>
                                    Previous
                                </Button>}
                            {currentStep < 4 ? (
                                <Button size='sm' type="button" onClick={nextStep} disabled={isLoading}>
                                    Next
                                </Button>
                            ) : null}
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
