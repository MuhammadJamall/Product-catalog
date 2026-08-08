# Product Catalog - Agent Guide

## Commands
- `npm run dev` - Start dev server (Vite)
- `npm run build` - Production build
- `npm run lint` - Run ESLint (flat config)
- `npm run preview` - Preview production build

## Stack
- React 19 + Vite 8 (no TypeScript)
- Redux Toolkit for state
- React Router v7 for routing
- ESLint flat config with react-hooks + react-refresh

## Architecture
- Entry: `src/main.jsx` → `App.jsx` with Redux Provider + BrowserRouter
- Store: `src/store/index.js` combines slices (products, cart, categories, tasks, auth)
- Auth: `LoginPage` + `ProtectedRoute` wrapper guards all non-login routes
- Pages: ProductList, ProductDetail, CreateProduct, TaskList, TaskDetail, CreateTask
- API utils: `src/utils/api.js` (if present)

## Key Conventions
- All routes except `/login` require authentication via `ProtectedRoute`
- Redux slices in `src/store/*Slice.js`
- Components in `src/components/`, pages in `src/pages/`
- No test framework configured
- No TypeScript - uses `.jsx` extensions