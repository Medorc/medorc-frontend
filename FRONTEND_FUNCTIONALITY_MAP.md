# Medorc Frontend — Functionality Map

> **Purpose**: Source-of-truth inventory of every route, component, API call, user flow, and known issue in `medorc-frontend`. Created as Phase 1 of the Complete Frontend Redesign. The existing functionality is the source of truth — the redesign must not remove or break any of it.

**Status legend**
- ✅ WORKING
- ⚠️ PARTIALLY WORKING
- ❌ BROKEN
- ❓ UNKNOWN (needs runtime verification)

**Stack**: React 19 + Vite 7 + Tailwind CSS v4 (via `@tailwindcss/vite`) + react-router-dom v7 (SPA, BrowserRouter) + axios + framer-motion + lucide-react + react-icons + react-toastify + qrcode.react + @yudiel/react-qr-scanner + Cloudinary (client uploads).

**State**: `AuthContext` (token/role/user/profileData, all persisted to `localStorage`). No server-state library; each page fetches directly with axios.

---

## Architecture Overview

```
src/
├── main.jsx                    # Root: <AuthProvider><App/></AuthProvider>
├── App.jsx                     # All <Routes>, ToastContainer, BrowserRouter
├── App.css                     # Tailwind import + Inter/Overpass fonts (Google Fonts)
├── index.css                   # EMPTY
├── api/axios.js                # Central axios instance w/ JWT request interceptor
├── config/api.js               # BACKEND_URL, API_BASE_URL, RASA_URL env resolution
├── Context/AuthContext.jsx     # login / register / logout / shcstore / updateUserProfile
├── routes/ProtectedRoute.jsx   # Role-based route guard (JWT)
├── Components/                 # Shared components (12 files)
└── Pages/
    ├── Login/                  # SignIn, SignUp, SignUp/{SPatient,SDoctor,SHostpital,SExternal}
    ├── Patient/                # Home, ProfileSettings, Account, Emergency, Logs, Records
    ├── Doctor/                 # DoctorHome, DoctorProfile, Account
    ├── Hospital/               # HospitalHome, HospitalProfile, Account
    ├── Extern/                 # ExternHome, ExternProfile, Account
    └── Common/                 # PatientRecord, CreateRecordPage, AddRecordForm, AddRecordForm2, PatientBasicDetails, PatientProfile, RecordView, Orby
```

### Key architectural facts & inconsistencies
- **API layer is split in two and most code bypasses the central client.** `api/axios.js` defines an axios instance with a JWT request interceptor, but **19 of ~25 data-fetching files use raw `axios` + `API_BASE_URL` + manual `Authorization: Bearer` headers**. Only auth flows in `AuthContext` use the instance config indirectly.
- `config/api.js` and `api/axios.js` both define `BACKEND_URL`/`API_BASE_URL` with slightly different defaults (`http://localhost:3000` vs `https://medorc-backend.onrender.com`). `config/api.js` is the one actually used everywhere.
- No design tokens / theme system. All styling is inline Tailwind utilities with many hardcoded hex colors (`#0751A7`, `#4A82B3`, `#4A90E2`, `#50E3C2`, `#0a5078`, `#4A82B3`).
- No dark mode. No reduced-motion support.
- `react-toastify` CSS is **never imported** → toasts render unstyled. ❌
- Animation utilities `animate-in fade-in slide-in-from-*` / `animate-fade-in-down` come from the `tailwindcss-animate` plugin, which is **not installed** → these classes silently do nothing. ⚠️
- Global CSS hides all scrollbars (`::-webkit-scrollbar { display: none }`). ⚠️ a11y/navigation cue issue.
- ESLint: **18 errors / 15 warnings** (unused imports, missing effect deps, one `no-undef`).

---

## Authentication

### Sign In — `/` (SignIn)
- ✅ Email + Password + Role dropdown (custom, framer-motion animated).
- ✅ POST `/api/v1/auth/signin` → `{ token, role, shc_code? }`.
- ✅ On success: `toast`, `login(token, role)`, patient also `shcstore(shc_code)`, navigate `/` + role + `/home`.
- ⚠️ "Forgot password?" link is a non-functional `<p>` (no route).
- ⚠️ Client-side role selection is combined with server-returned role; `navigate` uses the *form* role.
- ❌ Toast CSS missing (all auth feedback appears unstyled).
- Mobile: hero image hidden below `md`; centered card. OK.

