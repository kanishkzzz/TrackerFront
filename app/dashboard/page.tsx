'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Task, TaskStatus, TaskStats } from '@/types/database'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { DeleteDialog } from '@/components/tasks/DeleteDialog'
import {
  Search,
  Filter,
  CheckCircle2,
  Inbox,
  Loader2,
  AlertCircle,
  Plus
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr))
    }, 4000)
  }, [])

  // 1. Fetch user and tasks on load
  const loadTasks = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email || null)

      // Fetch tasks sorted newest first
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        showNotification('error', error.message || 'Failed to load tasks.')
      } else {
        setTasks((data as Task[]) || [])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred loading tasks.'
      showNotification('error', message)
    } finally {
      setLoading(false)
    }
  }, [supabase, router, showNotification])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  // 2. Add Task Handler
  const handleCreateTask = async (data: {
    title: string
    description: string
    status: TaskStatus
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: inserted, error } = await supabase
      .from('tasks')
      .insert({
        title: data.title,
        description: data.description || null,
        status: data.status,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (inserted) {
      setTasks((prev) => [inserted as Task, ...prev])
      showNotification('success', 'Task created successfully!')
    }
  }

  // 3. Edit Task Handler
  const handleUpdateTask = async (data: {
    title: string
    description: string
    status: TaskStatus
  }) => {
    if (!editingTask) return

    const { data: updated, error } = await supabase
      .from('tasks')
      .update({
        title: data.title,
        description: data.description || null,
        status: data.status,
      })
      .eq('id', editingTask.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    if (updated) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? (updated as Task) : t))
      )
      setEditingTask(null)
      showNotification('success', 'Task updated successfully!')
    }
  }

  // 4. Quick Toggle Status Handler
  const handleToggleStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done'
    setUpdatingTaskId(task.id)

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    )

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id)

    setUpdatingTaskId(null)

    if (error) {
      // Revert if error
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      )
      showNotification('error', `Failed to update status: ${error.message}`)
    } else {
      showNotification(
        'success',
        newStatus === 'done' ? 'Task marked as Done!' : 'Task marked as To Do!'
      )
    }
  }

  // 5. Delete Task Handler
  const handleConfirmDelete = async () => {
    if (!deletingTask) return

    try {
      setIsDeleting(true)
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', deletingTask.id)

      if (error) {
        showNotification('error', `Failed to delete task: ${error.message}`)
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id))
        showNotification('success', 'Task deleted successfully!')
      }
    } finally {
      setIsDeleting(false)
      setDeletingTask(null)
    }
  }

  // 6. Sign Out Handler
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Calculate statistics automatically
  const stats: TaskStats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter((t) => t.status === 'todo').length
    const completed = tasks.filter((t) => t.status === 'done').length
    return { total, pending, completed }
  }, [tasks])

  // Filter & Search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        activeFilter === 'all' ? true : task.status === activeFilter
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesFilter && matchesSearch
    })
  }, [tasks, activeFilter, searchQuery])

  return (
    <div className="dashboard-page min-h-screen bg-slate-50 flex">
      {/* Sidebar Component */}
      <Sidebar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        counts={{
          all: stats.total,
          todo: stats.pending,
          done: stats.completed,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <Header
          userEmail={userEmail}
          onOpenAddTask={() => setIsAddModalOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="dashboard-content flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
          {/* Notification Toast */}
          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-3 border shadow-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span className="flex-1">{notification.message}</span>
            </div>
          )}

          <div className="dashboard-section-intro">
            <span>WORKSPACE OVERVIEW</span>
            <p>Your next small step starts here.</p>
          </div>

          {/* Statistics Cards */}
          <StatsCards stats={stats} />

          {/* Search & Filters Bar */}
          <div className="dashboard-toolbar bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or details..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['all', 'todo', 'done'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filterKey === 'all'
                    ? 'All'
                    : filterKey === 'todo'
                    ? 'To Do'
                    : 'Done'}
                </button>
              ))}
            </div>
          </div>

          {/* Task List / Content View */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-700">Loading your tasks...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to Supabase PostgreSQL</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={setEditingTask}
                  onDelete={setDeletingTask}
                  isUpdating={updatingTaskId === task.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {searchQuery
                  ? 'No matching tasks found'
                  : activeFilter === 'all'
                  ? 'No tasks yet'
                  : `No ${activeFilter === 'todo' ? 'pending' : 'completed'} tasks`}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
                {searchQuery
                  ? `We couldn't find any tasks matching "${searchQuery}". Try a different keyword.`
                  : activeFilter === 'all'
                  ? 'Your workspace is clear! Create your first task to start organizing your work and simplifying your day.'
                  : `You don't have any tasks in ${
                      activeFilter === 'todo' ? 'To Do' : 'Completed'
                    }.`}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Task</span>
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTask}
        titleText="Create New Task"
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
        titleText="Edit Task"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title || ''}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}

