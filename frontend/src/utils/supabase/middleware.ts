import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function updateSession(request: NextRequest) {
    // console.log("Middleware invoking 🔥")

    const isPublicRoute = ['/', '/terms', '/privacy'].includes(request.nextUrl.pathname)

    const supabaseResponse = NextResponse.next({
        request,
    })

    const cookie = cookies()
    const user = cookie.get('access_token')?.value;

    if (isPublicRoute ||
        request.nextUrl.pathname == '/auth/callback'
        // || request.nextUrl.pathname.startsWith('/polls')
    ) {
        return;
    }

    if (user && request.nextUrl.pathname.startsWith('/login')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login')
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
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