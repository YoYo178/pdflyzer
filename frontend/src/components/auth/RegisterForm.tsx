import { useRegister } from '@/api/mutations/auth/useRegister';
import { useErrorToast } from '@/hooks/useErrorToast';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  IconAt,
  IconLock,
  IconMail,
  IconShieldCheck,
  IconUser,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as v from 'valibot';
import { Button } from '../ui/button';
import AuthField from './AuthField';
import PasswordToggle from './PasswordToggle';

const registerFormSchema = v.config(
  v.pipe(
    v.object({
      fullName: v.pipe(
        v.string('Invalid full name value'),
        v.trim(),
        v.minLength(1, 'Full name is required'),
        v.check((input) => input.includes(' '), 'Please enter your full name'),
      ),
      username: v.pipe(
        v.string('Invalid username value'),
        v.trim(),
        v.minLength(3, 'Username must be at least 3 characters'),
        v.maxLength(20, 'Username must not exceed 20 characters'),
        v.check(
          (input) => /^[a-zA-Z0-9_-]+$/.test(input),
          'Username can only contain letters, numbers, dashes, and underscores',
        ),
        v.check((input) => !/\s/.test(input), 'Username cannot contain spaces'),
      ),
      email: v.pipe(
        v.string('Invalid email value'),
        v.trim(),
        v.minLength(1, 'Email is required'),
        v.email('Invalid email'),
      ),
      password: v.pipe(
        v.string('Invalid password value'),
        v.minLength(8, 'Password must be at least 8 characters long'),
        v.maxLength(128, 'Password must not exceed 128 characters'),

        v.check(
          (input) => /[a-z]/.test(input),
          'Password must contain at least one lowercase letter',
        ),

        v.check(
          (input) => /[A-Z]/.test(input),
          'Password must contain at least one uppercase letter',
        ),

        v.check(
          (input) => /\d/.test(input),
          'Password must contain at least one numeric digit',
        ),

        v.check(
          (input) => /[^A-Za-z0-9]/.test(input),
          'Password must contain at least one special character',
        ),

        v.check(
          (input) => !/\s/.test(input),
          'Password must not contain whitespace or spaces',
        ),
      ),
      confirmPassword: v.pipe(
        v.string('Invalid confirm password value'),
        v.minLength(1, 'Confirm password is required'),
      ),
    }),
    v.forward(
      v.partialCheck(
        [['password'], ['confirmPassword']],
        (input) => input.password === input.confirmPassword,
        'Passwords do not match',
      ),
      ['confirmPassword'],
    ),
  ),
  { abortPipeEarly: false },
);

type TRegisterSchema = v.InferOutput<typeof registerFormSchema>;

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

  useErrorToast(error?.message);

  const onSubmit = useCallback(
    async (data: TRegisterSchema) => {
      await mutateAsync({
        email: data.email,
        name: data.fullName,
        password: data.password,
        username: data.username,
      });

      toast.success(
        'Account created successfully, redirecting to dashboard...',
        { position: 'bottom-center' },
      );

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
      <div className='grid gap-5 sm:grid-cols-2'>
        <AuthField
          id='name'
          type='text'
          label='Full name'
          icon={IconUser}
          placeholder='Anna Kim'
          autoComplete='name'
          error={errors.fullName?.message}
          autoFocus
          {...register('fullName')}
        />

        <AuthField
          id='username'
          type='text'
          label='Username'
          icon={IconAt}
          placeholder='anna_kim'
          autoComplete='username'
          spellCheck={false}
          error={errors.username?.message}
          {...register('username')}
        />
      </div>

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
        placeholder='********'
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
