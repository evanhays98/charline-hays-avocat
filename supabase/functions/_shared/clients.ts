import { createClient } from "npm:@supabase/supabase-js@2.117.3";
import { CONFIG } from "./config.ts";

export const serviceClient = () =>
  createClient(CONFIG.supabaseUrl, CONFIG.serviceRoleKey, {
    auth: { persistSession: false },
  });

export const userClient = (authorization: string) =>
  createClient(CONFIG.supabaseUrl, CONFIG.anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authorization } },
  });
