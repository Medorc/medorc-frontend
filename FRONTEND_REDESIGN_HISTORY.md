# Medorc Frontend — Redesign History

> **Purpose**: Log of every frontend redesign decision, file changed, and verification result for `medorc-frontend`. Pair with `FRONTEND_FUNCTIONALITY_MAP.md` (the "before" inventory). The redesign's hard rule: **functionality first** — all routes, API contracts, auth flows, Cloudinary flows, and the Orby chat contract must be preserved.

---

## Design System (new)

### Tokens — `src/styles/tokens.css`
- CSS custom properties prefixed `--t-*` mapped to Tailwind v4 theme via `@theme inline` in `src/styles/tokens.css` → utilities like `bg-background`, `bg-surface`, `bg-surface-hover`, `text-foreground`, `text-muted`, `text-subtle`, `border-border`, `shadow-card` / `shadow-lift` / `shadow-pop`, `font-display`, `font-sans`.
- Role tones: `primary` (clinical teal), `success`, `warning`, `danger`, `info`, plus per-creator tones `doctor` and `hospital` (used by RecordCard / RecordView / Logs creator detail).
- Soft fills: `bg-primary-soft`, `bg-success-soft`, `bg-warning-soft`, etc.
- Dark mode: `.dark` class on `<html>` + Tailwind v4 `@custom-variant dark`; auto-apply + manual toggle in `ThemeContext.jsx` (`src/Context/ThemeContext.jsx`), `ThemeToggle` button in `NavBar`.
- `prefers-reduced-motion` honored in `tokens.css`.
- Scrollbars now **thin and visible** (old global `display:none` removed).

### Shared UI primitives — `src/Components/ui/`
- `Button.jsx` — variants: primary / secondary / primarySoft / outline / ghost / danger / success; sizes sm / md / lg.
- `Card.jsx` / `CardHeader` / `CardBody` — token-based surfaces.
- `Badge.jsx` — tones: primary / neutral / success / warning / danger / info / doctor / hospital.
- `Modal.jsx` — accessible dialog (ESC close, overlay click, focus, aria), sizes sm / md / lg, `footer` slot, `animate-fade-in`.
- `Field.jsx` — named exports `Input` / `Textarea` / `Select` with label support.
- `EmptyState.jsx` — `title` / `description` / `action` props, icon slot.
- `ErrorState.jsx` — `title` / `description` / `retry` props.
- Also in `src/Components/`: `Loading.jsx` (shared full-screen + inline variants), `PageHeader.jsx`, `ProfileField.jsx`, `DocumentUpload.jsx`, `DocumentPreviewModal.jsx`, `SignUpField.jsx`, `SignUpShell.jsx`, `AuthLayout.jsx`.

---

## Routes — `src/App.jsx`
- **Preserved every route** from the map including backward-compat signup routes (`/patient`, `/sDoctor`, `/sHospital`, `/sExternal`) and case-duplicate URLs (`/doctor|hospital|extern/PatientBasicDetails`).
- All role dashboards still wrapped in `ProtectedRoute` with the same `allowedRoles`.
- **Perf**: route-level code splitting via `React.lazy` + `<Suspense fallback={<Loading />}>` (helper `withSuspense`). Entry bundle dropped from **812.68 kB → 301.78 kB** (gzip 98.65 kB); pages load as per-route chunks.
- Fallback `*` → `<Navigate to="/" replace />` unchanged.

---

## ESLint
- **Root cause found**: ESLint's core `no-unused-vars` does not treat JSX identifiers (`<Icon/>`, `motion.div`) as usage, causing false positives (icon imports, `Tag`, `Icon` destructuring). Fixed by installing `eslint-plugin-react` (devDependency) and enabling `react/jsx-uses-vars` in `eslint.config.js`; removed the old `varsIgnorePattern: '^[A-Z_]'` hack.
- Current config: `ecmaVersion: 'latest'`, `parserOptions.ecmaFeatures.jsx: true`, `settings.react.version: 'detect'`, `no-unused-vars` with `argsIgnorePattern` / `caughtErrorsIgnorePattern` / `destructuredArrayIgnorePattern` all `'^_'`.
- Removed unused `import React from "react"` from ~57 files (Vite React plugin provides the automatic JSX runtime). **Note**: files that originally had `import React, { useState } from "react"` had their hook imports restored to `import { ... } from "react"` after the batch strip — verified by full lint pass.
- Genuine fixes: unused `CLOUDINARY_URL`/`CLOUDINARY_UPLOAD_PRESET` (CreateRecordPage), unused `Stethoscope` (DoctorProfile), unused `CardHeader` (Extern/HospitalProfile), unused `confirm`/`res` (ProfileChange), unused `next` param (Home `toggleVisibility`), unused `catch (e)` → `catch` (AuthContext), unused `data`/`uploadedDoc` (ExternProfile).
- Added `/* eslint-disable react-refresh/only-export-components */` to `AuthContext.jsx` and `ThemeContext.jsx`.
- Missing effect deps added: `navigate` (DoctorHome / ExternHome / HospitalHome), `urlPersonal` (ProfileSettings), `profileData?.shc_code` (Records), `shc_code` (PatientBasicDetails), `qr_code` + `shc_code` (RecordView). Profile-page fetch effects (`getProfile`/`getOrganization`) wrapped in `useCallback` and included in deps (DoctorProfile / ExternProfile / HospitalProfile).
- **Result**: `npx eslint .` → **0 errors, 0 warnings**.

