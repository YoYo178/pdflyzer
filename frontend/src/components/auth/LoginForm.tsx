import { useLogin } from '@/api/mutations/auth/useLogin';
import { loginFormSchema, type TLoginSchema } from '@/schemas/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { IconLock, IconMail } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { AuthField, PasswordToggle } from './AuthField';

function LoginForm() {
  const { mutateAsync, isPending, error } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<TLoginSchema>({
    resolver: valibotResolver(loginFormSchema),
  });

  const onSubmit = useCallback(
    async (data: TLoginSchema) => {
      await mutateAsync({
        login: data.email,
        password: data.password,
      });

      toast.success('Signed in successfully, redirecting to dashboard...', {
        position: 'bottom-center',
      });

      // TODO: Redirect user to dashboard or chat
    },
    [mutateAsync],
  );

  useEffect(() => {
    if (!error?.message) return;

    toast.error(error.message, { position: 'bottom-center' });
  }, [error?.message]);

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
