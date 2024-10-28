'use client'

import React, { useEffect } from 'react'
import { setCookeis } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'
import { IconLoadingSpinner } from '@/components/IconLoadingSpinner';
import { axios } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { UserType } from '@/types';

export default function AuthCallback() {
    const router = useRouter();
    const { toast } = useToast();
    const { onLogin } = useAuth();

    useEffect(() => {
        const getToken = async () => {
            // const url = window.location.href;
            
            // Extract query params (before #)
            const urlParams = new URLSearchParams(window.location.search);
            const callbackUrl = urlParams.get('callback');
            
            // Extract hash params (after #)
            const hash = window.location.hash;
            if (hash) {
                const params = new URLSearchParams(hash.substring(1)); // Remove the # at the start

                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                const expiresIn = params.get('expires_in');

                if (accessToken) {
                    try {
                        const res = await axios<UserType>('/api/v1/users/current', {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });

                        if (res.success) {
                            if (accessToken && refreshToken) {
                                await setCookeis(accessToken, refreshToken);
                                
                                // Save tokens to localStorage or cookies
                                localStorage.setItem('access_token', accessToken);
                                localStorage.setItem('refresh_token', refreshToken);
                                if (expiresIn) localStorage.setItem('expires_in', expiresIn);

                                toast({
                                    title: '✅ Sign In',
                                    description: 'You have been successfully signed in.',
                                });

                                // Handle login and redirect
                                onLogin(res.data);
                                router.push(callbackUrl ?? '/');
                            }
                        } else {
                            toast({
                                title: 'Error ❌',
                                description: res.message,
                            });
                            router.push('/login');
                        }
                    } catch (error) {
                        console.error("Error during authentication:", error);
                        toast({
                            title: 'Error ❌',
                            description: 'Failed to authenticate user.',
                        });
                        router.push('/login');
                    }
                }
            }
        }

        getToken();
    }, [router, toast, onLogin]);

    return (
        <section className='flex flex-col items-center justify-center h-screen'>
            <IconLoadingSpinner className='size-12' />
        </section>
    )
}
