import { IconLock, IconMail } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { AuthField, PasswordToggle } from '@/components/auth/AuthField';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/ui/reveal';

interface LoginErrors {
  email?: string;
  password?: string;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: LoginErrors = {};
    if (!email.trim()) {
      next.email = 'Enter your email address.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!password) {
      next.password = 'Enter your password.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
  }

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
            Sign in to pdflyzer — answer questions, verify the sources, and pick
            back up where you left off on any device.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={onSubmit}
            noValidate
            className='mx-auto mt-5 max-w-sm space-y-5 text-left'
          >
            <AuthField
              id='email'
              type='email'
              label='Email'
              icon={IconMail}
              placeholder='anna@example.com'
              autoComplete='email'
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <AuthField
              id='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              icon={IconLock}
              placeholder='••••••••'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              trailing={
                <PasswordToggle
                  shown={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                />
              }
            />

            <div className='flex items-center justify-between gap-4 pt-1'>
              <button
                type='button'
                className='text-xs font-medium text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200'
              >
                Forgot password?
              </button>

              <Button type='submit' variant='brand' size='md'>
                Sign in
              </Button>
            </div>
          </form>
        </Reveal>

        <Reveal delay={200}>
          <p className='mt-8 text-sm text-muted-foreground'>
            New to pdflyzer?{' '}
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
