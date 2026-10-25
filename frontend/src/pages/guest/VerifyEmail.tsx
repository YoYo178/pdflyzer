import { useVerifyEmail } from '@/api/mutations/auth/useVerifyEmail';
import { useResendEmail } from '@/api/mutations/auth/useResendEmail';
import OTPInput from '@/components/auth/OTPInput';
import AuthShell from '@/components/auth/AuthShell';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/ui/reveal';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useQueryClient } from '@tanstack/react-query';
import { IconMail } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = searchParams.get('user_id');
  const method = searchParams.get('method') as 'code' | 'token' | null;
  const tokenData = searchParams.get('data');

  const { mutateAsync: verifyEmail, isPending: isVerifying, error: verifyError } = useVerifyEmail();
  const { mutateAsync: resendEmail, isPending: isResending } = useResendEmail();

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  useErrorToast(verifyError?.message);

  useEffect(() => {
    if (method === 'token' && tokenData && userId) {
      verifyEmail({
        user_id: userId,
        method: 'token',
        data: tokenData,
      })
        .then(() => {
          toast.success('Email verified successfully, redirecting to dashboard...');
          queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
        })
        .catch(() => {
          // Error is handled by useErrorToast
        });
    }
  }, [method, tokenData, userId, verifyEmail, queryClient]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = useCallback(async () => {
    if (!userId || otp.length !== 6) return;

    try {
      await verifyEmail({
        user_id: userId,
        method: 'code',
        data: otp,
      });
      toast.success('Email verified successfully, redirecting to dashboard...');
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    } catch {
      // Error handled by toast
    }
  }, [userId, otp, verifyEmail, queryClient]);

  const handleResend = useCallback(async () => {
    if (!userId || countdown > 0) return;

    try {
      await resendEmail({ user_id: userId });
      toast.success('Verification code sent successfully!');
      setCountdown(60);
      setOtp('');
    } catch {
      // Error handled by toast
    }
  }, [userId, countdown, resendEmail]);

  if (!userId) {
    return (
      <AuthShell>
        <div className='w-full max-w-md text-center'>
          <Reveal>
            <h1 className='mt-6 text-3xl font-bold text-foreground'>
              Invalid verification link
            </h1>
            <p className='mt-2 text-muted-foreground'>
              This verification link is invalid or missing required information.
            </p>
            <Button
              variant='brand'
              className='mt-6'
              onClick={() => navigate('/login')}
            >
              Go to login
            </Button>
          </Reveal>
        </div>
      </AuthShell>
    );
  }

  if (method === 'token' && isVerifying) {
    return (
      <AuthShell>
        <div className='w-full max-w-md text-center'>
          <Reveal>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10'>
              <IconMail className='h-8 w-8 text-teal-600 dark:text-teal-300' />
            </div>
            <h1 className='mt-6 text-3xl font-bold text-foreground'>
              Verifying your email...
            </h1>
            <p className='mt-2 text-muted-foreground'>
              Please wait while we verify your email address.
            </p>
          </Reveal>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className='w-full max-w-md text-center'>
        <Reveal>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10'>
            <IconMail className='h-8 w-8 text-teal-600 dark:text-teal-300' />
          </div>
          <h1 className='mt-6 text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl'>
            Verify your email
          </h1>
          <p className='mx-auto mt-2.5 max-w-sm text-pretty text-base leading-relaxed text-muted-foreground'>
            We've sent a 6-digit verification code to your email. Enter it below
            to verify your account.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className='mt-8'>
            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={isVerifying}
            />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className='mt-8 space-y-4'>
            <Button
              variant='brand'
              size='lg'
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className='w-full'
            >
              {isVerifying ? 'Verifying...' : 'Verify email'}
            </Button>

            <div className='text-sm text-muted-foreground'>
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className='text-muted-foreground/70'>
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={isResending}
                  className='font-medium text-teal-600 transition-colors hover:text-teal-500 disabled:opacity-50 dark:text-teal-300 dark:hover:text-teal-200'
                >
                  {isResending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </AuthShell>
  );
}

export default VerifyEmail;
