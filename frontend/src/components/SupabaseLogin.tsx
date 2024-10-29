'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { signInWithGoogle } from '@/lib/auth-actions'
import { FcGoogle } from "react-icons/fc"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import AnimatedText from './AnimatedText'
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'

export default function SupabaseLogin() {
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const searchParams = useSearchParams()
    console.log({callback: searchParams.get('callback')})

    return (
        <div className='p-4 z-10 max-w-[600px] w-full'>
            <Card className='!w-full'>
                <CardHeader>
                    <AnimatedText text='CAVS' className='md:text-[90px] md:leading-[90px] text-[50px] leading-[50px]' />
                    <CardTitle className='text-xl text-center'>Welcome, please join to continue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        action={() => {
                            signInWithGoogle(searchParams.get('callback') ?? '/');
                        }}
                        className="space-y-4"
                    >
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="terms" 
                                checked={acceptedTerms}
                                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                            />
                            <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                I accept the {' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Terms and Conditions
                                </Link>
                            </Label>
                        </div>
                        <Button 
                            type="submit" 
                            className={cn(
                                'w-full space-x-2',
                                !acceptedTerms && 'cursor-not-allowed'
                            )}
                            disabled={!acceptedTerms}
                        >
                            <FcGoogle size={20} />
                            <span>Login with CUET email</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}