---

## Page & Component Redesigns

### Common pages (`src/Pages/Common/`)
- **`AddRecordForm.jsx`** (wizard step 1) — redesigned with `Input`/`Textarea`/`Button`/`Card` primitives. **All original fields preserved** (verified against git HEAD): diagnosis_name, doctor_name, history_of_present_illness, treatment_undergone, hospital_name, appointment_date, reg_no, alternative_medicine. Cancel → `navigate(-1)`, Next → `onNext`.
- **`AddRecordForm2.jsx`** (wizard step 2) — redesigned with primitives; preserved `useRef` hidden file inputs, prescriptions/lab_results upload buttons, Hospitalization (room_no, reason, treatment_undergone, duration) and Surgery (type, duration, bed_no, medical_condition, outcome) toggle cards, Back/Add buttons.
- **`CreateRecordPage.jsx`** — two-step wizard wrapper; replaced `alert()` with `toast.warning` for diagnosis validation; preserved initial `formData` shape, `handleFileUpload` (`/cloudinary/doc`), the `reg_no`/`alternative_medicine` delete-before-send behavior, ISO date conversion, `POST /patient/createrecord` payload (basicDetails + conditional hospitalization/surgeryDetails + documents), and role-based post-submit redirect. Reset block after submit matches the original field set.
- **`PatientRecord.jsx`** — redesigned header (avatar, SHC, Back / Add Record / User Profile / Ask Orby), search + sort + entry-type pills. **Fixed the latent crash** flagged in the map (`userProfile.shc_code` on null → now `userProfile?.shc_code || shc_code`). Preserved `/patient/records` + `/patient/profile` fetches and the `openOrby` chat handoff.
- **`PatientBasicDetails.jsx`** — token redesign; preserves `Promise.all` of `/patient/profile/personal` + `/patient/profile/emergency-contacts`, visibility-off warning, renders read-only `PersonalDetails` + `EmergencyContacts`; deps include `shc_code`.
- **`PatientProfile.jsx`** — token redesign; preserves `/patient/profile/personal` fetch; lifestyle grid uses **static tone map** (fixes the old broken `bg-${colorClass}-50` dynamic classes); empty state when no user; back button.
- **`RecordView.jsx`** — token redesign with General / Treatment / Procedures / Documents tabs. **Preserved every API call**: `POST /patient/records` lookup, conditional `/patient/records/:id/hospitalization` + `:id/surgery` via `Promise.allSettled`, `/patient/records/:id/documents`. Field names unchanged (`record.reg_no`, `doctor_name`, `hospital_name`, `history_of_present_illness`, `treatment_undergone`, hospitalization `.duration/.room_no/.reason`, surgery `.type/.duration/.outcome`).
- **`RecordCard.jsx`** — token redesign (Badge/Button/Modal/Card). **Preserved creator-detection logic** (isSelf / isDoctor / isHospital, `record.patient` / `record.doctor` / `record.hospital` object lookup, specializations string-or-array handling), document-count fetch (GET `/patient/records/:id/documents`), Hospitalization/Surgery tags, date/time formatting, and `View` → `/recordview/:id?shc_code=…&qr_code=…`.
- **`Orby.jsx`** — remains a dead placeholder (unused by any route); cleaned import only.

