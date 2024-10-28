"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { supabase } from "@/services/supabaseClient";
import { cookies } from "next/headers";
import { axios } from "./axios";
import { UserType } from "@/types";


export async function clearCookies() {
  const cookie = cookies()
  cookie.delete('access_token');
  cookie.delete('refresh_token');
}

export async function signout() {
  const supabase = createClient();
  await clearCookies();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    // redirect("/error");
    return;
  }

  redirect("/");
}

export async function signInWithGoogle(searchParams:any) {
  // const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback?${searchParams}`,
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
  const res = await axios<UserType>('/api/v1/users/current', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })

  if (res.success) {
    return res.data
  }

  return null;
}