import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// ── Browser client (use in Client Components) ──────────────────
export const createClient = () =>
  createClientComponentClient<Database>()

// ── Server client (use in Server Components / API routes) ──────
export const createServerClient = () =>
  createServerComponentClient<Database>({ cookies })
