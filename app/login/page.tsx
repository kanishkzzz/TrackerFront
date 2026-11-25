'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { AuthPageShell } from '@/components/auth/AuthPageShell'

export const dynamic = 'force-dynamic'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom')
  const initialError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(initialError || null)
  const [resendNotice, setResendNotice] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResendNotice(null)

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.')
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(signInError.message || 'Invalid email or password.')
        setLoading(false)
        return
      }

      if (data?.user) {
        router.push(redirectedFrom || '/dashboard')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to resend confirmation.')
      return
    }

    try {
      setResending(true)
      const supabase = createClient()
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (resendErr) {
        setError(resendErr.message)
      } else {
        setResendNotice('Confirmation link resent! Check your inbox or spam folder.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend confirmation email.'
      setError(message)
    } finally {
      setResending(false)
    }
  }

  const isEmailNotConfirmed = error?.toLowerCase().includes('email not confirmed')

  return (
    <AuthPageShell>
      <div className="auth-heading">
        <p className="auth-eyebrow">Welcome back</p>
        <h2 className="auth-title">
          Sign in to your account
        </h2>
        <p className="auth-subtitle">
          Or{' '}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            create a new account for free
          </Link>
        </p>
      </div>

      <div className="auth-card-panel">
          {redirectedFrom && (
            <div className="mb-5 rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-indigo-600" />
              <span>Please sign in to access your dashboard.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>

              {isEmailNotConfirmed && (
                <div className="mt-3 pt-2.5 border-t border-red-200/60 flex flex-col gap-2">
                  <p className="text-[11px] text-red-600 leading-relaxed">
                    Your Supabase project has email verification enabled. Check your inbox for the confirmation email, or disable email confirmations in Supabase Dashboard (Authentication &gt; Providers &gt; Email).
                  </p>
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resending}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                  >
                    {resending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    <span>Resend verification email</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {resendNotice && (
            <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{resendNotice}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Protected by Supabase Row Level Security
          </div>
      </div>
    </AuthPageShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
