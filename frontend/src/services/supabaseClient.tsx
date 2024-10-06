import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bnqqzronexjzguajduqn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucXF6cm9uZXhqemd1YWpkdXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MDkwNjIsImV4cCI6MjA0MzE4NTA2Mn0.tir17pmW4EYHoOgtOzc3r1pCqk7mm1Mie8nh6HJtOoI'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    // auth: {
    //     storage: globalThis.localStorage,
    // }
})