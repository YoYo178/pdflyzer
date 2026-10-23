import { Link } from 'react-router';

import AuthFlow from '@/components/auth/AuthFlow';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import Reveal from '@/components/ui/reveal';

function Login() {
  return (
    <AuthShell>
      <div className='w-full max-w-7xl text-center'>
        <Reveal>
          <h1 className='mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl'>
            Welcome back.
            <span className='mt-2 block bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-cyan-300 dark:to-teal-300'>
              Your docs, waiting.
            </span>
          </h1>

          <p className='mx-auto mt-2.5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'>
            Sign in to PDFlyzer — answer questions, verify the sources, and pick
            back up where you left off on any device.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <AuthFlow mode='login' form={<LoginForm />} />
        </Reveal>

        <Reveal delay={200}>
          <p className='mt-8 text-sm text-muted-foreground'>
            New to PDFlyzer?{' '}
            <Link
              to='/register'
              className='font-medium text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200'
            >
              Create a free account
            </Link>
          </p>
        </Reveal>
      </div>
    </AuthShell>
  );
}

export default Login;
