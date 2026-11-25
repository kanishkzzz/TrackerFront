'use client'

import React from 'react'
import { Task } from '@/types/database'
import { CheckCircle2, Circle, Pencil, Trash2, Calendar } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onToggleStatus: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  isUpdating?: boolean
}

export function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  isUpdating = false,
}: TaskCardProps) {
  const isDone = task.status === 'done'

  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={`task-card group bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        isDone
          ? 'border-slate-200/80 bg-slate-50/50 hover:bg-white'
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Status Toggle Button */}
        <button
          onClick={() => onToggleStatus(task)}
          disabled={isUpdating}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-50 cursor-pointer"
          title={isDone ? 'Mark as To Do' : 'Mark as Done'}
          aria-label={isDone ? 'Mark as To Do' : 'Mark as Done'}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1">
            <h3
              className={`text-sm sm:text-base font-semibold leading-snug break-words ${
                isDone
                  ? 'text-slate-500 line-through decoration-slate-400 decoration-1'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h3>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${
                isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {isDone ? 'Done' : 'To Do'}
            </span>
          </div>

          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 whitespace-pre-line leading-relaxed ${
                isDone ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata & Actions */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                title="Edit task"
                aria-label="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task)}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

