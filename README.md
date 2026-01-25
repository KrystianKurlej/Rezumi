Rezumi
=======

Lightweight, privacy-first CV workspace built to manage many role-specific resumes and keep a record of what was sent to which company. The goal is clarity and control for the candidate, not another templated CV generator.

Highlights
---------
- Single source of truth for CV data; each language can be edited independently without duplicating records.
- Real-time PDF preview and export powered by `@react-pdf/renderer`; template selection at export time.
- Template overrides per section (show/hide, custom values) plus design variants (default + user-defined templates).
- Application tracking that stores an immutable snapshot of the CV sent with each job entry.
- Offline-first: all data lives in the browser via IndexedDB, with JSON import/export for backup or transfer.
- Settings for languages, default currency, theme, and automatic ghosted status delays.

How it works
------------
- Authoring: edit personal data, experience, education, courses, skills, links, freelance summary, and footer content. State is managed in Redux Toolkit and persisted to IndexedDB.
- Templates: maintain multiple content profiles. Each template controls which fields are visible and can inject overrides while keeping the base data untouched.
- Preview and export: live PDF preview in the app; export generates a PDF with the chosen design and language. You can also seed sample data to explore without manual entry.
- Applications: when exporting for a job, save the CV snapshot together with role, company, salary range, notes, and status. Status can auto-switch to ghosted after a configurable delay.
- Backup: export the entire IndexedDB store to JSON, re-import it later, or wipe data to start clean. No backend or accounts involved.

Architecture and tech
---------------------
- Next.js 16 (App Router) + React 19 + TypeScript.
- Redux Toolkit for state; slices cover preview, templates, settings, CV sections, and applications.
- IndexedDB persistence with import/export helpers; no external backend.
- PDF generation with `@react-pdf/renderer`; printing flow reused for saved application snapshots.
- UI: Tailwind CSS v4 + shadcn/ui + Radix primitives; custom components for dialogs, tables, and layout.
- Interaction: `@dnd-kit` for sortable lists, TanStack Table for application views.

Why I built it
--------------
Many professionals apply to dozens of roles at the same time, often in different languages and with slightly different expectations from each employer. In practice, this leads to duplicated CV files, inconsistent content, and uncertainty about what was actually sent to which company.

Most existing tools focus on visual decoration or automated scoring, while the application process itself is left unmanaged.
Rezumi addresses this gap by focusing on:
- maintaining consistent CV data across variants
- intentionally tailoring content per role or company
- keeping a clear, local history of exported CV versions
- preserving full user ownership of their data

The project is designed around transparency, local-first storage, and fast iteration without relying on external services.

Planned Features & Improvements
--------------------------------
**Bug Fixes:**
- Improve application table sorting to consider time of day, not just date (applications submitted on the same day should maintain chronological order)
- Refine PDF template styling and layout consistency across different designs
- Improve Markdown syntax render
- Update preview with template modifications

**Future Enhancements:**
- Add device size detection with Responsive Web Design support
- Add filter options for Applications table