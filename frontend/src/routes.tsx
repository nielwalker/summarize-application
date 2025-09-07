import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RequireAuth from './components/RequireAuth'

const LoginPage = lazy(() => import('./screens/LoginPage'))
const StudentDashboard = lazy(() => import('./screens/student/StudentDashboard'))
const CoordinatorDashboard = lazy(() => import('./screens/coordinator/CoordinatorDashboard'))
const ChairmanDashboard = lazy(() => import('./screens/chairman/ChairmanDashboard'))

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <Suspense fallback={null}><LoginPage /></Suspense> },
  {
    path: '/student',
    element: (
      <RequireAuth roles={["student"]}>
        <Suspense fallback={null}><StudentDashboard /></Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/coordinator',
    element: (
      <RequireAuth roles={["coordinator"]}>
        <Suspense fallback={null}><CoordinatorDashboard /></Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '/chairman',
    element: (
      <RequireAuth roles={["chairman"]}>
        <Suspense fallback={null}><ChairmanDashboard /></Suspense>
      </RequireAuth>
    ),
  },
])


