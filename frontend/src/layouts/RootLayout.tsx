import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router';

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position='bottom-center' />
    </>
  );
}

export default RootLayout;
