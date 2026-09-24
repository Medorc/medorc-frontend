# Medorc Web Application (Frontend)

Modern, healthcare-focused Single Page Application (SPA) for the **Medorc Platform**. Built with React 18, Vite, and Tailwind CSS.

---

## 🚀 Features

* **Multi-Role Dashboards**: Customized interfaces for Patients, Healthcare Professionals, Hospitals, and External Partners.
* **Authentication Guard**: `ProtectedRoute` higher-order component enforcing JWT role permissions.
* **Personal Profile Management**: Profile picture upload/preview/removal, blood group selection (`A+`, `A-`, `B+`, `B-`, etc.), and personal details editing.
* **Account & Security**: Dedicated security settings for password updates, contact updates, and SHC visibility controls.
* **Medical Records Viewer**: View, filter, create, and inspect patient medical history records and reports.
* **ORBY AI Assistant**: Interactive chatbot widget connecting to the RASA chatbot service.

---

## ⚡ Instant Demo Access
The sign-in page features a 1-click **Instant Demo Login** with pre-configured personas for all 4 roles:

| Role | Name | Email | Password | Pre-loaded Context |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | Ilakkiyan J | `ilakkiyanj.pt@medorc.in` | `password123` | Active SHC code (`SHC-8F92A140`), 3 medical records, emergency contacts |
| **Doctor** | Dr. Ananya Roy | `dr.ananya@medorc.in` | `password123` | General Medicine, 8 yrs experience, clinical logs |
| **Hospital** | Apollo Multi-Specialty | `apollo@medorc.in` | `password123` | Multi-specialty license, surgery & hospitalization entries |
| **External** | Central Diagnostic Lab | `diagnostic@medorc.in` | `password123` | Diagnostic lab verification & viewer access |

---

## 🛠 Local Setup

```bash
npm install
npm run dev
```

Refer to `.env.example` for environment variable names.
