import { createBrowserRouter } from 'react-router';

import GuestRoute from '@/components/wrappers/GuestRoute';
import ProtectedRoute from '@/components/wrappers/ProtectedRoute';

import AppLayout from '@/layouts/AppLayout';
import RootLayout from '@/layouts/RootLayout';

// Global pages
import Landing from '@/pages/Landing';
import ErrorPage from '@/pages/error/ErrorPage';

// Guest pages
import Login from '@/pages/guest/Login';
import Register from '@/pages/guest/Register';

// Protected pages
import Chat from '@/pages/protected/Chat';
import Dashboard from '@/pages/protected/Dashboard';
import Settings from '@/pages/protected/Settings';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },

      {
        element: <GuestRoute />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/dashboard',
                element: <Dashboard />,
              },
              {
                path: '/chats/new',
                element: <Chat />,
              },
              {
                path: '/chats/:chat_id',
                element: <Chat />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);
