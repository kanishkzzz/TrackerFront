'use client'

import React from 'react'
import { Plus, Menu } from 'lucide-react'

interface HeaderProps {
  userEmail: string | null
  onOpenAddTask: () => void
  onToggleMobileMenu: () => void
}

export function Header({
  userEmail,
  onOpenAddTask,
  onToggleMobileMenu,
}: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Format greeting
  const username = userEmail ? userEmail.split('@')[0] : 'there'
  const displayName = username.charAt(0).toUpperCase() + username.slice(1)

  return (
    <header className="dashboard-topbar bg-white border-b border-slate-200 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto pr-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Welcome back, {displayName}!
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700">{today}</span>
              <span>•</span>
              <span>Here&apos;s what&apos;s happening with your tasks.</span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs hover:shadow-indigo-100 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  )
}

