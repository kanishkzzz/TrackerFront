'use client'

import React from 'react'
import { ListTodo, CheckCircle2, Clock } from 'lucide-react'
import { TaskStats } from '@/types/database'

interface StatsCardsProps {
  stats: TaskStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="dashboard-stats grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Total Tasks */}
      <div className="dashboard-stat bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Tasks
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {stats.total}
          </span>
          <span className="text-xs text-slate-500">all assigned</span>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="dashboard-stat bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Pending Tasks
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {stats.pending}
          </span>
          <span className="text-xs text-amber-600 font-medium">To Do</span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="dashboard-stat bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Completed Tasks
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            {stats.completed}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            {completionPercentage}% completed
          </span>
        </div>
      </div>
    </div>
  )
}

