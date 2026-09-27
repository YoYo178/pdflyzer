import {
  IconLock,
  IconMail,
  IconShieldCheck,
  IconUser,
} from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';

import { AuthField, PasswordToggle } from '@/components/auth/AuthField';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/ui/reveal';

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: RegisterErrors = {};
    if (!name.trim()) {
      next.name = 'Enter your name.';
    }
    if (!email.trim()) {
      next.email = 'Enter your email address.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!password) {
      next.password = 'Enter a password.';
    } else if (password.length < 8) {
      next.password = 'Use at least 8 characters.';
    }
    if (confirm !== password) {
      next.confirm = 'Passwords do not match.';
    }
    if (!agree) {
      next.terms = 'Please accept the terms to continue.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
  }

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
          <form
            onSubmit={onSubmit}
            noValidate
            className='mx-auto mt-5 max-w-sm space-y-5 text-left'
          >
            <div className='grid gap-5 sm:grid-cols-2'>
              <AuthField
                id='name'
                type='text'
                label='Full name'
                icon={IconUser}
                placeholder='Anna Kim'
                autoComplete='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />

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
            </div>

            <AuthField
              id='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              icon={IconLock}
              placeholder='At least 8 characters'
              autoComplete='new-password'
              hint='At least 8 characters — your documents are worth it.'
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

            <AuthField
              id='confirm'
              type={showConfirm ? 'text' : 'password'}
              label='Confirm password'
              icon={IconShieldCheck}
              placeholder='Re-enter your password'
              autoComplete='new-password'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              trailing={
                <PasswordToggle
                  shown={showConfirm}
                  onClick={() => setShowConfirm((v) => !v)}
                />
              }
            />

            <div className='space-y-1.5 pt-1'>
              <label className='flex items-start gap-2.5 text-[13px] text-muted-foreground'>
                <input
                  type='checkbox'
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className='mt-0.5 h-4 w-4 shrink-0 accent-teal-600 dark:accent-teal-300'
                />
                <span>
                  I agree to the{' '}
                  <span className='font-medium text-teal-600 dark:text-teal-300'>
                    Terms
                  </span>{' '}
                  and{' '}
                  <span className='font-medium text-teal-600 dark:text-teal-300'>
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className='text-xs text-destructive'>{errors.terms}</p>
              )}
            </div>

            <div className='flex justify-center pt-1'>
              <Button
                type='submit'
                variant='brand'
                size='lg'
                className='w-full sm:w-auto'
              >
                Create account
              </Button>
            </div>
          </form>
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