### Sign Up role select — `/SignUp`
- ✅ 4 role cards (Patient / Doctor / Hospital / External) → navigate to role-specific form.
- Desktop split hero panel; mobile stacked.

### Patient Sign Up — `/signup/patient`, `/patient`
- ✅ Fields: photo, full_name, phone_no, email, password + confirm, date_of_birth, gender, blood_group, address, allergy, 5 lifestyle checkboxes.
- ✅ Photo upload → POST `/api/v1/cloudinary/photo` (immediate Cloudinary upload, URL stored in state).
- ✅ Password-match + required-field client validation via toast.
- ✅ POST `/api/v1/auth/signup` (201) → toast → navigate `/`.
- ⚠️ `confirmPassword` deleted before send; lifestyle booleans sent as-is.
- Mobile: 3-column grid collapses to 1; very long single-form page. ⚠️

### Doctor Sign Up — `/signup/doctor`, `/sDoctor`
- ✅ Full name, phone, email, password+confirm, DOB, gender, address, license_no, specializations, years_of_experience (parsed to int), hospital_affiliation, photo.
- ✅ Same upload + signup flow. 201 → navigate `/`.

### Hospital Sign Up — `/signup/hospital`, `/sHospital`
- ✅ name, email, phone, password+confirm, founded_on, type, website, address, license_no, license_valid_till, **verification_documents upload** (POST `/api/v1/cloudinary/doc`), photo/logo.
- ✅ Validates required fields incl. verification doc.

### External Sign Up — `/signup/external`, `/sExternal`
- ✅ Representative + organization details; payload nests org data under `organization_details`; dates converted to ISO.
- ✅ Doc upload required (license/reg).

### Logout
- ✅ Everywhere: `logout()` clears `token`/`role`/`shc_code`/`profileData` from localStorage and navigates to `/`.
- ⚠️ `UserCard.handleLogout` also removes a legacy `localStorage.user` key (harmless leftover).

### Protected routes — `ProtectedRoute.jsx`
- ✅ `allowedRoles` guard: no token → `/`; wrong role → `/${role}/home`.
- ✅ All role dashboards wrapped.

---

## Patient Pages

### `/patient/home` — Home (dashboard)
- ✅ Fetches GET `/api/v1/patient/profile` (SHC, QR, photo, blood group, age, visibility).
- ✅ SHC card: dark card + QR code (`qrcode.react`) + "What is SHC?" info modal.
- ✅ Doctor Access toggle → PATCH `/api/v1/patient/profile/shc-visibility`.
- ✅ Daily Health Tip: GET `/api/v1/health-tips/random`, auto-rotates every 5s with fade.
- ✅ Quick actions: Medical History → `/patient/records`, My Profile → `/patient/profile`.
- ✅ "Ask Orby AI" → `/patient/records` with `state.openOrby` (renders full-screen Orby chat).
- ⚠️ Stores SHC to localStorage under typo key `schcode` (not `shc_code`). Inconsistent with everything else.
- ⚠️ Health tip interval runs even when tab hidden / unmount cleanup exists but 5s network poll is wasteful.
- Mobile: hero stacks, SHC card stacks below. Large paddings `pt-12` cause odd spacing. ⚠️

### `/patient/profile` — ProfileSettings
- ✅ GET `/api/v1/patient/profile/personal` → personal fields.
- ✅ `PersonalDetails` component: view/edit full name, DOB, gender, blood group, address + photo upload (POST `/cloudinary/photo`) + remove photo.
- ✅ PATCH `/api/v1/patient/profile/personal` (full_name, date_of_birth, gender, blood_group, address, photo).
- ✅ Lifestyle card: 5 toggle tiles (smoking, alcoholism, tobacco, exercise, pregnancy) + "other habits" + "allergies" textareas.
- ✅ PATCH `/api/v1/patient/profile/lifestyle` with full `{newLifestyle: data}`.
- ⚠️ Tiles render a hidden checkbox for form logic (hacky but works).
- Mobile: tiles 2-col; photo column stacks above fields (`flex-col-reverse`). OK.

