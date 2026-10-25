import Badge from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import { useAuth } from '@/hooks/useAuth';
import { IconArrowRight, IconSparkles } from '@tabler/icons-react';

function CTA() {
  const { isAuthenticated } = useAuth();

  return (
    <section className='relative overflow-hidden py-24 sm:py-36'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute left-1/2 top-1/2 h-96 w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[140px] dark:bg-teal-400/[0.08]' />
      </div>

      <Container>
        <Reveal className='mx-auto max-w-3xl text-center'>
          <Badge icon={IconSparkles}>
            Free to start · No credit card required
          </Badge>

          <h2 className='mx-auto mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl'>
            Stop digging through PDFs for answers
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-pretty text-muted-foreground'>
            Bring your most important documents to life. Ask, watch the answer
            stream in, and verify every source in seconds.
          </p>

          <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            {isAuthenticated ? (
              <ButtonLink
                to='/dashboard'
                variant='brand'
                size='lg'
                className='group w-full sm:w-auto'
              >
                Go to Dashboard
                <IconArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink
                  to='/register'
                  variant='brand'
                  size='lg'
                  className='group w-full sm:w-auto'
                >
                  Get started free
                  <IconArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
                </ButtonLink>
                <ButtonLink
                  to='/login'
                  variant='outline'
                  size='lg'
                  className='w-full sm:w-auto'
                >
                  Sign in
                </ButtonLink>
              </>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default CTA;
