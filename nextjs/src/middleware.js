// app/middleware.js
// import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'


export async function middleware(req) {


  const cookieStore = await cookies()
  const user = cookieStore.get('appSession')

  const { pathname } = req.nextUrl;
  console.log(pathname);


  // If no session or user, redirect to /landing


  if( pathname === '/profile'){
    if (!cookieStore || !user) {
      return NextResponse.redirect(new URL('/landing', req.url));
    }
  }

  
  if(pathname === '/' || pathname === '/stock-info' ){
    if (!cookieStore || !user) {
      return NextResponse.redirect(new URL('/landing', req.url));
    }
    else {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }


  

 




}

// Only run this middleware on the root path (or add any custom path you need)
export const config = {
  matcher:[ '/','/stock-info','/profile'] // This will apply middleware to the root path
};