### `/patient/security` — Account (security)
- ✅ GET `/api/v1/patient/profile/basic` → email/phone/photo.
- ✅ `ProfileChange` component: change email / phone / password individually (PATCH `/api/v1/patient/profile/{email|phone|password|photo}`), each gated by `window.confirm`.
- ✅ Photo upload via POST `/cloudinary/photo` + PATCH `/patient/profile/photo`.
- ⚠️ Password field is cleared but never sent to a dedicated endpoint; change is via generic `PATCH /patient/profile/password` with `{newPassword}`.
- ⚠️ Duplicated identical Account page files exist for Patient/Doctor/Hospital/Extern (only the `role` differs).

### `/patient/emergency` — Emergency contacts
- ✅ GET `/api/v1/patient/profile/emergency-contacts`.
- ✅ Add contact (max 3) → POST `/api/v1/patient/profile/emergency-contact` with `{newEmergencyContact}`.
- ✅ Client validation: all fields required, phone exactly 10 digits.
- ✅ Delete → DELETE `/api/v1/patient/profile/emergency-contact` body `{emg_id}`.
- ⚠️ Contact list initially shows *nothing* (no empty state) when 0 contacts; "You can add 3 more contacts" counter only shows when >0. No skeleton.

### `/patient/logs` — Activity Logs
- ✅ GET `/api/v1/patient/profile/data-logs?shc_code=…`.
- ✅ Backend returns a **comma-separated string** of log entries; frontend splits/parses; reverse chronological by default.
- ✅ Search (string match on raw log), date range filter, asc/desc sort.
- ❌ **BROKEN**: "View Details" button calls `axios.get(\`${baseUrl}${endpoint}\`)` where `baseUrl` is **undefined** → ReferenceError on click (lint: `no-undef`).
- ⚠️ Role detection: `DOCTOR` vs everything else colored blue/red; modal profile fetch is the broken part above.

### `/patient/records` — Medical Records (patient-owned)
- ✅ POST `/api/v1/patient/records` with `{searchOptions:{sort_by,entry_type}, shc_code, searchQuery}` → list.
- ✅ Search box, sort select (Time Desc/Asc, Diagnosis A-Z), entry-type pills (All/Hospital/Doctor/Self) with framer-motion active indicator.
- ✅ GET `/api/v1/patient/profile` for the current patient header (photo, name, SHC).
- ✅ "Add Record" → `/patient/addrecord`; "Ask Orby" → opens `OrbyChat`.
- ✅ `RecordCard` list rendering with per-record creator modal + document count (GET `/patient/records/:id/documents`).
- ⚠️ No loading/empty/error states beyond "No records found". Refetch on every keystroke (no debounce).
- ⚠️ Depends on `shc_code` from AuthContext — patient must be logged in as patient.

### `/patient/addrecord` — CreateRecordPage
- ✅ Two-step wizard: `AddRecordForm` (basic) → `AddRecordForm2` (hospitalization/surgery toggles + document uploads).
- ✅ POST `/api/v1/patient/createrecord` with `{shc_code, qr_code, basicDetails, hospitalizationDetails?, surgeryDetails?, documents}`.
- ✅ Date → ISO string conversion; `reg_no` and `alternative_medicine` deleted before send.
- ✅ File uploads (prescriptions, lab_results) → POST `/cloudinary/doc` (only 2 of 4 document types wired in Form2).
- ⚠️ Uses raw `alert()` for validation on step 1. `border-black` inputs in Form2. Inconsistent styling vs rest of app.
- ⚠️ After success, redirect logic: hospital/doctor → records w/ query params; else patient → `/patient/records`.
- ⚠️ Reset block after submit references a different field set than initial state (mismatch, harmless due to redirect).

---

## Doctor Pages

