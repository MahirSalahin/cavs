"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { supabase } from "@/services/supabaseClient";
import { cookies } from "next/headers";



export async function signout() {
  const supabase = createClient();
  const cookie = cookies()
  cookie.delete('access_token')
  cookie.delete('refresh_token')
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    // redirect("/error");
    return;
  }

  redirect("/");
}

export async function signInWithGoogle() {
  // const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options:{
      redirectTo: 'http://localhost:3000/auth/callback'
    }
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function setCookeis(access_token: string, refresh_token: string) {
  // const supabase = createClient();
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  // set the token in next cookies
  const cookie = cookies()
  cookie.set('access_token', access_token)
  cookie.set('refresh_token', refresh_token)

  console.log({ data, error })
}

export async function getUser() {
  // const supabase = createClient();
  const cookie = cookies()
  const access_token = cookie.get('access_token')?.value
  const { data, error } = await supabase.auth.getUser(access_token);
  if (error) {
    console.log(error);
    // redirect("/error");
  }

  return data.user
}


const JWT_SECRET = 'uRnRI3ozsT23Dk5nHS9wwyxCr3YdFdZ15HF1vj4GWFG6uJU46OOZw/ArYMfnJhr1GVMM9z6rDnY9xb7lXYLyRg=='
import jwt from 'jsonwebtoken'

export async function decodeJWT() {
try {
    const cookie = cookies()
    const access_token = cookie.get('access_token')?.value

    if(!access_token) throw new Error('No access token found')
  
    const decoded = jwt.verify(access_token, JWT_SECRET)
    console.log({ decoded })
} catch (error) {
    if(error instanceof Error) console.log({Error: error?.message})
    // redirect("/error");
}
}