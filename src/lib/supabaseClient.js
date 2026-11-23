import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://urdqgbgiaohpjmuxpsgl.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_00MvjP_EWFocLRzH8RaJNQ_kzpt2VyM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);