### `/doctor/home` — DoctorHome (→ `UserCard`)
- ✅ GET `/api/v1/doctor/profile`.
- ✅ Profile header card, blood group/experience/specialization badges.
- ✅ **Find Patient Records**: GET `/api/v1/patient/profile?shc_code=…` → if `visibility` true → `/doctor/records?shc_code=…`, else `/doctor/PatientBasicDetails?shc_code=…`.
- ✅ **QR Verification**: camera scanner via `@yudiel/react-qr-scanner` overlay; same lookup by `qr_code`.
- ✅ Logout in header.
- ⚠️ Loading via full-screen `Loading` component (covers navbar). `handleScan` error → silent console log, no toast.
- ⚠️ Scanner overlay scanning animation uses a custom keyframe defined in an inline `<style>` (works). "Searching for code..." hint always visible.
- Mobile: cards stack; scanner is `w-80 h-80` fixed (could overflow 320px screens). ⚠️

### `/doctor/profile` — DoctorProfile
- ✅ GET `/api/v1/doctor/profile` + GET `/api/v1/doctor/profile/credentials`.
- ✅ `PesonalDetails` (old variant) display-only + editable **Professional Credentials** card (license_no, years_of_experience, hospital_affiliation, specialization).
- ✅ Verification doc: view (image/PDF modal), replace/remove in edit mode; upload to Cloudinary, then PATCH `/api/v1/doctor/profile/documents` `{newDocument}` and PATCH `/api/v1/doctor/profile/credentials` `{newCredentials}`.
- ⚠️ `delay` imported unused from framer-motion (lint error).
- ⚠️ Uses OLD `PesonalDetails` component (no blood group / no photo editing) — inconsistent with patient profile.

### `/doctor/security` — Account
- ✅ Identical to Patient Account (same `ProfileChange`, `GET /api/v1/doctor/profile/basic`).

### `/doctor/records`, `/doctor/addrecord`, `/doctor/patientbasicdetails` (+`PatientBasicDetails`), `/doctor/patientprofile`
- ✅ All render shared Common components (see below). Duplicate route with case-different URL.

---

## Hospital Pages

### `/hospital/home` — HospitalHome (→ `UserCard`)
- ✅ Same as DoctorHome; GET `/api/v1/hospital/profile`.
- ✅ Patient search by SHC + QR scan; visibility-aware redirect.
- ⚠️ Loading state is a bare `<p>Loading...</p>` (not the shared Loading) — inconsistent.

### `/hospital/profile` — HospitalProfile
- ✅ GET `/api/v1/hospital/details` + GET `/api/v1/hospital/profile/credentials`.
- ✅ Header card (photo/logo, name, type, Verified/Accredited badges) + Edit toggle.
- ✅ Two tabs: Hospital Details (name, address, phone, website) and Professional Credentials (license_no, type, founded_on, license_valid_till, verification doc).
- ✅ Save: optional Cloudinary upload of new doc → PATCH `/api/v1/hospital/profile/documents` `{newDocument}` + PATCH `/api/v1/hospital/profile/credentials` `{newCredentials}`.
- ✅ Doc preview modal (PDF iframe / image).
- ⚠️ Camera button on photo is decorative (no handler) — photo not editable on this page.

### `/hospital/security` — Account
- ✅ Same as others; maps `full_name = name` for display.

---

## External Pages

### `/extern/home` — ExternHome (→ `UserCard`)
- ✅ Same as DoctorHome; GET `/api/v1/extern/profile`.
- ✅ SHC search + QR scan.
- ⚠️ Bare `<p>Loading...</p>`.

### `/extern/profile` — ExternProfile
- ✅ GET `/api/v1/extern/profile/personal` (maps `org_address`→`address`) + GET `/api/v1/extern/profile/organization`.
- ✅ Personal card via old `PesonalDetails`; Organization header card + tabs (Details / Credentials & Docs).
- ✅ Edit org: PATCH `/api/v1/extern/profile/documents` `{newDocument}` then PATCH `/api/v1/extern/profile/organization` `{newOrganizationCredentials}`.
- ✅ Doc preview modal.
- ⚠️ Lint errors: unused `data` import, unused `uploadedDoc`.
- ⚠️ Uses old `PesonalDetails` (inconsistent).

### `/extern/security` — Account
- ✅ Same as others.

### `/extern/records` + `/extern/patientrecords`, `/extern/patientbasicdetails` (+case dup), `/extern/patientprofile`
- ✅ Shared Common components.

---

## Common (shared) Pages

