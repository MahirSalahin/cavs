'use client'

import React, { useEffect } from 'react'
import { setCookeis } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'
import { IconLoadingSpinner } from '@/components/IconLoadingSpinner';
import { axios } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

interface CurrentUserType {
    email: string,
    full_name: string,
    roll: number
}

export default function AuthCallback() {
    const router = useRouter();
    const {toast} = useToast()

    useEffect(() => {
        const getToken = async () => {
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1)); // Remove the # at the start

                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const expiresIn = params.get('expires_in');

                axios<CurrentUserType>('/api/v1/users/current', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                    .then(async (res) => {
                        console.log(res);
                        if (res.success) {
                            if (accessToken && refreshToken) {
                                // console.log("Just got the tokens", { accessToken, refreshToken, expiresIn });
                                await setCookeis(accessToken, refreshToken);
                                // Save tokens to localStorage or cookies
                                localStorage.setItem('access_token', accessToken);
                                localStorage.setItem('refresh_token', refreshToken);

                                // Optionally, you can store the expiration time
                                if (expiresIn) localStorage.setItem('expires_in', expiresIn);

                                // Remove the hash from the URL
                                router.replace('/login', undefined);
                            }
                        }
                        else{
                            toast({
                                title: 'Error ❌',
                                description: res.message,
                            })
                            router.push('/login');
                        }
                    })

            }
        }

        getToken()
    }, [router]);

    return (
        <section className='flex flex-col items-center justify-center h-screen'>
            <IconLoadingSpinner className='size-12' />
        </section>
    )
}
