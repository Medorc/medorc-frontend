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

## 🛠 Local Setup

```bash
npm install
npm run dev
```

Refer to `.env.example` for environment variable names.