### `/recordview/:record_id` — RecordView (all roles)
- ✅ POST `/api/v1/patient/records` (all records) → find by `record_id`.
- ✅ Conditionally GET hospitalization (if `is_hospitalized`), surgery (if `is_surgery`), documents via `Promise.allSettled`.
- ✅ 4 tabs: General / Treatment / Procedures / Documents. Document links open in new tab.
- ✅ Handles `shc_code`/`qr_code` query params.
- ⚠️ Loading = full-screen `Loading`. "Record not found" is a bare text div.
- ⚠️ Tabs use `animate-in fade-in` (inactive classes).

### `/recordview` helpers — RecordCard (component)
- ✅ Creator identification (Self/Doctor/Hospital) + details modal; document count fetch per card.
- ⚠️ 1 N+1 request per card for document count.
- ✅ Tags (Hospitalization/Surgery), date/time, doctor/hospital fields, "View" → `/recordview/:id?shc_code=…&qr_code=…`.

### `/doctor|hospital|extern/records` — PatientRecord
- ✅ Same search/filter/sort UI as patient Records but scoped by `qr_code`/`shc_code` from URL (scanned patient).
- ✅ GET `/api/v1/patient/profile?qr_code/shc_code` for header.
- ✅ Add Record (not for extern), User Profile button → `/…/patientprofile?…`, Ask Orby.
- ❌ **LATENT CRASH**: `RecordCard` rendered with `shc_code={userProfile.shc_code}` — if `userProfile` is `null` (e.g. no query params and no profile fetch), `.shc_code` throws TypeError.

### `/doctor|hospital|extern/patientbasicdetails` — PatientBasicDetails
- ✅ GET `/api/v1/patient/profile/personal` + emergency contacts (both with qr/shc params) via `Promise.all`.
- ✅ Renders `PersonalDetails` (new) + `EmergencyContacts` (read-only).
- ✅ Visibility-off warning message shown.
- ✅ Loading full-screen `Loading`; inline `ErrorState` component.

### `/doctor|hospital|extern/patientprofile` — PatientProfile
- ✅ GET `/api/v1/patient/profile/personal` → full health overview: PersonalDetails (old) + Lifestyle & History grid + notes.
- ✅ Empty state when no data; back button.
- ⚠️ Dynamic Tailwind classes like `bg-${colorClass}-50` **will not work** in Tailwind v4 JIT (classes built from string interpolation are not generated) → lifestyle item colors silently missing. ❌ Actually broken styling.

### `/patient/addrecord` + shared — CreateRecordPage
- Covered above (patient).

### Orby AI Chat — `OrbyChat` component
- ✅ Full-screen chat page used from Records/PatientRecord via `state.openOrby`.
- ✅ Backend connectivity check (GET `/health-tips/random`, fallback POST `/orby/chat` "ping").
- ✅ POST `/api/v1/orby/chat` `{sender, message, metadata:{shc_code, qr_code}}`; bot responses array → messages.
- ✅ DOMPurify sanitization of bot content.
- ✅ Connection badge (connecting/connected/error+retry), typing indicator, disabled input while offline.
- ⚠️ No auth token sent (public chat endpoint). Hardcoded teal/blue gradients; custom header bar.
- ⚠️ `OrbyClick.jsx` and `Pages/Common/Orby.jsx` are dead placeholder files (not used).

---

## Component Inventory

| Component | Status | Notes |
|---|---|---|
| `NavBar` | ✅ | Sticky top bar, avatar dropdown (profile/security/logout), role badge. No mobile menu. |
| `NavButton` | ✅ | Role-aware settings tabs (Profile/Security/Emergency/Logs) w/ framer-motion pill. |
| `BackButton` | ✅ | Centered back pill + title. Hardcoded `#4A82B3`/`#0751A7`. |
| `PersonalDetails` | ✅ (new) | Read/edit personal fields + photo upload/remove. Used by patient + PatientBasicDetails. |
| `PesonalDetails` | ⚠️ (old, typo) | Older variant w/o blood group or photo editing. Used by Doctor/Extern/PatientProfile. Duplicate. |
| `ProfileChange` | ✅ | Email/phone/password/photo security form (shared across all 4 roles). |
| `Profile` | ✅ | Sign-up photo circle (raw inline `<style>` block). |
| `EmergencyContacts` | ✅ | Read-only contact cards (doctor/hospital view). |
| `RecordCard` | ✅ | Record summary + creator modal. N+1 doc-count fetch. |
| `UserCard` | ✅ | Doctor/Hospital/Extern dashboard: profile header, SHC search, QR scan overlay. |
| `Loading` | ⚠️ | Full-screen spinner w/ inline NavBar; overlaps nav; no skeleton. |
| `OrbyChat` | ✅ | Full-screen AI assistant. |
| `OrbyClick` / `Orby` | ⚠️ | Dead placeholder files. |

