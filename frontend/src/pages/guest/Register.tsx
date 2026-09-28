import { Link } from 'react-router';

import AuthShell from '@/components/auth/AuthShell';
import RegisterForm from '@/components/auth/RegisterForm';
import Reveal from '@/components/ui/reveal';

function Register() {
  return (
    <AuthShell>
      <div className='w-full max-w-7xl text-center'>
        <Reveal>
          <h1 className='mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl'>
            Create your account.
            <span className='mt-2 block bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-cyan-300 dark:to-teal-300'>
              Start free, stay private.
            </span>
          </h1>

          <p className='mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'>
            Chat with your documents in seconds. No credit card, no surprises —
            every chat stays scoped to you.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <RegisterForm />
        </Reveal>

        <Reveal delay={200}>
          <p className='mt-8 text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200'
            >
              Sign in
            </Link>
          </p>
        </Reveal>
      </div>
    </AuthShell>
  );
}

export default Register;
