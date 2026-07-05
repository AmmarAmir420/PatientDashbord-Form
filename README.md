# Healthcare Dashboard UI

Angular application recreating two healthcare dashboard screens using a component-based architecture, **Angular Material**, **Tailwind CSS**, and static mock data (no backend).

## Screens

1. **Dashboard** (`/`) — header search, quick shortcuts, worklist, clinical actions, recent patients, and sticky notes.
2. **Patient visit** (`/patient-visit/new`) — create and view patient visit forms with reactive validation, appointment date/time picker, and read-only detail mode from worklist/recent patients.

## Tech stack

- Angular 19 (standalone components, signals, lazy routes)
- Angular Material (form fields, datepicker, menu, radio, icons)
- Tailwind CSS v4 (layout, spacing, responsive design)
- RxJS + typed reactive forms

## Getting started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Other commands

```bash
npm run build          # Production build
npm test               # Unit tests (Karma + Jasmine)
npm test -- --watch=false --browsers=ChromeHeadless   # Single test run
```

## Project structure

```
src/app/
├── core/           Constants, mocks, HealthcareStoreService (in-memory state)
├── features/
│   ├── dashboard/  Dashboard page and sub-components
│   └── patient-visit/
├── layouts/        Main layout, header, reusable UI components
└── shared/         Enums, interfaces, utilities
```

## AI assistance disclosure

This project was developed with AI assistance as permitted by the assignment. The tool used and its purpose are listed below.

| Tool | Purpose |
|------|---------|
| **[Cursor](https://cursor.com)** (AI-assisted IDE) | Primary development environment. Used to scaffold the Angular project structure, generate and refactor components, implement responsive layouts, wire routing and state, fix bugs, remove duplicated code, and align UI details with the assignment reference (e.g. notification badge styling, search field layout). |
| **Cursor Agent / Chat** | Used for iterative feature work: patient ID formatting, worklist sorting, create vs detail visit modes, code quality review against assignment requirements, and documentation (this README). |

All AI-generated code was reviewed and integrated into the final implementation. Business logic, component structure, and styling decisions were validated through manual review and local builds/tests.

