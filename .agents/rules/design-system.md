---
trigger: always_on
---

# Design System — SecureGate

## Design Philosophy

SecureGate is a security-focused application. The UI must communicate **trust, clarity, and control**. Every design decision should reduce user anxiety during sensitive flows (login, password reset, email verification).

Design principles in order of priority:
1. **Clarity** — the user always knows what to do next
2. **Feedback** — every action has a visible response (loading, success, error)
3. **Consistency** — same spacing, colour, and pattern across every page
4. **Accessibility** — keyboard navigable, screen-reader friendly, proper contrast

---

## Styling: Tailwind CSS

All styling uses **Tailwind CSS utility classes only**. No custom CSS files except for global base styles in `app/globals.css`.

```css
/* globals.css — only base resets and CSS variables */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Colour Palette

SecureGate uses a minimal, high-contrast palette that signals professionalism.

| Token              | Tailwind Class         | Hex       | Use                              |
|--------------------|------------------------|-----------|----------------------------------|
| Primary            | `bg-zinc-900`          | #18181b   | Buttons, headings, nav           |
| Primary Hover      | `hover:bg-zinc-700`    | #3f3f46   | Button hover state               |
| Surface            | `bg-white`             | #ffffff   | Card backgrounds                 |
| Background         | `bg-zinc-50`           | #fafafa   | Page background                  |
| Border             | `border-zinc-200`      | #e4e4e7   | Input borders, card borders      |
| Text Primary       | `text-zinc-900`        | #18181b   | Body text, labels                |
| Text Muted         | `text-zinc-500`        | #71717a   | Hints, placeholders              |
| Success            | `text-emerald-600`     | #059669   | Verification success             |
| Error              | `text-red-600`         | #dc2626   | Validation errors                |
| Warning            | `text-amber-500`       | #f59e0b   | Token expiry warnings            |
| Strength Weak      | `bg-red-500`           | #ef4444   | Password strength indicator      |
| Strength Fair      | `bg-amber-400`         | #fbbf24   | Password strength indicator      |
| Strength Strong    | `bg-emerald-500`       | #10b981   | Password strength indicator      |

---

## Typography

| Element       | Classes                                      |
|---------------|----------------------------------------------|
| Page title    | `text-2xl font-semibold text-zinc-900`       |
| Subtitle      | `text-sm text-zinc-500`                      |
| Label         | `text-sm font-medium text-zinc-700`          |
| Body          | `text-sm text-zinc-600`                      |
| Error text    | `text-xs text-red-600 mt-1`                  |
| Link          | `text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-600` |

Font: System font stack (no external font dependency).
```ts
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
}
```

---

## Spacing & Layout

Every auth page follows this layout:

```
Full viewport height (min-h-screen)
  └── Centered container (max-w-sm mx-auto)
        └── Card (bg-white rounded-xl border border-zinc-200 shadow-sm p-8)
              ├── Logo / App name
              ├── Page title + subtitle
              ├── Form
              └── Footer link (e.g. "Already have an account?")
```

Standard spacing scale:
- Between form fields: `space-y-4`
- Inside card padding: `p-8`
- Between label and input: `mt-1`
- Between sections: `mt-6`

---

## Component Patterns

### Input Field

```tsx
<div>
  <label htmlFor="email" className="text-sm font-medium text-zinc-700">
    Email address
  </label>
  <input
    id="email"
    type="email"
    autoComplete="email"
    className="mt-1 block w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm
               text-zinc-900 placeholder:text-zinc-400
               focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
               disabled:opacity-50 disabled:cursor-not-allowed"
  />
  {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
</div>
```

Rules:
- Every input must have an explicit `id` and a matching `htmlFor` on the label.
- Every input must have an `autoComplete` attribute.
- Error messages appear below the input, never as toast-only.
- Disabled state must be visually distinct.

### Primary Button

```tsx
<button
  type="submit"
  disabled={isLoading}
  className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white
             hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2
             disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
>
  {isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <Spinner className="h-4 w-4 animate-spin" /> Processing...
    </span>
  ) : label}
</button>
```

### Password Strength Indicator

Required on the Sign Up page only. Must appear below the password input.

```tsx
// Strength levels based on:
// Weak   → length < 8 OR only one character type
// Fair   → length >= 8, two character types
// Strong → length >= 10, uppercase + number + special character

<div className="mt-2 space-y-1">
  <div className="flex gap-1">
    <div className={`h-1 flex-1 rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-zinc-200'}`} />
    <div className={`h-1 flex-1 rounded-full ${strength >= 2 ? 'bg-amber-400' : 'bg-zinc-200'}`} />
    <div className={`h-1 flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
  </div>
  <p className="text-xs text-zinc-500">{strengthLabel}</p>
</div>
```

### Form Error Banner (Global)

For server-returned errors that don't map to a specific field:

```tsx
{formError && (
  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
    {formError}
  </div>
)}
```

### Success State

```tsx
{success && (
  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
    {success}
  </div>
)}
```

---

## Loading States

**Rule: every form submit button must show a loading state.** Never leave the user wondering if their click registered.

- Button text changes to "Processing..." or context-specific copy ("Sending email...", "Signing in...")
- Button is `disabled` during loading
- A spinner icon accompanies the loading text

---

## Page-Specific Layout Notes

| Page              | Key UI Notes                                                          |
|-------------------|-----------------------------------------------------------------------|
| `/signup`         | Password strength indicator required. Link to `/login`              |
| `/login`          | Link to `/forgot-password`. Clear error for invalid credentials.     |
| `/verify-email`   | Two states: success card, error card with resend option              |
| `/forgot-password`| Always shows success message regardless of email existence           |
| `/reset-password` | New + confirm password fields. Strength indicator optional here      |
| `/dashboard`      | Logged-in user's name/email visible. Logout button prominent         |

---

## Accessibility Requirements

- All form inputs must have visible labels (no placeholder-as-label).
- Focus rings must be visible at all times (never `outline-none` without a replacement).
- Colour alone must never be the only signal — pair colours with text ("Weak", "Fair", "Strong").
- All interactive elements must be keyboard-reachable and operable.
- Error messages must be associated with their input via `aria-describedby`.