### Duplication problems (candidates for consolidation)
1. `PersonalDetails` vs `PesonalDetails` — two overlapping implementations.
2. 4× `Account.jsx` (Patient/Doctor/Hospital/Extern) — identical wrapper around `ProfileChange`.
3. `Records.jsx` (patient) vs `PatientRecord.jsx` (roles) — ~80% duplicate search/filter UI.
4. 4× SignUp forms each re-declaring `FormInput`/`FormTextarea` with identical classes.
5. Doc-preview modal (viewer) duplicated in DoctorProfile, HospitalProfile, ExternProfile.
6. `RecordView`/`PatientBasicDetails`/`PatientProfile` each have their own empty/error/loading treatment.

---

## API Endpoint Inventory (all preserved)

| Method | Endpoint | Used By |
|---|---|---|
| POST | `/auth/signin` | SignIn |
| POST | `/auth/signup` | All 4 SignUp forms |
| POST | `/cloudinary/photo` | SignUp forms, ProfileChange, PersonalDetails |
| POST | `/cloudinary/doc` | SignUp hospital/external, CreateRecordPage |
| GET | `/patient/profile` | Patient Home, Records, PatientRecord, UserCard |
| GET | `/patient/profile/personal` | ProfileSettings, PatientBasicDetails, PatientProfile |
| PATCH | `/patient/profile/personal` | ProfileSettings |
| PATCH | `/patient/profile/lifestyle` | ProfileSettings |
| PATCH | `/patient/profile/shc-visibility` | Patient Home |
| GET | `/patient/profile/basic` | Account (patient) |
| GET | `/patient/profile/emergency-contacts` | Emergency, PatientBasicDetails |
| POST | `/patient/profile/emergency-contact` | Emergency |
| DELETE | `/patient/profile/emergency-contact` | Emergency |
| GET | `/patient/profile/data-logs` | Logs |
| POST | `/patient/records` | Records, PatientRecord, RecordView |
| POST | `/patient/createrecord` | CreateRecordPage |
| GET | `/patient/records/:id/hospitalization` | RecordView |
| GET | `/patient/records/:id/surgery` | RecordView |
| GET | `/patient/records/:id/documents` | RecordView, RecordCard |
| GET | `/doctor/profile` | DoctorHome |
| GET | `/doctor/profile/basic` | Doctor Account |
| GET | `/doctor/profile/credentials` | DoctorProfile |
| PATCH | `/doctor/profile/credentials` | DoctorProfile |
| PATCH | `/doctor/profile/documents` | DoctorProfile |
| GET | `/hospital/profile` | HospitalHome |
| GET | `/hospital/details` | HospitalProfile |
| GET | `/hospital/profile/credentials` | HospitalProfile |
| PATCH | `/hospital/profile/credentials` | HospitalProfile |
| PATCH | `/hospital/profile/documents` | HospitalProfile |
| GET | `/extern/profile` | ExternHome |
| GET | `/extern/profile/personal` | ExternProfile |
| GET | `/extern/profile/organization` | ExternProfile |
| PATCH | `/extern/profile/organization` | ExternProfile |
| PATCH | `/extern/profile/documents` | ExternProfile |
| GET | `/{role}/profile/basic` | All Account pages |
| PATCH | `/{role}/profile/{field}` | ProfileChange (email/phone/password/photo) |
| GET | `/health-tips/random` | Patient Home, OrbyChat ping |
| POST | `/orby/chat` | OrbyChat |

---

## Route Inventory (preserve all)

