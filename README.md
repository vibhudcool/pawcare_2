# 🐾 PawCare – Pet Grooming Appointment Platform

A modern, responsive web app where pet owners can manage pet profiles, book
grooming / veterinary appointments, and keep track of vaccination reminders.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Shadcn-style UI
components + MongoDB (Mongoose) + Better Auth + Resend + Zod + React Hook Form**.

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Landing page** (`/`) | Hero with mascot art, animated stat counters, popular services, how it works, why PawCare, testimonials, CTA, footer |
| **Light & dark mode** | One-click sun/moon toggle in the navbar and dashboard, remembered across reloads, no flash on load |
| **Authentication** | Email + password register/login, Google OAuth, email verification (Resend), forgot/reset password |
| **Dashboard overview** (`/dashboard`) | Welcome banner, stat cards: pets, upcoming & completed appointments, upcoming vaccinations |
| **My Pets** (`/dashboard/pets`) | Add, view, edit, delete pets + individual pet detail page |
| **Grooming Services** (`/dashboard/services`) | Basic / Premium / Complete packages + veterinary consultation |
| **Appointments** (`/dashboard/appointments`) | Book (pet, service, date, time slot, notes), view details, cancel |
| **Vaccination Reminders** (`/dashboard/reminders`) | Add / edit / delete records, overdue & due-soon badges |
| **Profile** (`/dashboard/profile`) | Update name & photo, view verified email |
| **Admin portal** (`/admin`) | Overview stats, all registered users, every appointment with Confirm / Complete / Cancel |

All dashboard data is stored in **MongoDB** and every query is scoped to the
signed-in user, so users can only see and modify their own records.

---

## 🧱 Tech stack

- **Next.js 16** (App Router, Server Components + Server Actions)
- **TypeScript** (strict)
- **Tailwind CSS 3** + hand-written Shadcn-style UI components
  (`src/components/ui`)
- **MongoDB Atlas** via **Mongoose** (`src/models`)
- **Better Auth** – credentials + Google OAuth, sessions, email verification
  (`src/lib/auth.ts`, `src/app/api/auth/[...all]/route.ts`)
- **Resend** – transactional emails (`src/lib/emails.ts`)
- **Zod** – client + server validation (`src/lib/validations`)
- **React Hook Form** + `@hookform/resolvers`
- **Lucide React** icons, **Sonner** toasts, **date-fns** date helpers

---

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/pawcare
BETTER_AUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=http://localhost:3000

GOOGLE_CLIENT_ID=          # Google Cloud → APIs & Services → Credentials → OAuth
GOOGLE_CLIENT_SECRET=      # Authorized redirect URI: ${NEXT_PUBLIC_APP_URL}/api/auth/callback/google

RESEND_API_KEY=            # resend.com → API Keys
EMAIL_FROM=PawCare <onboarding@yourdomain.com>

ADMIN_EMAIL=admin@pawcare.in   # this account gets access to /admin (leave empty to disable)
```

> **No Resend key yet?** The app still runs — verification/reset emails are
> skipped and the links are printed to the server console instead.

> **Admin portal:** register the account whose email matches `ADMIN_EMAIL`.
> It then sees an **Admin Portal** link in the dashboard sidebar and can reach
> `/admin`. Everyone else is redirected straight back to `/dashboard`.

### 3. Run

```bash
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

---

## 📁 Project structure

```
src/
├── app/
│   ├── (auth)/                 # login, register, forgot/reset password, verify-email
│   ├── dashboard/              # overview, pets, services, appointments, reminders, profile
│   ├── admin/                  # admin portal (overview, users, appointments)
│   ├── api/auth/[...all]/      # Better Auth handler
│   └── actions/                # server actions (pets, appointments, vaccinations, profile, auth, admin)
├── components/
│   ├── ui/                     # Shadcn-style primitives (button, card, dialog, select, ...)
│   ├── layout/                 # site navbar + footer
│   ├── theme/                  # light/dark mode toggle
│   ├── admin/                  # admin portal shell + appointment manager
│   ├── dashboard/              # dashboard feature components
│   ├── forms/                  # auth forms
│   └── shared/                 # logo, stat cards, badges, empty states, scroll reveals, counters
├── lib/
│   ├── auth.ts                 # Better Auth instance (MongoDB adapter + Resend hooks)
│   ├── auth-client.ts          # browser-side auth client
│   ├── db.ts                   # cached Mongoose connection + native Db handle
│   ├── session.ts              # getSession() / requireUser() helpers
│   ├── validations/            # Zod schemas
│   ├── constants.ts            # packages, time slots, nav
│   ├── mappers.ts              # Mongoose doc → DTO
│   └── format.ts               # date helpers
├── models/                     # Pet, Appointment, Vaccination (Mongoose)
└── types/                      # shared TypeScript types
```

---

## 🔐 Security notes

- Passwords are hashed by Better Auth (never stored in plain text).
- Sessions are cookie-based (`httpOnly`) and validated on every request.
- Every dashboard page and server action requires a session.
- All pet / appointment / vaccination queries filter by `ownerId`, and
  update/delete operations verify ownership before writing.
- The profile update looks the user up by **email from the session** — client
  supplied user ids are never trusted.
- The admin portal checks `ADMIN_EMAIL` **on the server**; the admin role is
  never stored in the browser or accepted from the client.
- Secrets live only in `.env.local` (never committed).

---

## 🗄️ Database collections

| Collection | Model | Key fields |
| --- | --- | --- |
| `user`, `session`, `account`, `verification` | Better Auth (managed) | auth data |
| `pets` | `Pet` | ownerId, name, type, breed, age, gender, weight, image |
| `appointments` | `Appointment` | ownerId, petId, serviceName, appointmentType, appointmentDate, timeSlot, notes, status |
| `vaccinations` | `Vaccination` | ownerId, petId, vaccineName, vaccinationDate, nextDueDate, notes |

Dates are stored as `YYYY-MM-DD` strings to avoid timezone surprises.

---

## 🎓 Notes for students

- **Server Actions** (`src/app/actions/*.ts`) are the "backend" of this app —
  they validate with Zod, check the session, touch MongoDB, and
  `revalidatePath()` so the UI updates instantly.
- The **MongoDB adapter** for Better Auth uses the *same* Mongoose connection
  (`conn.connection.getClient().db()`), so there is only one database
  connection in the whole app.
- Time slots are intentionally simple predefined values — no real-time
  availability engine (as specified).
- Emails are plain HTML template strings in `src/lib/emails.ts` — easy to
  customise for a project presentation.
