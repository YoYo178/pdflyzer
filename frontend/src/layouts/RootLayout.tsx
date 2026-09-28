import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  );
}

export default RootLayout;