### Shared components (`src/Components/`)
- **`EmergencyContacts.jsx`** — token redesign; danger-toned header, contact cards with `tel:` links, empty state. Read-only (used by PatientBasicDetails).
- **`OrbyChat.jsx`** — token redesign. **All chat logic preserved**: connection check via `/health-tips/random` (5s timeout) with `/orby/chat` "ping" fallback, `POST /orby/chat` with `{sender, message, metadata:{shc_code, qr_code}}`, DOMPurify sanitization of bot responses, status badge (connecting/connected/error+retry), typing indicator, disabled input while offline.
- **`PersonalDetails.jsx`** — the "new" variant (read/edit + photo upload/remove) is the canonical one; misspelled `PesonalDetails.jsx` **deleted** and all importers (DoctorProfile, ExternProfile, PatientProfile) switched to `PersonalDetails`. (Build re-verified after deletion.)
- **`NavBar.jsx`, `NavButton.jsx`, `BackButton.jsx`, `UserCard.jsx`, `Profile.jsx`, `ProfileChange.jsx`** — token restyle; all nav/filter/security behavior preserved.

### Other pages (`src/Pages/…`)
- Patient: `Home.jsx`, `ProfileSettings.jsx`, `Emergency.jsx`, `Logs.jsx`, `Records.jsx` — token redesigns. **`Logs.jsx` broken "View Details" crash fixed** (was `baseUrl` undefined → now uses `API_BASE_URL/${log.role.toLowerCase()}/profile`). `Records.jsx` preserves the `/patient/records` + `/patient/profile` contract.
- Doctor / Hospital / Extern: `DoctorProfile.jsx`, `HospitalProfile.jsx`, `ExternProfile.jsx`, `DoctorHome.jsx`, `HospitalHome.jsx`, `ExternHome.jsx` — token redesigns; all profile endpoints (`/doctor/profile`, `/doctor/profile/credentials`, `/doctor/profile/documents`, `/hospital/details`, `/hospital/profile/credentials`, `/extern/profile/personal`, `/extern/profile/organization`) and doc upload flows preserved.
- Auth: `SignIn.jsx` + `SignUp.jsx` + `SignUp/SPatient|SDoctor|SHostpital|SExternal` — token redesign; `/auth/signin`, `/auth/signup`, `/cloudinary/photo`, `/cloudinary/doc` contracts unchanged.

---

## Known Remaining Issues (intentional / deferred)
1. **RecordCard document-count N+1** — one GET `/patient/records/:id/documents` per card; no bulk endpoint exists, so kept.
2. **No debounced search / pagination** on Records / PatientRecord / Logs (keystroke refetch remains).
3. **`schcode` localStorage typo** in Patient `Home.jsx` — write-only (nothing reads it), left for backward compatibility.
4. **`npm audit`** — 31 reported vulnerabilities, all pre-existing transitive deps; no audit-fix run.
5. OrbyChat sends no auth token (public chat endpoint — by design).
6. React Hook `exhaustive-deps` on profile pages resolved via `useCallback` (see ESLint section) — no warnings remain.

---

## Verification
- ✅ `npx eslint .` → **0 errors, 0 warnings**.
- ✅ `npm run build` (Vite) → **success**, 2253 modules, no `>500kB` chunk warnings; entry 301.78 kB (gzip 98.65 kB) + per-route chunks.
- ✅ Route regression: every route in the map's Route Inventory exists in `App.jsx` with the same page + guard (incl. backward-compat + case-duplicate URLs).
- ✅ API contract regression: grep-verified every endpoint in the map's Endpoint Inventory is still called with the same payload field names (signin/signup, cloudinary photo/doc, patient profile/personal/lifestyle/visibility/basic/emergency-contacts/data-logs/records/createrecord, per-role profile/credentials/documents, health-tips/random, orby/chat).
- ✅ AuthContext localStorage contract (`token`, `role`, `shc_code`, `profileData`) unchanged.
- ⚠️ Runtime smoke test (login → each role → records/recordview/addrecord/profile) not yet executed against a live backend — recommended before deploy.

---

## File Inventory of Changes
- `src/styles/tokens.css` (new), `src/App.css`, `src/App.jsx` (lazy routes), `src/main.jsx`.
- `eslint.config.js`, `package.json` (+ `eslint-plugin-react`).
- `src/Components/`: NavBar, NavButton, BackButton, PersonalDetails (+`PesonalDetails.jsx` deleted), Profile, ProfileChange, UserCard, EmergencyContacts, RecordCard, OrbyChat, Loading, `ui/*` (new).
- `src/Context/`: AuthContext, ThemeContext (new).
- `src/Pages/`: all Patient/Doctor/Hospital/Extern pages, Login/SignUp forms, Common pages (AddRecordForm, AddRecordForm2, CreateRecordPage, PatientRecord, PatientBasicDetails, PatientProfile, RecordView).
