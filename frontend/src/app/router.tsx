import { createBrowserRouter } from 'react-router';

import RootLayout from '@/layouts/RootLayout';

import Landing from '@/pages/Landing';

import Login from '@/pages/guest/Login';
import Register from '@/pages/guest/Register';

import Chat from '@/pages/protected/Chat';
import Dashboard from '@/pages/protected/Dashboard';
import Settings from '@/pages/protected/Settings';

import GuestRoute from '@/wrappers/GuestRoute';
import ProtectedRoute from '@/wrappers/ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
                path: '/chat/:chatId',
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
    ],
  },
]);
