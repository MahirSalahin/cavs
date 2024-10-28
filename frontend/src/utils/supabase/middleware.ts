import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function updateSession(request: NextRequest) {
    // console.log("Middleware invoking 🔥")

    const isPublicRoute = ['/', '/terms', '/privacy', '/auth/callback'].includes(request.nextUrl.pathname)
    const isAuthRoute = ['/login'].includes(request.nextUrl.pathname)
    // const DEFAUTL_UNAUTH_REDIRECT='/login'
    const cookie = cookies()
    const isLoggedIn = cookie.get('access_token')?.value;

    const supabaseResponse = NextResponse.next({
        request,
    })


    if (isLoggedIn && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
        let callback = request.nextUrl.pathname
        if(request.nextUrl.search) callback += request.nextUrl.search
        console.log({callback})
        const encodedCallback = encodeURIComponent(callback)
        return Response.redirect(new URL(`/login?callback=${encodedCallback}`, request.nextUrl))
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}