import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <header className="auth-topbar">
        <Link className="auth-brand" href="/" aria-label="TaskNest home">
          <Image src="/icon.jpg" alt="" width={42} height={42} />
          <span>TaskNest</span>
        </Link>
        <span className="auth-topline">Organize your work. Simplify your day.</span>
      </header>

      <main className="auth-layout">
        <section className="auth-visual" aria-label="A little inspiration for your day">
          <Image src="/inspo3.jpg" alt="A colorful sunset over a mountain trail" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
          <div className="auth-visual-shade" />
          <div className="auth-visual-copy">
            <span>ONE THING AT A TIME</span>
            <h1>Good things<br />get <em>done.</em></h1>
            <p>A little structure can make room for a lot of focus.</p>
          </div>
          <div className="auth-visual-note"><span>✳</span> A fresh start, whenever you need one.</div>
        </section>
        <section className="auth-form-column">{children}</section>
      </main>

      <footer className="auth-footer">
        <span>Small steps. Clear head.</span>
        <Link href="/">Back to TaskNest <span aria-hidden="true">↗</span></Link>
      </footer>
    </div>
  )
}
