'use client'

import React from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  ListTodo,
  CheckCheck,
  LogOut,
  User as UserIcon,
  X
} from 'lucide-react'

interface SidebarProps {
  activeFilter: 'all' | 'todo' | 'done'
  onSelectFilter: (filter: 'all' | 'todo' | 'done') => void
  userEmail: string | null
  onSignOut: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
  counts: { all: number; todo: number; done: number }
}

export function Sidebar({
  activeFilter,
  onSelectFilter,
  userEmail,
  onSignOut,
  mobileOpen,
  onCloseMobile,
  counts,
}: SidebarProps) {
  const navItems = [
    {
      id: 'all' as const,
      label: 'All Tasks',
      icon: LayoutDashboard,
      count: counts.all,
    },
    {
      id: 'todo' as const,
      label: 'To Do',
      icon: ListTodo,
      count: counts.todo,
    },
    {
      id: 'done' as const,
      label: 'Completed',
      icon: CheckCheck,
      count: counts.done,
    },
  ]

  const content = (
    <div className="dashboard-sidebar-surface flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Image src="/icon.jpg" alt="" width={36} height={36} className="rounded-xl object-cover shadow-sm shadow-indigo-200" />
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
              TaskNest
            </span>
            <span className="text-[11px] font-medium text-slate-500 block">
              Workspace
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeFilter === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectFilter(item.id)
                onCloseMobile()
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* User Profile & Logout Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
            {userEmail ? userEmail.charAt(0) : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {userEmail || 'User'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">Free Plan</p>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        {content}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

