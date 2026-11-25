import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'TaskNest – Organize your work. Simplify your day.',
  description:
    'A production-quality task management application built with Next.js, TypeScript, Tailwind CSS, and Supabase PostgreSQL with Row Level Security (RLS).',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn('h-full', 'antialiased', 'font-sans', inter.variable)}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900">
        <ThemeToggle />
        {children}
      </body>
    </html>
  )
}
