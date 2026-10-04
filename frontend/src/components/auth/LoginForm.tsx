import { useLogin } from '@/api/mutations/auth/useLogin';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { IconLock, IconMail } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as v from 'valibot';
import { Button } from '../ui/button';
import { AuthField, PasswordToggle } from './AuthField';

const loginFormSchema = v.object({
  email: v.pipe(
    v.string('Invalid email value'),
    v.trim(),
    v.minLength(1, 'Email is required'),
    v.email('Invalid email'),
  ),
  password: v.pipe(
    v.string('Invalid password value'),
    v.minLength(1, 'Password is required'),
  ),
});

type TLoginSchema = v.InferOutput<typeof loginFormSchema>;

function LoginForm() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<TLoginSchema>({
    resolver: valibotResolver(loginFormSchema),
  });

  useEffect(() => {
    if (!error?.message) return;

    toast.error(error.message, { position: 'bottom-center' });
  }, [error?.message]);

  const onSubmit = useCallback(
    async (data: TLoginSchema) => {
      const { email, password } = data;

      await mutateAsync({ login: email, password });

      toast.success('Signed in successfully, redirecting to dashboard...', {
        position: 'bottom-center',
      });

      // Invalidate the /me endpoint so user gets redirected to chat automatically
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    [mutateAsync, queryClient],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='space-y-5 text-left'
    >
      <AuthField
        id='email'
        type='email'
        label='Email'
        icon={IconMail}
        placeholder='anna@example.com'
        autoComplete='email'
        spellCheck={false}
        error={errors.email?.message}
        autoFocus
        {...register('email')}
      />

      <AuthField
        id='password'
        type={showPassword ? 'text' : 'password'}
        label='Password'
        icon={IconLock}
        placeholder='••••••••'
        autoComplete='current-password'
        error={errors.password?.message}
        trailing={
          <PasswordToggle
            shown={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          />
        }
        {...register('password')}
      />

      <div className='flex items-center justify-between gap-4 pt-1'>
        <button
          type='button'
          className='text-xs font-medium text-teal-600 transition-colors hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200'
        >
          Forgot password?
        </button>

        <Button type='submit' variant='brand' size='md' disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
