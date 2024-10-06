'use client'

import React, { useEffect } from 'react'
import { setCookeis } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'
import { IconLoadingSpinner } from '@/components/IconLoadingSpinner';

export default function AuthCallback() {

    const router = useRouter();

    const getToken = async () => {
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // Remove the # at the start

            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const expiresIn = params.get('expires_in');

            if (accessToken && refreshToken) {
                console.log("Just got the tokens", { accessToken, refreshToken, expiresIn });
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
    }

    useEffect(() => {
        getToken()
    }, [router, getToken]);

    return (
        <section className='flex flex-col items-center justify-center h-screen'>
            <IconLoadingSpinner className='size-12' />
        </section>
    )
}
