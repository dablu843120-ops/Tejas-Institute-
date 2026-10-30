# Tejas Institute Online Examination Portal — MVP

This is a mobile-first browser prototype for the Tejas Institute CBT portal.

## Demo login
- Admin ID: `admin`
- Admin password: `Tejas@123`
- Student ID: `TI1001`
- Student password: `student123`

## Run
1. Extract the ZIP.
2. Open `index.html` in Chrome, or upload the folder to a static host.
3. Log in with the demo credentials above.

## Included in this prototype
- Admin login and dashboard
- Create exams for Classes 1–12
- Add MCQ questions with four options
- Create student accounts and assign classes
- Student login
- Mobile-friendly exam screen, timer, question palette
- Answer selection, mark for review, submit and auto-submit
- Basic score calculation and printable result card
- CSV export of submitted results
- Hindi/English toggle for the login screen

## Important limitations — not production-ready
This prototype stores data in the browser's `localStorage`. It does **not** provide secure multi-device accounts, centralized data, protected answer keys, server-side timing, reliable cross-device autosave, or true rank calculation. Demo credentials are visible in the source. Do not publish it for real examinations or enter real student data.

## Production upgrade checklist
Before real student use, connect a secure backend such as Supabase:
- Supabase Auth or server-managed credentials; never store plaintext passwords.
- Tables: profiles, classes, subjects, exams, questions, exam_attempts, responses.
- Row Level Security so students can access only their own attempts and admins can manage institute data.
- Keep correct answers server-side; grade only after submission.
- Server-side exam start/end timestamps and submission endpoint.
- Autosave each response to the server; restore after reconnect.
- Generate rank cards and rank by exam after all submissions are finalized.
- Add audit logs, backups, rate limiting, and admin MFA.

The included `supabase-schema.sql` is a starting point only and must be reviewed and configured before production.
