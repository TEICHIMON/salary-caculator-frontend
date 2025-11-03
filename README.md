# Salary Calculator Frontend

React 19 frontend application for calculating monthly salary with calendar interface.

## Features

- **React 19** with Hooks, Suspense, and ErrorBoundary
- **Authentication** - Login/Register
- **Calendar View** - Click days to add work sessions
- **Multiple Time Periods** - Add multiple work periods per day with different salary types
- **Overlap Prevention** - Prevents overlapping time entries
- **Summary View** - Monthly and custom period salary calculations
- **Salary Type Management** - Create custom hourly rates
- **Export Reports** - Download salary reports as CSV
- **Responsive Design** - Tailwind CSS

## Requirements

- Node.js 18+ and npm
- (Or Docker)

## Quick Start (Development)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will start on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Docker

Build and run with Docker:
```bash
docker build -t salary-frontend .
docker run -p 3000:80 salary-frontend
```

## Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Calendar.jsx
│   ├── Summary.jsx
│   ├── SalaryTypeManager.jsx
│   ├── WorkSessionModal.jsx
│   ├── ErrorBoundary.jsx
│   ├── Loading.jsx
│   └── PrivateRoute.jsx
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── services/        # API services
│   └── api.js
├── utils/           # Utility functions
│   └── dateUtils.js
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## Features Usage

### Calendar
- Click on any past or current date to add work sessions
- Green highlighting indicates days with work sessions
- Shows number of sessions and total hours per day

### Work Sessions
- Add multiple time periods per day
- Each period can have different salary type
- Automatic overlap validation
- Edit or delete existing sessions

### Summary
- View monthly statistics (work days, hours, salary)
- Calculate custom period summaries
- Export reports as CSV

### Salary Types
- Default types: Regular (1300¥/h), Premium (1500¥/h)
- Create custom salary types
- Edit/delete your custom types (system types are read-only)
