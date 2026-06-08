import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yobtiqmzqbtjmhkkotja.supabase.co'
const supabaseAnonKey = 'sb_publishable_YFe0jIQlEYUMbx5P_qEE_g_Y-pKt3mw'
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)