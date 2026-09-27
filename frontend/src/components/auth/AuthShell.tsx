import { type ReactNode } from 'react';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

interface AuthShellProps {
  children: ReactNode;
}

function AuthShell({ children }: AuthShellProps) {
  return (
    <div className='relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground antialiased'>
      {/* void backdrop — faint grid under slow ambient glows */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_30%,#000_55%,transparent_100%)] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]' />
        <div className='absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-[120px] dark:bg-cyan-400/[0.14]' />
        <div className='absolute -bottom-24 left-[6%] h-80 w-80 rounded-full bg-teal-500/[0.08] blur-[130px] dark:bg-teal-400/[0.14]' />
        <div className='absolute left-1/2 top-1/2 h-[560px] w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/[0.06] blur-[160px] dark:bg-teal-400/[0.10]' />
      </div>

      <Navbar />

      <main className='relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-32 pb-20 sm:pt-32'>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default AuthShell;
