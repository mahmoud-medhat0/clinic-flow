# ClinicFlow Quick Start Guide

Get up and running with ClinicFlow Doctor Dashboard in minutes.

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 16.0+ | `node --version` |
| npm | 8.0+ | `npm --version` |

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd clinicflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## First Login

1. Navigate to `http://localhost:3000/#/login`
2. Enter any email and password (mock authentication)
3. Click **Login** to access the dashboard

> [!TIP]
> The default mock user is **Dr. Ahmed** with admin role.

---

## Application Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         TopBar                               │
│  [≡]  Dashboard                    🔔  🌐  🌙  👤            │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                    │
│         │                                                    │
│ Sidebar │              Main Content Area                     │
│         │                                                    │
│  📊     │              (Page renders here)                   │
│  📅     │                                                    │
│  👥     │                                                    │
│  📦     │                                                    │
│  📄     │                                                    │
│  ⚙️     │                                                    │
│         │                                                    │
└─────────┴───────────────────────────────────────────────────┘
```

---

## Key Features Overview

### Dashboard (`/`)

Your command center with:
- **Statistics Cards** - Key metrics at a glance
- **Today's Appointments** - Quick schedule view
- **Quick Actions** - One-click access to common tasks

### Appointments (`/appointments`)

- **Calendar View** - Weekly schedule with time slots
- **List View** - Sortable data table
- **Drag & Drop** - Reschedule by dragging
- **CRUD** - Create, edit, delete appointments

### Patients (`/patients`)

- **Patient List** - Searchable, filterable table
- **Patient Profiles** - Detailed patient information
- **Visit History** - Track all patient visits

### Inventory (`/inventory`)

- **Items Management** - Track medical supplies
- **Categories** - Organize inventory
- **Stock Movements** - Record in/out transactions

### Invoices (`/invoices`)

- **Invoice List** - All billing records
- **Status Tracking** - Paid, pending, overdue
- **Print Support** - Generate printable invoices

### Settings (`/settings`)

- **Clinic Info** - Basic details
- **Working Hours** - Schedule configuration
- **Preferences** - Theme, language settings

---

## Changing Language

1. Click the language icon (🌐) in the TopBar
2. Select from:
   - 🇺🇸 English (LTR)
   - 🇸🇦 العربية (RTL)
   - 🇫🇷 Français (LTR)

The app will automatically switch direction for RTL languages.

---

## Switching Theme

Click the theme toggle (🌙/☀️) in the TopBar to switch between:
- **Light Mode** - Clean, bright interface
- **Dark Mode** - Easy on the eyes, reduces strain

---

## Common Tasks

### Adding a Patient

1. Navigate to **Patients** (`/patients`)
2. Click **+ Add Patient**
3. Fill in the form:
   - Name
   - Phone
   - Email
   - Date of Birth
   - Blood Type
   - Address
4. Click **Save**

### Creating an Appointment

1. Navigate to **Appointments** (`/appointments`)
2. Click **+ Add Appointment**
3. Fill in the form:
   - Select Patient
   - Choose Date & Time
   - Select Type
   - Set Duration
   - Add Notes (optional)
4. Click **Save**

### Managing Inventory

1. Navigate to **Inventory** (`/inventory`)
2. Use tabs to switch between:
   - **Items** - Add/edit products
   - **Categories** - Organize items
   - **Movements** - Record stock in/out

### Creating an Invoice

1. Navigate to **Invoices** (`/invoices`)
2. Click **+ New Invoice**
3. Fill in the form:
   - Select Patient
   - Enter Service
   - Set Amount
   - Set Due Date
4. Click **Save**

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Focus search |
| `Esc` | Close modal/menu |

---

## Troubleshooting

### App won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Login not working

The app uses mock authentication. Any email/password combination will work.

### Styles look broken

```bash
# Rebuild CSS
npm run build
npm run dev
```

### RTL not working

Check that:
1. Language is set to Arabic (ar)
2. Browser supports RTL
3. Clear localStorage: `localStorage.clear()`

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

---

## File Locations

| What | Where |
|------|-------|
| Pages | `src/pages/` |
| Components | `src/components/` |
| Styles | `src/App.css` |
| Translations | `src/i18n/` |
| Context | `src/context/` |

---

## Getting Help

- 📖 [Full Documentation](./doctor-dashboard.md)
- 🧩 [Components Reference](./components-reference.md)
- 🐛 Report issues to the development team

---

## Next Steps

1. Explore each page to understand the features
2. Try creating sample data (patients, appointments)
3. Test the inventory management system
4. Generate a few invoices
5. Customize settings to your preference

Happy coding! 🎉
