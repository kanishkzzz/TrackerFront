import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowRight,
  Check,
  Circle,
  Search,
  Sparkles,
} from 'lucide-react'

const inspirationFrames = [
  { src: '/inspo2.jpg', alt: '', className: 'hero-frame hero-frame-wave' },
  { src: '/inspo3.jpg', alt: '', className: 'hero-frame hero-frame-sunset' },
  { src: '/inspo4.jpg', alt: '', className: 'hero-frame hero-frame-wall' },
  { src: '/inspo5.jpg', alt: '', className: 'hero-frame hero-frame-city' },
  { src: '/inspo7.jpg', alt: '', className: 'hero-frame hero-frame-sea' },
]

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="brand-lockup" href="/" aria-label="TaskNest home">
          <span className="brand-mark"><Image src="/icon.jpg" alt="" fill sizes="38px" /></span>
          <span className="brand-copy"><strong>TaskNest</strong><small>Make space for focus</small></span>
        </Link>
        <nav className="landing-nav" aria-label="Main navigation">
          <a className="nav-current" href="#home">Home</a>
          <a href="#rhythm">The rhythm</a>
          <a href="#workspace">Workspace</a>
          <Link className="nav-cta" href="/login">Sign in <span aria-hidden="true">↗</span></Link>
        </nav>
        <Link className="mobile-signin" href="/login">Sign in <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="hero-section" id="home" aria-labelledby="hero-title">
        <div className="hero-collage" aria-hidden="true">
          {inspirationFrames.map((frame, index) => (
            <div className={frame.className} key={frame.src}>
              <Image src={frame.src} alt={frame.alt} fill priority={index < 3} sizes="(max-width: 700px) 30vw, 19vw" />
            </div>
          ))}
          <span className="hero-scribble hero-scribble-blue" />
          <span className="hero-scribble hero-scribble-violet">✳</span>
          <span className="hero-scribble hero-scribble-yellow" />
        </div>

        <div className="hero-center">
          <p className="eyebrow hero-eyebrow"><Sparkles size={14} aria-hidden="true" /> A calmer way to get things done</p>
          <h1 id="hero-title">TASKNEST</h1>
          <p className="hero-tagline">Organize your work. <span>Simplify your day.</span></p>
          <Link className="hero-primary" href="/signup">Create your free account <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>

        <div className="hero-footnote"><span>Small steps.<br />Clear head.</span><a href="#rhythm">Discover <ArrowDown size={18} aria-hidden="true" /></a></div>
      </section>

      <section className="rhythm-strip" id="rhythm" aria-label="How TaskNest helps">
        <p className="strip-kicker">A little structure goes a long way</p>
        <div className="rhythm-items">
          <span><i>01</i> Capture what matters</span><b aria-hidden="true">✳</b>
          <span><i>02</i> Find your next step</span><b aria-hidden="true">✳</b>
          <span><i>03</i> See your progress</span>
        </div>
      </section>

      <section className="focus-section" id="workspace" aria-labelledby="focus-title">
        <div className="section-topline"><span>IN FOCUS</span><span>01 — YOUR EVERYDAY WORKSPACE</span></div>
        <div className="focus-copy">
          <p className="eyebrow">A place for the open loops</p>
          <h2 id="focus-title">From “I should”<br />to <em>“it’s done.”</em></h2>
          <p className="focus-description">Keep your tasks in one clear view. Add the details, find what you need, and mark the little wins as they happen.</p>
          <Link className="text-link" href="/signup">Make your first list <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>

        <div className="focus-art">
          <div className="focus-photo">
            <Image src="/inspo3.jpg" alt="A vivid sunset above a mountain trail" fill sizes="(max-width: 700px) 100vw, 55vw" />
            <div className="photo-caption"><span>ONE THING AT A TIME</span><span>KEEP GOING ↗</span></div>
          </div>
          <div className="task-preview" aria-label="Illustrative TaskNest task list preview">
            <div className="preview-top"><span className="preview-dot" /><span>Today, in focus</span><span className="preview-menu">•••</span></div>
            <div className="preview-stats"><div><strong>08</strong><span>all tasks</span></div><div><strong>05</strong><span>to do</span></div><div><strong>03</strong><span>done</span></div></div>
            <div className="preview-progress"><span style={{ width: '38%' }} /></div>
            <div className="preview-task"><Check className="preview-checked" size={16} /><span className="preview-done">Plan the week</span><small>Done</small></div>
            <div className="preview-task"><Circle size={16} /><span>Send the first draft</span><small>To Do</small></div>
            <div className="preview-task"><Circle size={16} /><span>Make room for a break</span><small>To Do</small></div>
            <div className="preview-search"><Search size={14} /><span>Search your tasks</span></div>
          </div>
          <div className="focus-sticker">A good day<br />starts here <span>✳</span></div>
        </div>
      </section>

      <section className="closing-section" id="closing" aria-labelledby="closing-title">
        <div className="closing-image">
          <Image src="/inspo7.jpg" alt="Open water beneath a clear blue sky" fill sizes="(max-width: 700px) 100vw, 42vw" />
          <span>YOU’LL FIGURE IT OUT.</span>
        </div>
        <div className="closing-copy">
          <p className="eyebrow">Start where you are</p>
          <h2 id="closing-title">Let’s make<br /><em>today count.</em></h2>
          <p>A clear place to begin, and a little more room to focus.</p>
          <Link className="closing-cta" href="/signup">Get started <ArrowRight size={18} aria-hidden="true" /></Link>
          <span className="closing-login">Already have an account? <Link href="/login">Sign in</Link></span>
        </div>
      </section>

      <footer className="landing-footer">
        <Link className="footer-brand" href="/">TASKNEST<span>©</span></Link>
        <span>Organize your work. Simplify your day.</span>
        <div><Link href="/login">Sign in</Link><Link href="/signup">Create account</Link><a href="#home">Back to top ↑</a></div>
      </footer>
    </main>
  )
}
