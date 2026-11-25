# TaskNest redesign: product and content inventory

This document is the source of truth for the upcoming landing page, sign-up, sign-in, and dashboard redesign. Public-facing copy, navigation, and calls to action should describe only behavior that exists in the repository or is explicitly approved as a later product change.

## Current product

TaskNest is a personal task manager. A signed-in user can create and manage their own tasks. Supabase Auth handles email/password accounts, while PostgreSQL row-level security limits task access to the signed-in user.

### Supported features

- Create an account with email and password. The form checks required fields, a six-character minimum password, and matching confirmation. Supabase may require email confirmation, and the app supports resending that confirmation.
- Sign in with email and password, with session persistence and protected routes.
- Sign out.
- Create a task with a title, optional description, and `To Do` or `Done` status.
- View the user's tasks, sorted newest first.
- Edit a task's title, description, and status.
- Delete a task after a confirmation step.
- Toggle a task between `To Do` and `Done` from its task card.
- Search task titles and descriptions.
- Filter the task list by `All`, `To Do`, or `Completed`.
- See counts for total, pending, and completed tasks, plus the completed percentage.
- Use the responsive dashboard navigation and task views on smaller screens.
- Enforce per-user task access through Supabase RLS policies.

### Existing routes and page roles

| Route | Role | Supported actions |
|---|---|---|
| `/` | Public landing page | Go to sign in or create an account |
| `/signup` | Account registration | Submit email, password, and confirmation; follow email verification when configured; switch to sign in |
| `/login` | Account sign in | Submit email and password; resend verification when applicable; switch to sign up |
| `/dashboard` | Protected task workspace | Add, search, filter, edit, complete/reopen, and delete tasks; sign out |

## Button and link allowlist

Only add interactive controls that map to these supported routes or behaviors. Descriptive text, section labels, and non-interactive visual samples are fine, but should not be styled to imply additional functionality.

### Public landing page

- `TaskNest` brand link → `/`
- `Sign in` / `Sign in to your workspace` → `/login`
- `Get started` / `Create your account` → `/signup`
- In-page links may scroll to real landing-page sections (for example, features or how it works).
- A dashboard preview may be static or illustrative. Controls inside it must be visibly non-interactive unless they actually perform the corresponding action.

### Sign-up page

- `Create account` / submit → existing registration handler
- `Sign in` → `/login`
- `Resend verification email` → existing resend handler, shown only for the relevant auth state

### Sign-in page

- `Sign in` / submit → existing sign-in handler
- `Create an account` → `/signup`
- `Resend verification email` → existing resend handler, shown only for the relevant auth state

### Dashboard

- `Add task` / `Create your first task` → existing task creation modal
- `All tasks`, `To Do`, `Completed` → existing task filters
- Search field → existing title/description search
- Task checkbox/status control → existing status toggle
- `Edit task` → existing task editor
- `Delete task` → existing confirmation dialog
- `Cancel` and `Confirm delete` → existing dialog behavior
- Mobile menu open/close → existing responsive navigation
- `Sign out` → existing sign-out handler

## Existing visual system

- Typeface: Inter, loaded through `next/font/google` and exposed as `--font-sans`.
- Base palette: slate background and text (`#f8fafc`, `#0f172a`), white surfaces, subtle slate borders.
- Primary accent: indigo (`indigo-600` / `indigo-700`); violet is used as a secondary accent on the current landing page.
- Status colors: amber for pending tasks, emerald for completed tasks, red for destructive/error states.
- Existing UI language: rounded cards and controls, restrained shadows, thin borders, responsive spacing.
- Existing tagline: “Organize your work. Simplify your day.”

The redesign should keep the recognizable font and color family while improving hierarchy, spacing, and motion consistently across all four routes.

## Reference direction: Anubi

Reference inspected: [anubi.io](https://anubi.io/).

The homepage content structure observed in the page includes a concise studio identity, a prominent hero with a “Discover” action, client proof, a services introduction, a featured-work archive, an experimentation/lab section, and a closing contact prompt. For TaskNest, adapt the pacing and editorial presentation rather than the studio-specific content:

- Lead with one clear promise and one primary account action.
- Follow with proof of the actual workflow: create tasks, find them, and track completion.
- Use a visual product preview in place of client logos or a portfolio grid.
- Close with a clear route to create an account, plus a sign-in link.
- Use scroll reveals and restrained hover/entrance transitions where they support the content. Keep them lightweight and honor reduced-motion preferences.

The text extraction used for this inventory does not verify the exact animation implementation or all visual states of the reference. Those details should be checked in headless Chrome during the visual design pass before reproducing a specific motion effect.

## Do not claim or present as working features

The README lists several future ideas that are not implemented. Do not add buttons, links, settings, or marketing claims for:

- Task priorities or due dates/reminders
- Tags, categories, or projects
- Team collaboration, sharing, or multiple workspaces
- Notifications, calendar integrations, or external app integrations
- Realtime multi-tab synchronization
- Dark mode preference
- Billing, paid plans, or a functional “Free Plan” upgrade path
- Analytics beyond the existing task totals and completion percentage
- AI task generation or recommendations

Also avoid marketing implementation details (Next.js, Tailwind, PostgreSQL, RLS) as end-user benefits unless a technical/security section is specifically desired. Security wording must remain precise: the database policies isolate each user's task rows; this is not a blanket security certification.

## Implementation and visual QA notes

- Redesign in stages: landing page, auth pages, then dashboard, while preserving current Supabase handlers and route protection.
- Use headless Chrome to inspect the local pages at desktop and mobile widths, capture screenshots, and adjust visual issues before calling the design complete.
- Keep animations purposeful, performant, and accessible with `prefers-reduced-motion` support.
- Treat this inventory as the button/content boundary. Update it when a product feature is implemented or the product scope changes.
