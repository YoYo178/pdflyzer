import { useRegister } from '@/api/mutations/auth/useRegister';
import { registerFormSchema, type TRegisterSchema } from '@/schemas/auth';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  IconLock,
  IconMail,
  IconShieldCheck,
  IconUser,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { AuthField, PasswordToggle } from './AuthField';
import { useQueryClient } from '@tanstack/react-query';

function RegisterForm() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<TRegisterSchema>({
    resolver: valibotResolver(registerFormSchema),
  });

  const onSubmit = useCallback(
    async (data: TRegisterSchema) => {
      await mutateAsync({
        email: data.email,
        name: data.fullName,
        password: data.password,
        username: data.email, // TODO: add username field
      });

      toast.success(
        'Account created successfully, redirecting to dashboard...',
        { position: 'bottom-center' },
      );

      // Invalidate the /me endpoint so user gets redirected to chat automatically
      // TODO: Return tokens from /register on backend
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
    [mutateAsync, queryClient],
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
      <div className='grid gap-5 sm:grid-cols-2'>
        <AuthField
          id='name'
          type='text'
          label='Full name'
          icon={IconUser}
          placeholder='Anna Kim'
          autoComplete='name'
          error={errors.fullName?.message}
          {...register('fullName')}
        />

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
      </div>

      <AuthField
        id='password'
        type={showPassword ? 'text' : 'password'}
        label='Password'
        icon={IconLock}
        placeholder='At least 8 characters'
        autoComplete='new-password'
        hint='At least 8 characters — your documents are worth it.'
        error={errors.password?.message}
        trailing={
          <PasswordToggle
            shown={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          />
        }
        {...register('password')}
      />

      <AuthField
        id='confirm'
        type={showConfirm ? 'text' : 'password'}
        label='Confirm password'
        icon={IconShieldCheck}
        placeholder='Re-enter your password'
        autoComplete='new-password'
        error={errors.confirmPassword?.message}
        trailing={
          <PasswordToggle
            shown={showConfirm}
            onClick={() => setShowConfirm((v) => !v)}
          />
        }
        {...register('confirmPassword')}
      />

      <div className='flex justify-center pt-1'>
        <Button
          type='submit'
          variant='brand'
          size='lg'
          className='w-full sm:w-auto'
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;