| Route | Page | Guard |
|---|---|---|
| `/` | SignIn | public |
| `/SignUp` | SignUp role select | public |
| `/signup/patient` · `/patient` | SPatient | public |
| `/signup/doctor` · `/sDoctor` | SDoctor | public |
| `/signup/hospital` · `/sHospital` | SHospital | public |
| `/signup/external` · `/sExternal` | SExternal | public |
| `/patient/home` | Home | patient |
| `/patient/profile` | ProfileSettings | patient |
| `/patient/security` | Account | patient |
| `/patient/emergency` | Emergency | patient |
| `/patient/logs` | Logs | patient |
| `/patient/addrecord` | CreateRecordPage | patient |
| `/patient/records` | Records | patient |
| `/doctor/home` | DoctorHome | doctor |
| `/doctor/profile` | DoctorProfile | doctor |
| `/doctor/security` | Account | doctor |
| `/doctor/records` | PatientRecord | doctor |
| `/doctor/addrecord` | CreateRecordPage | doctor |
| `/doctor/patientbasicdetails` · `/doctor/PatientBasicDetails` | PatientBasicDetails | doctor |
| `/doctor/patientprofile` | PatientProfile | doctor |
| `/hospital/home` | HospitalHome | hospital |
| `/hospital/profile` | HospitalProfile | hospital |
| `/hospital/security` | Account | hospital |
| `/hospital/records` | PatientRecord | hospital |
| `/hospital/addrecord` | CreateRecordPage | hospital |
| `/hospital/patientbasicdetails` · `/hospital/PatientBasicDetails` | PatientBasicDetails | hospital |
| `/hospital/patientprofile` | PatientProfile | hospital |
| `/extern/home` | ExternHome | extern |
| `/extern/profile` | ExternProfile | extern |
| `/extern/records` · `/extern/patientrecords` | PatientRecord | extern |
| `/extern/patientbasicdetails` · `/extern/PatientBasicDetails` | PatientBasicDetails | extern |
| `/extern/patientprofile` | PatientProfile | extern |
| `/extern/security` | Account | extern |
| `/recordview/:record_id` | RecordView | all 4 roles |
| `*` | Navigate → `/` | public |

---

## Known Issues / Risks (for redesign)

1. ❌ **`Logs.jsx`**: `baseUrl` undefined → View Details crashes (`no-undef`).
2. ❌ **`react-toastify` CSS not imported** → all toasts unstyled.
3. ❌ **`PatientRecord.jsx`**: `userProfile.shc_code` on null → TypeError when no qr/shc params.
4. ❌ **`PatientProfile.jsx`**: dynamic Tailwind classes `bg-${colorClass}-50` not generated by JIT → broken badge colors.
5. ⚠️ `tailwindcss-animate` classes used but plugin absent (animations inert).
6. ⚠️ `Records.jsx`/`PatientRecord.jsx` refetch on every keystroke (no debounce).
7. ⚠️ localStorage key typo `schcode` in Patient Home.
8. ⚠️ N+1 document-count requests per RecordCard.
9. ⚠️ 18 lint errors / 15 warnings (unused imports, effect deps).
10. ⚠️ Inconsistent loading: full-screen spinner vs bare `<p>Loading…</p>`.
11. ⚠️ Inconsistent identity components (PersonalDetails vs PesonalDetails; old vs new variants).
12. ⚠️ Hardcoded brand hex colors scattered; no tokens; no dark mode.
13. ⚠️ Global scrollbar hidden; dropdown menus not keyboard/focus friendly; weak ARIA.
14. ⚠️ No debounced search, no pagination on records/logs, no empty/error states in several lists.
15. ⚠️ `/doctor/home` errors during scan/search only console.log — no user feedback.

---

## What Must NOT Change During Redesign
- All routes (incl. backward-compat + case-duplicate URLs) and `ProtectedRoute` logic.
- All API endpoints, request/response shapes, auth (JWT in `localStorage.token`, role key), visibility logic.
- Cloudinary upload flow & env vars (`VITE_CLOUDINARY_URL`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_CLOUD_NAME`).
- Orby chat contract (`/api/v1/orby/chat` payload/response; connection check).
- Data-shape assumptions (e.g., logs returned as comma-separated string, `visibility` flag, `data.data` wrappers).
